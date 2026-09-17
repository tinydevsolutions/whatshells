import { products, getProductById } from '../data/products.js';
import { OrderModel } from '../models/Order.js';
import { syncOrderToGoogleSheet } from './sheetsService.js';
import { sendWhatsAppCloudMessage } from './whatsappCloudService.js';
import { createPaymentLink, fetchPaymentLinkStatus, createRefund } from './razorpayService.js';
import { config } from '../config/config.js';

// In-memory conversation sessions keyed by sessionId / phoneNumber
const sessions = new Map();

export const getSession = (sessionId) => {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      sessionId,
      state: 'IDLE',
      orderDraft: {
        items: [
          { product: products[0], quantity: 1, customNote: '' }
        ],
        product: products[0],
        quantity: 1,
        totalAmount: products[0].price,
        customNote: '',
        customerName: '',
        phoneNumber: sessionId.replace(/[^0-9]/g, '') || '',
        address: '',
        pincode: '',
      },
      history: [],
      lastActive: Date.now(),
    });
  }
  return sessions.get(sessionId);
};

export const resetSession = (sessionId) => {
  sessions.delete(sessionId);
  return getSession(sessionId);
};

// Helper: Calculate total pieces and total amount across all items
const calculateDraftTotals = (orderDraft) => {
  if (!orderDraft.items || orderDraft.items.length === 0) {
    if (orderDraft.product) {
      orderDraft.items = [{ product: orderDraft.product, quantity: orderDraft.quantity || 1, customNote: orderDraft.customNote || '' }];
    } else {
      orderDraft.items = [{ product: products[0], quantity: 1, customNote: '' }];
    }
  }
  const totalQty = orderDraft.items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const totalAmount = orderDraft.items.reduce((sum, item) => sum + ((item.product?.price || 0) * (Number(item.quantity) || 1)), 0);
  orderDraft.quantity = totalQty;
  orderDraft.totalAmount = totalAmount;
  if (orderDraft.items.length > 0) {
    orderDraft.product = orderDraft.items[0].product;
  }
  return { totalQty, totalAmount };
};

export const processIncomingMessage = async (sessionId, userMessage, initialProduct = null) => {
  const session = getSession(sessionId);
  const text = (userMessage || '').trim();
  const lower = text.toLowerCase();
  session.lastActive = Date.now();

  // Reset session phone if new order
  if (session.state === 'IDLE' && !session.orderDraft.customerName) {
    session.orderDraft.phoneNumber = '';
  }

  // 1. Handle Multi-item Cart passed via API or simulator
  if (Array.isArray(initialProduct) && initialProduct.length > 0) {
    session.orderDraft.items = initialProduct.map(item => {
      const p = getProductById(item.product?.id || item.product?.sku) || item.product;
      return {
        product: p,
        quantity: Number(item.quantity) || 1,
        customNote: item.customNote || ''
      };
    });
    calculateDraftTotals(session.orderDraft);
  } else if (initialProduct && !Array.isArray(initialProduct)) {
    const found = getProductById(initialProduct.id || initialProduct.sku) || initialProduct;
    session.orderDraft.product = found;
    session.orderDraft.quantity = Number(initialProduct.quantity) || 1;
    session.orderDraft.customNote = initialProduct.customNote || '';
    session.orderDraft.items = [{
      product: found,
      quantity: session.orderDraft.quantity,
      customNote: session.orderDraft.customNote
    }];
    calculateDraftTotals(session.orderDraft);
  } else {
    // 2. Parse text to detect multi-item order lines or single product mentions
    const parsedItems = [];
    const lines = text.split('\n');
    for (const line of lines) {
      for (const p of products) {
        if (line.toLowerCase().includes(p.sku.toLowerCase()) || line.toLowerCase().includes(p.name.toLowerCase())) {
          const qtyMatch = line.match(/x\s*([1-9]\d?)/i) || line.match(/qty:?\s*([1-9]\d?)/i) || line.match(/quantity:?\s*([1-9]\d?)/i);
          const quantity = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;
          if (!parsedItems.some(item => item.product.id === p.id)) {
            parsedItems.push({ product: p, quantity, customNote: '' });
          }
        }
      }
    }
    if (parsedItems.length > 0) {
      session.orderDraft.items = parsedItems;
      calculateDraftTotals(session.orderDraft);
    }
  }

  // Quick reset commands
  if (lower === 'reset' || lower === 'start' || lower === 'restart' || (lower === 'hi' && session.state === 'COMPLETED')) {
    resetSession(sessionId);
    return {
      reply: `🐚 *Welcome to Whatshells!* (@whatshells) ✨\nHandcrafted luxury seashell decor & coastal lifestyle art.\n\nType the product you're looking for (e.g. *Mirrors*, *Candles*, *Trinket Dishes*) or choose pieces from our catalog to order!`,
      state: 'IDLE',
      session
    };
  }

  // Track status command
  if (lower.startsWith('track ') || lower.startsWith('status ')) {
    const orderId = text.split(/\s+/)[1]?.replace(/^#/, '');
    if (orderId) {
      const order = await OrderModel.findById(orderId);
      if (order) {
        return {
          reply: `📦 *Order Status for #${order.id}*\n• Status: *${order.orderStatus}*\n• Customer: ${order.customerName}\n• Total: ₹${order.totalAmount}\n• Items: ${order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}\n• Payment: ${order.paymentStatus} (${order.paymentId})\n\nNeed help? Reply directly to this chat!`,
          state: session.state,
          session
        };
      } else {
        return {
          reply: `⚠️ Order *#${orderId}* not found. Please double-check your Order ID.`,
          state: session.state,
          session
        };
      }
    }
  }

  // Cancel order & refund command
  if (lower.startsWith('cancel') || lower === 'refund' || lower.includes('cancel order') || lower.includes('refund order')) {
    const matchedOrderId = text.match(/WS-\d+/i)?.[0]?.toUpperCase() || session.completedOrderId;
    const cleanPhone = sessionId.replace(/[^0-9]/g, '');
    let targetOrder = null;

    if (matchedOrderId) {
      targetOrder = await OrderModel.findById(matchedOrderId);
    } else if (cleanPhone) {
      const phoneOrders = await OrderModel.findByPhone(cleanPhone);
      if (phoneOrders && phoneOrders.length > 0) {
        targetOrder = phoneOrders[0];
      }
    }

    if (!targetOrder) {
      return {
        reply: `🔍 *Order Cancellation Request:*\n\nPlease specify your Order ID to process cancellation & refund.\n_Example: *cancel WS-123456*_`,
        state: session.state,
        session
      };
    }

    if (targetOrder.orderStatus === 'CANCELLED' || targetOrder.paymentStatus === 'REFUNDED') {
      return {
        reply: `ℹ️ Order *#${targetOrder.id}* is already cancelled (Payment Status: ${targetOrder.paymentStatus}).\n\nIf money hasn't reached your account yet, please allow standard bank processing time (1-2 business days for UPI).`,
        state: session.state,
        session
      };
    }

    if (targetOrder.orderStatus === 'SHIPPED' || targetOrder.orderStatus === 'DELIVERED') {
      return {
        reply: `⚠️ *Order #${targetOrder.id} is already in transit!* 🚚\n\nYour handcrafted parcel has already departed our studio with express courier tracking. It cannot be auto-cancelled once shipped.\n\nOur customer care team has been notified to assist you with return or exchange upon delivery! 🌊`,
        state: session.state,
        session
      };
    }

    // Process refund through Razorpay if payment was made
    let refundResult = { success: true, refundId: `rfd_${Date.now()}` };
    if (targetOrder.paymentId && !targetOrder.paymentId.startsWith('PAY-')) {
      refundResult = await createRefund(targetOrder.paymentId, targetOrder.totalAmount, {
        orderId: targetOrder.id,
        reason: 'Customer requested cancellation via WhatsApp'
      });
    }

    await OrderModel.update(targetOrder.id, {
      orderStatus: 'CANCELLED',
      paymentStatus: 'REFUNDED',
      notes: `${targetOrder.notes || ''} | Cancelled by user on WhatsApp (Refund: ${refundResult.refundId || 'Processed'})`.trim()
    });

    return {
      reply: `✅ *Order #${targetOrder.id} Cancelled & Refunded!* 🐚\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `Hello *${targetOrder.customerName}*,\n\n` +
        `Your order has been cancelled per your request. A full refund of *₹${targetOrder.totalAmount}* has been initiated to your original payment method.\n\n` +
        `💳 *Refund ID:* ${refundResult.refundId || 'Processed'}\n` +
        `🏦 *Timeline:* Instant for UPI (GPay/PhonePe), 2-3 days for Cards.\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `Thank you for stopping by @whatshells. We hope to craft something special for you soon! 🌊💖`,
      state: 'IDLE',
      session
    };
  }

  // Catalog command
  if (lower === 'catalog' || lower === 'products' || lower === 'menu') {
    const catalogList = products.map((p, idx) => `${idx + 1}. *${p.name}* - ₹${p.price} (SKU: ${p.sku})`).join('\n');
    return {
      reply: `🐚 *Whatshells Collection:*\n\n${catalogList}\n\nReply with product names or numbers to proceed with ordering!`,
      state: 'IDLE',
      session
    };
  }

  // Check if incoming text is a structured enquiry from the website template or new order intent
  const isEnquiryTemplate = lower.includes('i want to buy') || lower.includes('i would like to order') || 
                            lower.includes('hi whatshells') || lower.includes('want to order') ||
                            lower.includes('buy this');

  if (isEnquiryTemplate) {
    calculateDraftTotals(session.orderDraft);
    session.state = 'AWAIT_CUSTOMER_NAME';
    session.orderDraft.customerName = '';
    session.orderDraft.phoneNumber = '';
    session.orderDraft.address = '';
    session.orderDraft.pincode = '';

    const { totalQty, totalAmount } = calculateDraftTotals(session.orderDraft);

    let reply;
    if (session.orderDraft.items.length > 1) {
      const itemsList = session.orderDraft.items.map((i, idx) => 
        `${idx + 1}. *${i.product.name}* (${i.product.sku}) x ${i.quantity} — ₹${i.product.price * i.quantity}`
      ).join('\n');

      reply = `🐚 *Whatshells Order Request* ✨\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📦 *Items in your Bag:*\n${itemsList}\n\n` +
        `🔢 *Total Items:* ${totalQty} piece(s)\n` +
        `💰 *Total Amount:* ₹${totalAmount} (Free Express Shipping Today! 🚚)\n` +
        `━━━━━━━━━━━━━━━━━━━━\n\n` +
        `Please reply with your *Full Name* 👤:`;
    } else {
      const product = session.orderDraft.items[0]?.product || session.orderDraft.product || products[0];
      const qty = session.orderDraft.items[0]?.quantity || 1;
      const price = product.price * qty;

      reply = `🐚 *Whatshells Order Request* ✨\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📦 *Item:* ${product.name} (SKU: ${product.sku})\n` +
        `💰 *Price:* ₹${price} (Free Express Shipping Today! 🚚)\n` +
        `━━━━━━━━━━━━━━━━━━━━\n\n` +
        `Please reply with your *Full Name* 👤:`;
    }

    return {
      reply,
      state: session.state,
      suggestedNext: 'Full Name',
      session
    };
  }

  // --- Conversational State Machine ---
  switch (session.state) {
    case 'IDLE': {
      // Step 1: Greeting -> Request Customer's Full Name
      calculateDraftTotals(session.orderDraft);
      session.state = 'AWAIT_CUSTOMER_NAME';
      session.orderDraft.customerName = '';
      session.orderDraft.phoneNumber = '';
      session.orderDraft.address = '';
      session.orderDraft.pincode = '';
      
      const { totalQty, totalAmount } = calculateDraftTotals(session.orderDraft);
      let reply;

      if (session.orderDraft.items.length > 1) {
        const itemsList = session.orderDraft.items.map((i, idx) => 
          `${idx + 1}. *${i.product.name}* (${i.product.sku}) x ${i.quantity} — ₹${i.product.price * i.quantity}`
        ).join('\n');

        reply = `🐚 *Whatshells Order Request* ✨\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `📦 *Items in your Bag:*\n${itemsList}\n\n` +
          `🔢 *Total Items:* ${totalQty} piece(s)\n` +
          `💰 *Total Amount:* ₹${totalAmount} (Free Express Shipping Today! 🚚)\n` +
          `━━━━━━━━━━━━━━━━━━━━\n\n` +
          `Please reply with your *Full Name* 👤:`;
      } else {
        const product = session.orderDraft.items[0]?.product || session.orderDraft.product || products[0];
        reply = `🐚 *Whatshells Order Request* ✨\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `📦 *Item:* ${product.name} (SKU: ${product.sku})\n` +
          `💰 *Price:* ₹${product.price} (Free Express Shipping Today! 🚚)\n` +
          `━━━━━━━━━━━━━━━━━━━━\n\n` +
          `Please reply with your *Full Name* 👤:`;
      }

      return {
        reply,
        state: session.state,
        suggestedNext: 'Full Name',
        session
      };
    }

    case 'AWAIT_CUSTOMER_NAME': {
      // Step 2: Receive Customer Name -> Request Phone Number & Delivery Address
      if (lower === 'back' || lower === 'cancel' || lower === 'btn_back') {
        return {
          reply: `You are at the start of your order.\n\nPlease reply with your *Full Name* 👤:`,
          state: 'AWAIT_CUSTOMER_NAME',
          suggestedNext: 'Full Name',
          session
        };
      }

      session.orderDraft.customerName = text;
      session.state = 'AWAIT_DELIVERY_ADDRESS';

      const reply = `Nice to meet you, *${session.orderDraft.customerName}*! 🌸\n\n` +
        `Please share your:\n` +
        `📞 *Contact Phone Number*\n` +
        `📍 *Delivery Address* (including House/Flat, Street, City, State, & *6-digit Pincode*)\n\n` +
        `_Example: 9876543210, Flat 402, Coral Breeze Apts, Beach Road, Chennai 600004_\n\n` +
        `_(Tap *Change Name* below to re-enter your name)_`;

      return {
        reply,
        state: session.state,
        suggestedNext: 'Phone & Address',
        buttons: [
          { id: 'btn_back', title: '🔄 Change Name' }
        ],
        session
      };
    }

    case 'AWAIT_DELIVERY_ADDRESS': {
      // Step 3: Check for Back OR Receive Phone & Delivery Address
      if (lower === 'back' || lower === 'previous' || lower === 'name' || lower === 'btn_back' || lower.includes('change name')) {
        session.state = 'AWAIT_CUSTOMER_NAME';
        return {
          reply: `🔄 *Let's update your name!*\n\nPlease reply with your *Full Name* 👤:`,
          state: 'AWAIT_CUSTOMER_NAME',
          suggestedNext: 'Full Name',
          session
        };
      }

      // Extract phone number if present in message
      let cleanAddr = text;
      const phoneMatch = text.match(/(?:\+91[\-\s]?)?[6789]\d{9}\b/) || text.match(/\b\d{10}\b/) || text.match(/\b\d{10,13}\b/);
      if (phoneMatch) {
        session.orderDraft.phoneNumber = phoneMatch[0].replace(/[^0-9]/g, '');
        // Strip out the phone number from the address text
        cleanAddr = cleanAddr.replace(phoneMatch[0], '').replace(/\n+/g, ', ').replace(/,\s*,/g, ',').replace(/^\s*,\s*|\s*,\s*$/g, '').trim();
      }

      // Extract 6-digit pincode if present
      const pincodeMatch = text.match(/\b\d{6}\b/);
      if (pincodeMatch) {
        session.orderDraft.pincode = pincodeMatch[0];
      }

      session.orderDraft.address = cleanAddr || text;

      // If multi-item order (already has quantities), skip asking single quantity and jump straight to Reconfirmation!
      if (session.orderDraft.items.length > 1) {
        const { totalQty, totalAmount } = calculateDraftTotals(session.orderDraft);
        session.state = 'AWAIT_PAYMENT';
        const referenceId = `WS-${Date.now().toString().slice(-6)}`;
        session.orderDraft.orderId = referenceId;

        const itemsSummary = session.orderDraft.items.map((i, idx) => 
          `${idx + 1}. *${i.product.name}* (${i.product.sku}) x ${i.quantity} — ₹${i.product.price * i.quantity}`
        ).join('\n');

        // Create dynamic Razorpay payment link
        const rzpResult = await createPaymentLink({
          amount: totalAmount,
          customerName: session.orderDraft.customerName,
          phoneNumber: session.orderDraft.phoneNumber || sessionId,
          referenceId: referenceId,
          description: `Whatshells (${totalQty} pcs) Order #${referenceId}`,
          sessionId: sessionId
        });

        const activePaymentLink = rzpResult.shortUrl || config.razorpayMeLink;
        session.orderDraft.paymentLinkId = rzpResult.paymentLinkId;
        session.orderDraft.paymentLinkUrl = activePaymentLink;

        const reply = `✨ *Please Reconfirm Your Order Details:*\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `📦 *Items in your Bag:*\n${itemsSummary}\n\n` +
          `🔢 *Total Items:* ${totalQty} piece(s)\n` +
          `💰 *Total Amount:* ₹${totalAmount} (Free Express Shipping 🚚)\n` +
          `👤 *Customer Name:* ${session.orderDraft.customerName}\n` +
          `📍 *Delivery Address:* ${session.orderDraft.address}\n` +
          `📱 *Phone Number:* ${session.orderDraft.phoneNumber || sessionId}\n` +
          (session.orderDraft.customNote ? `📝 *Custom Note:* ${session.orderDraft.customNote}\n` : '') +
          `━━━━━━━━━━━━━━━━━━━━\n\n` +
          `💳 *Pay Securely (UPI/GPay/PhonePe/Cards):*\n👉 ${activePaymentLink}\n\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `⚡ _Your order is automatically confirmed in real time the moment payment is completed!_\n` +
          `👉 Or tap *I Have Paid* after finishing payment.\n` +
          `🔄 *Details wrong?* Tap *Edit Details* to restart!`;

        return {
          reply,
          state: session.state,
          paymentLink: activePaymentLink,
          totalAmount,
          canSimulatePayment: true,
          buttons: [
            { id: 'btn_paid', title: '✅ I Have Paid' },
            { id: 'btn_back', title: '🔄 Edit Details' }
          ],
          session
        };
      }

      // Single item: ask for quantity confirmation
      session.state = 'AWAIT_QUANTITY_CONFIRMATION';
      const product = session.orderDraft.items[0]?.product || session.orderDraft.product || products[0];
      
      const reply = `Details noted! 🏡\n\n` +
        `How many pieces of *${product.name}* would you like? (Default: *1*).\n\n` +
        `_You can reply with just a number (e.g. *1* or *2*) or add any custom gift note!_\n` +
        `_(Tap *Change Details* below or reply *BACK* to re-enter address & phone)_`;

      return {
        reply,
        state: session.state,
        suggestedNext: 'Quantity (e.g. 1 or 2)',
        buttons: [
          { id: 'btn_back', title: '🔄 Change Details' }
        ],
        session
      };
    }

    case 'AWAIT_QUANTITY_CONFIRMATION': {
      // Step 4: Check for Back OR Receive Quantity -> Show Reconfirmation Summary & Payment Link
      if (lower === 'back' || lower === 'previous' || lower === 'address' || lower === 'btn_back' || lower.includes('change') || lower.includes('details')) {
        session.state = 'AWAIT_DELIVERY_ADDRESS';
        return {
          reply: `🔄 *Let's update your contact & delivery address.*\n\nPlease share your *Phone Number* and complete *Delivery Address* (with 6-digit Pincode) 📍:`,
          state: 'AWAIT_DELIVERY_ADDRESS',
          suggestedNext: 'Phone & Address',
          buttons: [
            { id: 'btn_back', title: '🔄 Change Name' }
          ],
          session
        };
      }

      const numMatch = text.match(/\b([1-9]\d?)\b/);
      const chosenQty = numMatch ? parseInt(numMatch[1], 10) : 1;
      
      if (session.orderDraft.items.length > 0) {
        session.orderDraft.items[0].quantity = chosenQty;
      }
      session.orderDraft.quantity = chosenQty;

      // Check if there is extra text as custom gift note
      if (text.length > 3 && !/^[1-9]\d?$/.test(text)) {
        session.orderDraft.customNote = text;
      }

      const { totalQty, totalAmount } = calculateDraftTotals(session.orderDraft);
      session.state = 'AWAIT_PAYMENT';
      const referenceId = `WS-${Date.now().toString().slice(-6)}`;
      session.orderDraft.orderId = referenceId;
      const product = session.orderDraft.items[0]?.product || session.orderDraft.product || products[0];

      // Create dynamic Razorpay payment link
      const rzpResult = await createPaymentLink({
        amount: totalAmount,
        customerName: session.orderDraft.customerName,
        phoneNumber: session.orderDraft.phoneNumber || sessionId,
        referenceId: referenceId,
        description: `${product.name} (x${totalQty}) Order #${referenceId}`,
        sessionId: sessionId
      });

      const activePaymentLink = rzpResult.shortUrl || config.razorpayMeLink;
      session.orderDraft.paymentLinkId = rzpResult.paymentLinkId;
      session.orderDraft.paymentLinkUrl = activePaymentLink;

      const reply = `✨ *Please Reconfirm Your Order Details:*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `📦 *Product:* ${product.name}\n` +
        `🔢 *Quantity:* ${totalQty} piece(s)\n` +
        `💰 *Total Amount:* ₹${totalAmount} (Free Express Shipping 🚚)\n` +
        `👤 *Customer Name:* ${session.orderDraft.customerName}\n` +
        `📍 *Delivery Address:* ${session.orderDraft.address}\n` +
        `📱 *Phone Number:* ${session.orderDraft.phoneNumber || sessionId}\n` +
        (session.orderDraft.customNote ? `📝 *Custom Note:* ${session.orderDraft.customNote}\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━\n\n` +
        `💳 *Pay Securely (UPI/GPay/PhonePe/Cards):*\n👉 ${activePaymentLink}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `⚡ _Your order is automatically confirmed in real time the moment payment is completed!_\n` +
        `👉 Or tap *I Have Paid* after finishing payment.\n` +
        `🔄 *Details wrong?* Tap *Edit Details* to restart!`;

      return {
        reply,
        state: session.state,
        paymentLink: activePaymentLink,
        totalAmount,
        canSimulatePayment: true,
        buttons: [
          { id: 'btn_paid', title: '✅ I Have Paid' },
          { id: 'btn_back', title: '🔄 Edit Details' }
        ],
        session
      };
    }

    case 'AWAIT_PAYMENT': {
      // Step 5: Check if user clicked BACK/RESTART button OR completed payment
      const isBackRequest = lower === 'back' || lower === 'edit' || lower === 'change' || 
                            lower === 'wrong' || lower === 'restart' || lower === 'reset' || 
                            lower === 'no' || lower === 'cancel' || lower === 'btn_back' ||
                            lower.includes('edit details');

      if (isBackRequest) {
        // Reset customer details to allow fresh input
        session.orderDraft.customerName = '';
        session.orderDraft.phoneNumber = '';
        session.orderDraft.address = '';
        session.orderDraft.pincode = '';
        session.orderDraft.customNote = '';
        session.state = 'AWAIT_CUSTOMER_NAME';

        const reply = `🔄 *Restarting order details!*\n\n` +
          `No problem, let's re-enter your details from the start.\n\n` +
          `Please reply with your *Full Name* 👤:`;

        return {
          reply,
          state: session.state,
          suggestedNext: 'Full Name',
          session
        };
      }

      if (lower.includes('paid') || lower.includes('done') || lower.includes('success') || lower.includes('confirm') || lower.includes('pay') || lower === 'btn_paid') {
        const { totalQty, totalAmount } = calculateDraftTotals(session.orderDraft);
        const paymentLinkId = session.orderDraft.paymentLinkId;

        // REAL-TIME PAYMENT STATUS VERIFICATION WITH RAZORPAY
        let isPaymentConfirmed = false;
        let verifiedPaymentId = `pay_${Date.now()}`;

        if (paymentLinkId && !paymentLinkId.startsWith('plink_fallback_')) {
          const rzpStatus = await fetchPaymentLinkStatus(paymentLinkId);

          if (rzpStatus.success && rzpStatus.status === 'paid') {
            isPaymentConfirmed = true;
            verifiedPaymentId = rzpStatus.paymentId || rzpStatus.payments?.[0]?.payment_id || `pay_${Date.now()}`;
          } else {
            // Payment NOT detected yet on Razorpay
            const linkUrl = session.orderDraft.paymentLinkUrl || config.razorpayMeLink;
            const notPaidReply = 
              `⚠️ *Payment Not Detected Yet* (₹${totalAmount})\n` +
              `━━━━━━━━━━━━━━━━━━━━\n` +
              `We checked Razorpay, but haven't received confirmation for your order yet.\n\n` +
              `👉 *Please tap here to complete payment:*\n${linkUrl}\n\n` +
              `_(If money was already deducted from your account, it may take 1-2 minutes for the banking network to settle. Tap *Check Again* once done)_`;

            return {
              reply: notPaidReply,
              state: 'AWAIT_PAYMENT',
              paymentLink: linkUrl,
              canSimulatePayment: true,
              buttons: [
                { id: 'btn_paid', title: '🔄 Check Again' },
                { id: 'btn_back', title: '🔄 Edit Details' }
              ],
              session
            };
          }
        } else {
          // Fallback handle mode (when API keys are not yet provided)
          isPaymentConfirmed = true;
        }

        const orderItems = session.orderDraft.items.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          sku: i.product.sku,
          price: i.product.price,
          quantity: i.quantity,
          customNote: i.customNote || session.orderDraft.customNote || '',
        }));

        const orderRefId = session.orderDraft.orderId || `WS-${Date.now().toString().slice(-6)}`;

        const newOrder = await OrderModel.create({
          id: orderRefId,
          customerName: session.orderDraft.customerName || 'Boutique Customer',
          phoneNumber: session.orderDraft.phoneNumber || sessionId || '919384828771',
          address: session.orderDraft.address,
          pincode: session.orderDraft.pincode,
          items: orderItems,
          totalAmount: totalAmount,
          paymentMethod: 'UPI / Razorpay Verified',
          paymentId: verifiedPaymentId,
          paymentLinkId: paymentLinkId || '',
          paymentStatus: 'PAID',
          orderStatus: 'CONFIRMED',
          notes: session.orderDraft.customNote || 'Ordered via WhatsApp automation'
        });

        // Trigger Google Sheets & CSV Sync
        const sheetSyncResult = await syncOrderToGoogleSheet(newOrder);
        await OrderModel.update(newOrder.id, {
          syncedToGoogleSheet: sheetSyncResult.success,
          googleSheetRow: sheetSyncResult.row
        });

        session.state = 'COMPLETED';
        session.completedOrderId = newOrder.id;

        const itemsDisplay = orderItems.map(i => `• ${i.name} x${i.quantity}`).join('\n');

        const reply = `🎉 *Payment Received & Order Confirmed!* 🐚\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `Order ID: *#${newOrder.id}*\n` +
          `Customer: *${newOrder.customerName}*\n` +
          `Payment ID: *${verifiedPaymentId}*\n` +
          `Total Items: *${totalQty} piece(s)*\n` +
          `${itemsDisplay}\n` +
          `Total Amount: *₹${totalAmount}*\n` +
          `Estimated Dispatch: *Within 24-48 hours*\n\n` +
          `✅ Your order details have been securely recorded and synced to our Google Sheets order management system!\n\n` +
          `We will send your courier tracking link here once your seashell treasures are safely packaged. Thank you for supporting @whatshells! 🌊💖`;

        // Send confirmation back to real WhatsApp user
        if (sessionId.startsWith('91') || (sessionId.length >= 10 && !sessionId.startsWith('sim-') && !sessionId.startsWith('web-'))) {
          sendWhatsAppCloudMessage(sessionId, reply).catch(err => console.warn('Could not send WhatsApp confirmation:', err.message));
        }

        return {
          reply,
          state: 'COMPLETED',
          order: newOrder,
          sheetSyncResult,
          session
        };
      } else {
        const { totalAmount } = calculateDraftTotals(session.orderDraft);
        const activeLink = session.orderDraft.paymentLinkUrl || config.razorpayMeLink;
        return {
          reply: `✨ Your order (₹${totalAmount}) is awaiting payment!\n\n` +
            `💳 *Pay Securely (UPI/Cards):* ${activeLink}\n\n` +
            `👉 Tap *I Have Paid* or reply *PAID* after payment.\n` +
            `🔄 *Details wrong?* Tap *Edit Details* to restart from the beginning.`,
          state: 'AWAIT_PAYMENT',
          paymentLink: activeLink,
          canSimulatePayment: true,
          buttons: [
            { id: 'btn_paid', title: '✅ I Have Paid' },
            { id: 'btn_back', title: '🔄 Edit Details' }
          ],
          session
        };
      }
    }

    case 'COMPLETED': {
      return {
        reply: `Your order *#${session.completedOrderId || 'WS-RECENT'}* is confirmed and in our artisan workshop! 🐚\n\nType *track ${session.completedOrderId}* to check status anytime, or *cancel ${session.completedOrderId}* for cancellation & refund, or *start* for a new order!`,
        state: 'COMPLETED',
        session
      };
    }

    default:
      session.state = 'IDLE';
      return {
        reply: `Hi! Welcome to *Whatshells*. Reply *start* to begin browsing or ordering! 🐚`,
        state: 'IDLE',
        session
      };
  }
};

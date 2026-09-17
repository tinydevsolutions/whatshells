import { verifyWebhookSignature } from '../services/razorpayService.js';
import { OrderModel } from '../models/Order.js';
import { syncOrderToGoogleSheet } from '../services/sheetsService.js';
import { sendWhatsAppCloudMessage } from '../services/whatsappCloudService.js';
import { getSession, resetSession } from '../services/whatsappEngine.js';
import { config } from '../config/config.js';

/**
 * Handles incoming webhooks from Razorpay for real-time payment confirmation and refunds.
 */
export const handleRazorpayWebhook = async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const event = req.body?.event;

  console.log(`🔔 [Razorpay Webhook] Event Received: "${event}"`);

  // Verify webhook signature if configured
  if (config.razorpay.webhookSecret && signature) {
    const rawBody = req.rawBody || JSON.stringify(req.body);
    const isValid = verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn(`⚠️ [Razorpay Webhook] Invalid webhook signature from ${req.ip}`);
      return res.status(400).json({ error: 'Invalid signature' });
    }
  }

  try {
    switch (event) {
      case 'payment_link.paid':
      case 'payment.captured': {
        const plinkEntity = req.body?.payload?.payment_link?.entity;
        const paymentEntity = req.body?.payload?.payment?.entity;

        const paymentId = paymentEntity?.id || plinkEntity?.payment_id || `pay_${Date.now()}`;
        const paymentLinkId = plinkEntity?.id || '';
        const notes = plinkEntity?.notes || paymentEntity?.notes || {};
        
        const referenceId = notes.orderId || `WS-${Date.now().toString().slice(-6)}`;
        const sessionId = notes.sessionId || notes.phoneNumber || paymentEntity?.contact || '';
        const customerName = notes.customerName || paymentEntity?.name || 'Boutique Customer';
        const cleanPhone = (notes.phoneNumber || sessionId || paymentEntity?.contact || '').replace(/[^0-9]/g, '');
        const amountPaid = (paymentEntity?.amount || plinkEntity?.amount_paid || 0) / 100;
        const paymentMethod = paymentEntity?.method ? `Razorpay (${paymentEntity.method.toUpperCase()})` : 'UPI / Razorpay Verified';

        console.log(`💰 [Payment Captured] Order #${referenceId} - ₹${amountPaid} by ${customerName} (+${cleanPhone}) [Pay ID: ${paymentId}]`);

        // Check if order is already created
        let existingOrder = await OrderModel.findById(referenceId);

        if (!existingOrder) {
          // Look up session draft if available
          const session = getSession(sessionId || cleanPhone);
          const draft = session.orderDraft;

          const items = (draft.items && draft.items.length > 0)
            ? draft.items.map(i => ({
                productId: i.product?.id || 'ws-custom',
                name: i.product?.name || 'Handcrafted Shell Art',
                sku: i.product?.sku || 'WS-01',
                price: i.product?.price || amountPaid,
                quantity: i.quantity || 1,
                customNote: i.customNote || draft.customNote || ''
              }))
            : [{
                productId: draft.product?.id || 'ws-custom',
                name: draft.product?.name || 'Handcrafted Seashell Piece',
                sku: draft.product?.sku || 'WS-01',
                price: amountPaid,
                quantity: 1,
                customNote: draft.customNote || ''
              }];

          existingOrder = await OrderModel.create({
            id: referenceId,
            customerName: draft.customerName || customerName,
            phoneNumber: draft.phoneNumber || cleanPhone,
            address: draft.address || 'Delivered to verified customer address',
            pincode: draft.pincode || '',
            items: items,
            totalAmount: amountPaid || draft.totalAmount || 0,
            paymentMethod: paymentMethod,
            paymentId: paymentId,
            paymentLinkId: paymentLinkId,
            paymentStatus: 'PAID',
            orderStatus: 'CONFIRMED',
            notes: draft.customNote || 'Paid via Razorpay Webhook'
          });

          // Sync with Google Sheets
          try {
            await syncOrderToGoogleSheet(existingOrder);
          } catch (e) {
            console.warn('Sheets sync notice:', e.message);
          }
        } else {
          // Update existing order status to PAID
          existingOrder = await OrderModel.update(referenceId, {
            paymentStatus: 'PAID',
            orderStatus: 'CONFIRMED',
            paymentId: paymentId,
            paymentLinkId: paymentLinkId,
            paymentMethod: paymentMethod
          });
        }

        // Reset session for fresh future conversations
        if (sessionId) {
          const session = getSession(sessionId);
          session.state = 'COMPLETED';
        }

        // Send Instant WhatsApp Order Confirmation to customer!
        if (cleanPhone) {
          const itemsSummary = existingOrder.items.map(i => `• *${i.name}* (x${i.quantity})`).join('\n');
          const confirmationText = 
            `🎉 *PAYMENT RECEIVED & ORDER CONFIRMED!* 🐚✨\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `Thank you *${existingOrder.customerName}*! Your order has been placed successfully.\n\n` +
            `📦 *Order ID:* #${existingOrder.id}\n` +
            `💳 *Payment ID:* ${paymentId} (₹${existingOrder.totalAmount})\n` +
            `📍 *Delivery Address:* ${typeof existingOrder.address === 'string' ? existingOrder.address : existingOrder.address?.line1}\n\n` +
            `🛍️ *Items:* \n${itemsSummary}\n\n` +
            `🚚 *Shipping:* Express Insured Delivery with Zero-Breakage Packaging.\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `Our artisan team has begun preparing your shell pieces. You'll receive tracking updates right here on WhatsApp! 🌊`;

          await sendWhatsAppCloudMessage(cleanPhone, confirmationText, [
            { id: 'btn_track', title: '📦 Track Order' }
          ]);
        }

        break;
      }

      case 'refund.processed': {
        const refundEntity = req.body?.payload?.refund?.entity;
        const paymentEntity = req.body?.payload?.payment?.entity;
        const refundId = refundEntity?.id || `rfd_${Date.now()}`;
        const paymentId = refundEntity?.payment_id || paymentEntity?.id;
        const refundAmount = (refundEntity?.amount || 0) / 100;
        const notes = refundEntity?.notes || {};

        console.log(`💸 [Refund Processed] Refund ID: ${refundId} for Payment ${paymentId} (₹${refundAmount})`);

        // Find order by paymentId or notes.orderId
        const allOrders = await OrderModel.getAll();
        const matchedOrder = allOrders.find(o => o.paymentId === paymentId || (notes.orderId && o.id === notes.orderId));

        if (matchedOrder) {
          await OrderModel.update(matchedOrder.id, {
            orderStatus: 'CANCELLED',
            paymentStatus: 'REFUNDED',
            notes: `${matchedOrder.notes || ''} | Refunded ₹${refundAmount} (${refundId})`.trim()
          });

          // Notify customer on WhatsApp
          if (matchedOrder.phoneNumber) {
            const refundMsg =
              `✅ *REFUND PROCESSED SUCCESSFUL* 🐚\n` +
              `━━━━━━━━━━━━━━━━━━━━\n` +
              `Hello *${matchedOrder.customerName}*,\n\n` +
              `A full refund of *₹${refundAmount || matchedOrder.totalAmount}* has been successfully processed for Order *#${matchedOrder.id}*.\n\n` +
              `💳 *Refund ID:* ${refundId}\n` +
              `🏦 *Method:* Credited back to your original payment account.\n` +
              `━━━━━━━━━━━━━━━━━━━━\n` +
              `If you have any questions, feel free to reply to this chat! 🌊`;

            await sendWhatsAppCloudMessage(matchedOrder.phoneNumber, refundMsg);
          }
        }
        break;
      }

      case 'payment.failed': {
        const paymentEntity = req.body?.payload?.payment?.entity;
        const phone = paymentEntity?.contact?.replace(/[^0-9]/g, '');
        const amount = (paymentEntity?.amount || 0) / 100;
        const errorDesc = paymentEntity?.error_description || 'Transaction declined';

        console.warn(`❌ [Payment Failed] For +${phone} (₹${amount}): ${errorDesc}`);

        if (phone) {
          const failMsg =
            `⚠️ *Payment Incomplete for Whatshells Order*\n` +
            `━━━━━━━━━━━━━━━━━━━━\n` +
            `We noticed your payment of *₹${amount}* could not be processed (${errorDesc}).\n\n` +
            `👉 If you'd like to try again or need a new payment link, reply *PAY* or tap below:`;

          await sendWhatsAppCloudMessage(phone, failMsg, [
            { id: 'btn_pay', title: '💳 Try Again' }
          ]);
        }
        break;
      }

      default:
        console.log(`ℹ️ [Razorpay Webhook] Unhandled event type: ${event}`);
    }

    return res.status(200).json({ status: 'ok', received: true });
  } catch (err) {
    console.error(`❌ [Razorpay Webhook Error]:`, err);
    return res.status(500).json({ error: err.message });
  }
};

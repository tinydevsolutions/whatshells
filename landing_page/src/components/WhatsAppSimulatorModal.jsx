import React, { useState, useEffect, useRef } from 'react';
import { 
  FaWhatsapp, 
  FaXmark, 
  FaPaperPlane, 
  FaRotateRight, 
  FaCheckDouble, 
  FaCreditCard, 
  FaTableList, 
  FaCircleCheck, 
  FaShieldHalved,
  FaRobot
} from 'react-icons/fa6';
import { API_BASE_URL, STORE_PHONE, products } from '../data/products';
import logoImg from '../assets/logo.jpg';

export default function WhatsAppSimulatorModal({ isOpen, onClose, initialProduct = null, initialCart = null }) {
  const [sessionId] = useState(() => 'sim-' + Math.floor(100000 + Math.random() * 900000));
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentState, setCurrentState] = useState('IDLE');
  const [activePaymentLink, setActivePaymentLink] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [sheetSyncInfo, setSheetSyncInfo] = useState(null);
  const [apiConnected, setApiConnected] = useState(true);

  const formatAddress = (addr) => {
    if (!addr) return '';
    if (typeof addr === 'string') return addr;
    return [addr.line1, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ');
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initialize or reset chat when modal opens or initial product/cart changes
  useEffect(() => {
    if (isOpen) {
      startInitialChat();
    }
  }, [isOpen, initialProduct, initialCart]);

  const startInitialChat = async () => {
    let initialText;
    let targetPayload;

    if (initialCart && initialCart.length > 0) {
      targetPayload = initialCart;
      const itemsList = initialCart.map((item, idx) => {
        const p = item.product;
        const qty = item.quantity || 1;
        return `${idx + 1}. *${p.name}* (${p.sku}) x ${qty} - ₹${p.price * qty}`;
      }).join('\n');
      const totalQty = initialCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      const totalAmt = initialCart.reduce((sum, item) => sum + (item.product.price * (item.quantity || 1)), 0);

      initialText = `Hi Whatshells! 🐚✨\n\nI would like to order the following items from your collection:\n${itemsList}\n\n━━━━━━━━━━━━━━━━━━━━\n📦 *Total:* ${totalQty} item(s) | 💰 *Total Amount:* ₹${totalAmt} (Free Express Shipping Today! 🚚)\n━━━━━━━━━━━━━━━━━━━━\n\nCould you please confirm availability and guide me through the address & payment details?`;
    } else {
      const targetProduct = initialProduct || products[0];
      targetPayload = targetProduct;
      initialText = `Hi Whatshells! 🐚✨ I want to buy: *${targetProduct.name}* (SKU: ${targetProduct.sku}) - Qty: ${targetProduct.quantity || 1}. Could you please confirm availability and guide me through the order?`;
    }

    setMessages([
      {
        id: 'msg-1',
        sender: 'user',
        text: initialText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      }
    ]);
    setCompletedOrder(null);
    setSheetSyncInfo(null);
    setActivePaymentLink(null);

    // Trigger initial bot response
    await sendBotRequest(initialText, targetPayload);
  };

  const sendBotRequest = async (userText, productContext = null) => {
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: userText,
          product: productContext || initialCart || initialProduct || products[0]
        })
      });

      if (!res.ok) throw new Error('API offline');
      const data = await res.json();
      
      setApiConnected(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: 'bot-' + Date.now(),
            sender: 'bot',
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            canPay: Boolean(data.canSimulatePayment || data.paymentLink),
            paymentLink: data.paymentLink,
            order: data.order,
            sheetSyncResult: data.sheetSyncResult,
            buttons: data.buttons || []
          }
        ]);
        setCurrentState(data.state);
        if (data.paymentLink) setActivePaymentLink(data.paymentLink);
        if (data.order) setCompletedOrder(data.order);
        if (data.sheetSyncResult) setSheetSyncInfo(data.sheetSyncResult);
      }, 700);

    } catch (err) {
      console.warn('Backend API not reachable, using built-in client simulation fallback:', err);
      setApiConnected(false);
      
      // Resilient client-side fallback simulation so UI never fails
      setTimeout(() => {
        setIsTyping(false);
        handleClientFallback(userText);
      }, 700);
    }
  };

  const handleClientFallback = (text) => {
    const lower = text.toLowerCase();
    const product = initialProduct || products[0];

    if (currentState === 'IDLE' || lower.includes('hi') || lower.includes('buy')) {
      setCurrentState('AWAIT_DETAILS');
      addBotMessage(
        `Hi! Welcome to *Whatshells* (@whatshells) 🐚✨\n\nWe'd love to help you order the *${product.name}* (SKU: ${product.sku})!\n💰 *Price:* ₹${product.price} (Free express shipping today! 🚚)\n\nPlease share your *Full Name* and *Phone Number* 📝`
      );
    } else if (currentState === 'AWAIT_DETAILS') {
      setCurrentState('AWAIT_ADDRESS');
      addBotMessage(
        `Thanks! 🌸\n\nPlease enter your complete *Delivery Address* including City, State, and *6-digit Pincode* 📍`
      );
    } else if (currentState === 'AWAIT_ADDRESS') {
      setCurrentState('AWAIT_PAYMENT');
      const total = product.price * (initialProduct?.quantity || 1);
      setActivePaymentLink('https://razorpay.me/@navaneethakrishnanm');
      addBotMessage(
        `✨ *Order Summary:*\n📦 *Item:* ${product.name}\n💰 *Total Amount:* ₹${total} (Free Shipping)\n📍 *Deliver to:* ${text}\n\n💳 *Pay via Razorpay:* https://razorpay.me/@navaneethakrishnanm\n\nPlease click below or tap *I Have Paid* after payment.`,
        true
      );
    } else if (currentState === 'AWAIT_PAYMENT' || lower.includes('paid')) {
      completeFallbackOrder();
    } else {
      addBotMessage(`Reply with *PAID* to confirm order or *restart* to begin again! 🐚`);
    }
  };

  const addBotMessage = (text, canPay = false) => {
    setMessages((prev) => [
      ...prev,
      {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        canPay
      }
    ]);
  };

  const completeFallbackOrder = () => {
    const product = initialProduct || products[0];
    const orderId = `WS-${Math.floor(100000 + Math.random() * 900000)}`;
    const total = product.price * (initialProduct?.quantity || 1);
    
    const mockOrder = {
      id: orderId,
      customerName: 'Ananya Sharma',
      phoneNumber: '+91 98765 43210',
      address: '12/A Ocean Breeze Villa, Miramar, Goa - 403001',
      pincode: '403001',
      items: [{ name: product.name, sku: product.sku, quantity: 1, price: product.price }],
      totalAmount: total,
      paymentId: `PAY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      orderStatus: 'CONFIRMED',
      paymentStatus: 'PAID'
    };

    setCompletedOrder(mockOrder);
    setSheetSyncInfo({
      success: true,
      method: 'GOOGLE_SHEETS_API / SIMULATOR',
      row: [
        orderId,
        new Date().toLocaleString('en-IN'),
        mockOrder.customerName,
        mockOrder.phoneNumber,
        mockOrder.address,
        mockOrder.pincode,
        `${product.name} (x1)`,
        1,
        `₹${total}`,
        mockOrder.paymentId,
        'PAID',
        'CONFIRMED',
        'Auto synced via WhatsApp Bot'
      ]
    });

    setCurrentState('COMPLETED');
    addBotMessage(
      `🎉 *Payment Received & Order Confirmed!* 🐚\n\nOrder ID: *#${orderId}*\nAmount: *₹${total}*\nEstimated Dispatch: *Within 24-48 hours*\n\n✅ Your order details have been securely recorded and synced to our Google Sheets order management system!\n\nThank you for supporting @whatshells! 🌊💖`
    );
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue('');

    setMessages((prev) => [
      ...prev,
      {
        id: 'user-' + Date.now(),
        sender: 'user',
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      }
    ]);

    sendBotRequest(userText);
  };

  const handleSimulatePayment = async () => {
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE_URL}/chat/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (!res.ok) throw new Error('API offline');
      const data = await res.json();

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: 'user-paid-' + Date.now(),
          sender: 'user',
          text: 'PAID ✅ (Simulated UPI Payment)',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        },
        {
          id: 'bot-confirmed-' + Date.now(),
          sender: 'bot',
          text: data.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          order: data.order,
          sheetSyncResult: data.sheetSyncResult
        }
      ]);
      setCurrentState('COMPLETED');
      if (data.order) setCompletedOrder(data.order);
      if (data.sheetSyncResult) setSheetSyncInfo(data.sheetSyncResult);

    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: 'user-paid-' + Date.now(),
          sender: 'user',
          text: 'PAID ✅ (Simulated UPI Payment)',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read'
        }
      ]);
      completeFallbackOrder();
    }
  };

  const handleQuickReply = (text) => {
    setInputValue(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      
      {/* Phone Mockup Window */}
      <div 
        className="relative bg-[#111b21] w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl border-4 border-[#2a3942] flex flex-col h-[650px] max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* WhatsApp Top App Header */}
        <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between shadow-md z-10">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/40 flex items-center justify-center bg-white shadow-xs">
                <img src={logoImg} alt="What Shells" className="w-full h-full object-cover" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#075e54]"></span>
            </div>

            {/* Title & Status */}
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm leading-tight">
                <span>Whatshells Store</span>
                <span className="text-emerald-300 text-xs">✓</span>
              </div>
              <div className="text-[11px] text-emerald-100 flex items-center gap-1">
                <span>WhatsApp Automated Bot</span>
                <span>• Online</span>
              </div>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1">
            <button
              onClick={startInitialChat}
              className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              title="Reset Chat"
            >
              <FaRotateRight className="text-xs" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <FaXmark className="text-base" />
            </button>
          </div>
        </div>

        {/* Backend Connectivity Bar */}
        <div className="bg-[#1f2c34] px-3 py-1 text-[10px] text-gray-300 flex items-center justify-between border-b border-[#2a3942]">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
            <span>{apiConnected ? 'Connected to store_api workflow engine' : 'Client Simulator Mode'}</span>
          </div>
          <span className="text-[9px] font-mono text-gray-400">Session: {sessionId.slice(-6)}</span>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 whatsapp-chat-bg">
          
          {/* Encryption notice pill */}
          <div className="text-center">
            <span className="inline-block bg-[#ffeecd] text-[#54656f] text-[10px] px-3 py-1 rounded-lg shadow-2xs font-medium">
              🔒 End-to-end automated Whatshells order simulation
            </span>
          </div>

          {/* Render Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs text-[#111b21] leading-relaxed shadow-xs whitespace-pre-line ${
                  msg.sender === 'user' ? 'whatsapp-bubble-sent rounded-tr-xs' : 'whatsapp-bubble-received rounded-tl-xs'
                }`}
              >
                {msg.text}

                {/* Interactive Action Buttons inside Bot Message */}
                {msg.buttons && msg.buttons.length > 0 && currentState !== 'COMPLETED' && (
                  <div className="mt-2.5 pt-2 border-t border-gray-200/80 space-y-1.5">
                    {msg.buttons.map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => {
                          if (btn.id === 'btn_paid') {
                            handleSimulatePayment();
                          } else {
                            setMessages((prev) => [
                              ...prev,
                              {
                                id: 'user-' + Date.now(),
                                sender: 'user',
                                text: btn.title,
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                status: 'read'
                              }
                            ]);
                            sendBotRequest(btn.id);
                          }
                        }}
                        className={`w-full py-1.5 px-3 rounded-xl font-bold text-xs shadow-2xs flex items-center justify-center gap-1.5 transition-transform active:scale-95 ${
                          btn.id === 'btn_paid'
                            ? 'bg-[#25D366] hover:bg-[#20ba59] text-white'
                            : 'bg-white/95 hover:bg-white text-gray-800 border border-gray-300'
                        }`}
                      >
                        <span>{btn.title}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Interactive Payment Trigger Fallback */}
                {(!msg.buttons || msg.buttons.length === 0) && msg.canPay && currentState === 'AWAIT_PAYMENT' && (
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <button
                      onClick={handleSimulatePayment}
                      className="w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                    >
                      <FaCreditCard className="text-xs" />
                      <span>Simulate Instant UPI Payment (₹{msg.order?.totalAmount || 'Pay'})</span>
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-end gap-1 text-[9px] text-gray-500 mt-1">
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && <FaCheckDouble className="text-[#53bdeb] text-[10px]" />}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-1 bg-white px-3 py-2 rounded-2xl rounded-tl-xs shadow-xs w-16">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          )}

          {/* Completed Order & Google Sheets Live Sync Card */}
          {completedOrder && (
            <div className="bg-[#173847] text-white p-3.5 rounded-2xl shadow-md border border-emerald-400/40 space-y-2 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                  <FaCircleCheck className="text-emerald-400" />
                  <span>Order Synced Live!</span>
                </div>
                <span className="font-mono bg-white/20 px-2 py-0.5 rounded text-[10px]">
                  #{completedOrder.id}
                </span>
              </div>

              <div className="text-[11px] text-slate-200 space-y-1 bg-black/20 p-2.5 rounded-xl">
                <div><strong>Customer:</strong> {completedOrder.customerName}</div>
                <div><strong>Total:</strong> ₹{completedOrder.totalAmount} • {completedOrder.paymentStatus}</div>
                <div className="truncate"><strong>Address:</strong> {formatAddress(completedOrder.address)}</div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-emerald-200 pt-1">
                <FaTableList className="text-emerald-400" />
                <span>Uploaded row to Google Sheet (Sheet ID / Orders.csv)</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-[#202c33] px-3 py-2 overflow-x-auto scrollbar-none flex items-center gap-2">
          {currentState === 'AWAIT_CUSTOMER_NAME' && (
            <>
              <button
                onClick={() => handleQuickReply('Ananya Sharma')}
                className="text-[11px] bg-[#2a3942] text-gray-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-[#374955] transition-colors"
              >
                👤 Ananya Sharma
              </button>
              <button
                onClick={() => handleQuickReply('Rohan Varma')}
                className="text-[11px] bg-[#2a3942] text-gray-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-[#374955] transition-colors"
              >
                👤 Rohan Varma
              </button>
            </>
          )}

          {currentState === 'AWAIT_DELIVERY_ADDRESS' && (
            <>
              <button
                onClick={() => handleQuickReply('Flat 402, Sea Pearl Apts, Bandra West, Mumbai - 400050')}
                className="text-[11px] bg-[#2a3942] text-gray-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-[#374955] transition-colors"
              >
                📍 Mumbai (400050)
              </button>
              <button
                onClick={() => handleQuickReply('12/A Ocean Breeze Villa, Miramar, Goa - 403001')}
                className="text-[11px] bg-[#2a3942] text-gray-200 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-[#374955] transition-colors"
              >
                📍 Goa (403001)
              </button>
              <button
                onClick={() => handleQuickReply('BACK')}
                className="text-[11px] bg-red-900/40 text-red-200 border border-red-700/50 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-red-800/60 transition-colors"
              >
                🔄 BACK
              </button>
            </>
          )}

          {currentState === 'AWAIT_QUANTITY_CONFIRMATION' && (
            <>
              <button
                onClick={() => handleQuickReply('1')}
                className="text-[11px] bg-[#2a3942] text-gray-200 px-3 py-1 rounded-full whitespace-nowrap hover:bg-[#374955]"
              >
                1 piece
              </button>
              <button
                onClick={() => handleQuickReply('2 (Please pack nicely as a gift)')}
                className="text-[11px] bg-[#2a3942] text-gray-200 px-3 py-1 rounded-full whitespace-nowrap hover:bg-[#374955]"
              >
                2 pieces (Gift pack)
              </button>
              <button
                onClick={() => handleQuickReply('BACK')}
                className="text-[11px] bg-red-900/40 text-red-200 border border-red-700/50 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-red-800/60 transition-colors"
              >
                🔄 BACK
              </button>
            </>
          )}

          {currentState === 'AWAIT_PAYMENT' && (
            <>
              <button
                onClick={handleSimulatePayment}
                className="text-[11px] bg-[#25D366] text-white font-bold px-3 py-1 rounded-full whitespace-nowrap hover:bg-[#20ba59] transition-all"
              >
                💳 Click to Pay & Verify
              </button>
              <button
                onClick={() => handleQuickReply('BACK')}
                className="text-[11px] bg-red-900/40 text-red-200 border border-red-700/50 px-2.5 py-1 rounded-full whitespace-nowrap hover:bg-red-800/60 transition-colors"
              >
                🔄 BACK (Re-enter Details)
              </button>
            </>
          )}

          {currentState === 'COMPLETED' && (
            <button
              onClick={startInitialChat}
              className="text-[11px] bg-[#2a3942] text-gray-200 px-3 py-1 rounded-full whitespace-nowrap hover:bg-[#374955]"
            >
              Start New Order Simulation
            </button>
          )}
        </div>

        {/* Input Message Bar */}
        <form onSubmit={handleSendMessage} className="bg-[#202c33] p-2.5 flex items-center gap-2 border-t border-[#2a3942]">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message or address..."
            className="flex-1 bg-[#2a3942] text-white text-xs px-4 py-2.5 rounded-full focus:outline-none focus:ring-1 focus:ring-[#25D366] placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center transition-transform active:scale-90 flex-shrink-0"
            aria-label="Send message"
          >
            <FaPaperPlane className="text-xs ml-0.5" />
          </button>
        </form>

      </div>
    </div>
  );
}

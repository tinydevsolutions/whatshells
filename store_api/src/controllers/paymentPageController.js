import { getSession } from '../services/whatsappEngine.js';
import { products } from '../data/products.js';
import { config } from '../config/config.js';

export const renderCheckoutPage = (req, res) => {
  const { sessionId = 'default-session' } = req.query;
  const session = getSession(sessionId);
  const product = session.orderDraft.product || products[0];
  const qty = session.orderDraft.quantity || 1;
  const total = product.price * qty;
  const address = session.orderDraft.address || 'Standard Delivery Address';
  const customerName = session.orderDraft.customerName || 'Boutique Customer';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Whatshells Checkout 🐚 | Secure Payment</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐚</text></svg>">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Outfit', sans-serif; background-color: #fbf9f5; }
    .font-serif-luxury { font-family: 'Playfair Display', serif; }
  </style>
</head>
<body class="min-h-screen flex flex-col justify-between text-[#173847] p-4 sm:p-6">
  
  <div class="max-w-xl mx-auto w-full my-auto space-y-6">
    
    <!-- Brand Header -->
    <div class="text-center space-y-1">
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#173847] to-[#d4af37] p-[1.5px] shadow-sm mb-2">
        <div class="w-full h-full bg-[#FAF7F2] rounded-full flex items-center justify-center text-2xl">🐚</div>
      </div>
      <h1 class="font-serif-luxury text-2xl font-bold tracking-tight">whatshells</h1>
      <p class="text-xs text-gray-500">Official WhatsApp Checkout & Payment Portal</p>
    </div>

    <!-- Order Summary Card -->
    <div id="checkout-card" class="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#ebdcc9] space-y-6">
      
      <div class="flex items-center gap-4 pb-5 border-b border-[#f0e6d8]">
        <img src="${product.image}" alt="${product.name}" class="w-20 h-20 rounded-2xl object-cover shadow-xs border border-[#ebdcc9]">
        <div class="flex-1">
          <span class="text-[10px] font-bold text-[#8c6b43] uppercase tracking-wider">${product.categoryName || 'Seashell Boutique'}</span>
          <h2 class="font-serif-luxury text-lg font-bold text-[#173847] leading-snug">${product.name}</h2>
          <div class="text-xs text-gray-500 mt-0.5">SKU: ${product.sku} • Qty: <strong>${qty}</strong></div>
        </div>
        <div class="text-right">
          <div class="text-lg font-extrabold text-[#173847]">₹${total}</div>
          <div class="text-[10px] text-emerald-600 font-semibold">Free Shipping</div>
        </div>
      </div>

      <!-- Customer & Address snippet -->
      <div class="bg-[#FAF7F2] p-4 rounded-2xl border border-[#ebdcc9] text-xs space-y-1 text-[#4a5568]">
        <div><strong>Recipient:</strong> ${customerName}</div>
        <div class="truncate"><strong>Deliver to:</strong> ${address}</div>
      </div>

      <!-- Payment Method Selection -->
      <div class="space-y-3">
        <label class="text-xs font-bold text-[#173847] block">Select Payment Method:</label>
        
        <div class="grid grid-cols-2 gap-3">
          <label class="flex items-center gap-3 p-3 rounded-xl border-2 border-[#25D366] bg-[#f0fdf4] cursor-pointer">
            <input type="radio" name="paymentMethod" value="UPI" checked class="text-emerald-600 focus:ring-emerald-500">
            <div>
              <div class="text-xs font-bold text-[#173847]">Instant UPI / QR</div>
              <div class="text-[10px] text-gray-500">GPay, PhonePe, Paytm</div>
            </div>
          </label>

          <label class="flex items-center gap-3 p-3 rounded-xl border border-[#ebdcc9] bg-white cursor-pointer hover:bg-[#FAF7F2]">
            <input type="radio" name="paymentMethod" value="Cards / NetBanking" class="text-[#173847] focus:ring-[#173847]">
            <div>
              <div class="text-xs font-bold text-[#173847]">Cards & NetBanking</div>
              <div class="text-[10px] text-gray-500">Visa, Mastercard, RuPay</div>
            </div>
          </label>
        </div>
      </div>

      <!-- Pay Button -->
      <div class="pt-2">
        <button id="pay-button" onclick="handlePayment()" class="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all transform active:scale-98 flex items-center justify-center gap-2">
          <span>Pay ₹${total} & Confirm Order</span>
        </button>
      </div>

      <div class="text-center text-[11px] text-gray-400 flex items-center justify-center gap-2">
        <span>🔒 256-Bit SSL Encrypted Payment</span>
        <span>•</span>
        <span>Verified by Whatshells WhatsApp Bot</span>
      </div>

    </div>

    <!-- Success Container (Hidden by default) -->
    <div id="success-card" class="hidden bg-white rounded-3xl p-8 shadow-2xl border-2 border-emerald-400 text-center space-y-4">
      <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-xs">
        ✓
      </div>
      <h2 class="font-serif-luxury text-2xl font-bold text-[#173847]">Payment Successful! 🐚</h2>
      <p class="text-xs text-gray-600 max-w-sm mx-auto">
        Your order <strong id="confirmed-order-id" class="font-mono text-[#173847]">#WS-XXXXX</strong> has been confirmed and synced to Google Sheets.
      </p>

      <div class="bg-[#FAF7F2] p-4 rounded-2xl border border-[#ebdcc9] text-xs text-left space-y-1.5">
        <div class="text-emerald-700 font-bold">✅ Synced to Google Sheets Order System</div>
        <div><strong>Item:</strong> ${product.name} (x${qty})</div>
        <div><strong>Total Paid:</strong> ₹${total}</div>
        <div><strong>Confirmation Sent:</strong> Check your WhatsApp for receipt and tracking link!</div>
      </div>

      <div class="pt-4">
        <a href="${config.frontendUrl}" class="inline-block px-6 py-2.5 rounded-full bg-[#173847] text-white text-xs font-semibold hover:bg-[#20495c] transition-colors">
          Return to Whatshells Boutique
        </a>
      </div>
    </div>

  </div>

  <script>
    async function handlePayment() {
      const btn = document.getElementById('pay-button');
      btn.disabled = true;
      btn.innerHTML = 'Processing Payment... ⌛';

      try {
        const response = await fetch('/api/chat/pay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: '${sessionId}' })
        });

        const data = await response.json();
        
        if (data.success) {
          document.getElementById('checkout-card').classList.add('hidden');
          document.getElementById('success-card').classList.remove('hidden');
          if (data.order && data.order.id) {
            document.getElementById('confirmed-order-id').innerText = '#' + data.order.id;
          }
        } else {
          alert('Payment verification failed: ' + (data.error || 'Please try again.'));
          btn.disabled = false;
          btn.innerHTML = 'Pay ₹${total} & Confirm Order';
        }
      } catch (err) {
        alert('Payment processing error: ' + err.message);
        btn.disabled = false;
        btn.innerHTML = 'Pay ₹${total} & Confirm Order';
      }
    }
  </script>
</body>
</html>
`;

  return res.send(html);
};

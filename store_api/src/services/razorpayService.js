import crypto from 'crypto';
import { config } from '../config/config.js';

/**
 * Creates a Basic Auth header string for Razorpay API.
 */
const getAuthHeader = () => {
  const { keyId, keySecret } = config.razorpay;
  if (!keyId || !keySecret) return null;
  const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  return `Basic ${credentials}`;
};

/**
 * Creates a dynamic Razorpay Payment Link for an order.
 * @param {Object} options
 * @param {number} options.amount - Total amount in INR (e.g., 2898)
 * @param {string} options.customerName - Name of customer
 * @param {string} options.phoneNumber - Customer WhatsApp/Contact phone
 * @param {string} options.referenceId - Order reference ID (e.g. 'WS-102938')
 * @param {string} options.description - Short summary of items
 * @param {string} options.sessionId - Active WhatsApp session ID
 */
export const createPaymentLink = async ({
  amount,
  customerName = 'Boutique Customer',
  phoneNumber = '',
  referenceId = `WS-${Date.now().toString().slice(-6)}`,
  description = 'Whatshells Handcrafted Seashell Boutique Order',
  sessionId = ''
}) => {
  const auth = getAuthHeader();
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `+91${cleanPhone}` : (cleanPhone.startsWith('91') ? `+${cleanPhone}` : `+${cleanPhone}`);

  // Fallback if Razorpay API keys are not provided yet
  if (!auth) {
    console.log(`ℹ️ [Razorpay Service] RAZORPAY_KEY_ID / KEY_SECRET not configured. Using fallback Razorpay handle.`);
    const fallbackUrl = config.razorpayMeLink || 'https://razorpay.me/@navaneethakrishnanm';
    return {
      success: true,
      paymentLinkId: `plink_fallback_${referenceId}`,
      shortUrl: fallbackUrl,
      status: 'issued',
      isFallback: true,
      amount,
      referenceId
    };
  }

  const endpoint = 'https://api.razorpay.com/v1/payment_links';
  const payload = {
    amount: Math.round(amount * 100), // in paise
    currency: config.currency || 'INR',
    accept_partial: false,
    description: `${description} (${referenceId})`,
    customer: {
      name: customerName,
      contact: formattedPhone
    },
    notify: {
      sms: true,
      email: false,
      whatsapp: true
    },
    reminder_enable: true,
    notes: {
      orderId: referenceId,
      sessionId: sessionId || cleanPhone,
      customerName: customerName,
      store: config.storeName || 'Whatshells'
    },
    callback_url: `${config.publicUrl}/pay?sessionId=${encodeURIComponent(sessionId || cleanPhone)}&orderId=${referenceId}`,
    callback_method: 'get'
  };

  try {
    console.log(`💳 [Razorpay API] Generating dynamic payment link for Order #${referenceId} (₹${amount})...`);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`❌ [Razorpay API Error] Status ${res.status}:`, JSON.stringify(data, null, 2));
      return {
        success: false,
        error: data.error?.description || 'Could not create Razorpay payment link',
        fallbackUrl: config.razorpayMeLink,
        shortUrl: config.razorpayMeLink,
        paymentLinkId: `plink_fallback_${referenceId}`
      };
    }

    console.log(`✅ [Razorpay API] Dynamic Payment Link Created! ID: ${data.id} -> ${data.short_url}`);
    return {
      success: true,
      paymentLinkId: data.id,
      shortUrl: data.short_url,
      status: data.status,
      amount: data.amount / 100,
      referenceId,
      raw: data
    };
  } catch (err) {
    console.error(`❌ [Razorpay API Network Error]:`, err.message);
    return {
      success: false,
      error: err.message,
      shortUrl: config.razorpayMeLink,
      paymentLinkId: `plink_fallback_${referenceId}`
    };
  }
};

/**
 * Checks the live status of a Razorpay Payment Link.
 * @param {string} paymentLinkId - e.g. 'plink_N1oPqRsTuVwXyZ'
 */
export const fetchPaymentLinkStatus = async (paymentLinkId) => {
  if (!paymentLinkId || paymentLinkId.startsWith('plink_fallback_')) {
    return {
      success: true,
      status: 'unverified_fallback',
      isFallback: true
    };
  }

  const auth = getAuthHeader();
  if (!auth) {
    return {
      success: true,
      status: 'unverified_no_keys',
      isFallback: true
    };
  }

  const endpoint = `https://api.razorpay.com/v1/payment_links/${paymentLinkId}`;

  try {
    console.log(`🔍 [Razorpay API] Checking live status for link: ${paymentLinkId}...`);
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`❌ [Razorpay Status Error]:`, JSON.stringify(data, null, 2));
      return { success: false, status: 'error', error: data.error?.description };
    }

    console.log(`📊 [Razorpay Status] Link ${paymentLinkId} -> Status: "${data.status}" (Paid: ₹${(data.amount_paid || 0) / 100})`);
    return {
      success: true,
      status: data.status, // 'paid', 'issued', 'partially_paid', 'cancelled', 'expired'
      amountPaid: (data.amount_paid || 0) / 100,
      totalAmount: (data.amount || 0) / 100,
      payments: data.payments || [],
      paymentId: data.payments?.[0]?.payment_id || '',
      raw: data
    };
  } catch (err) {
    console.error(`❌ [Razorpay Status Network Error]:`, err.message);
    return { success: false, status: 'error', error: err.message };
  }
};

/**
 * Validates Razorpay Webhook HMAC-SHA256 signature.
 * @param {string|Buffer} rawBody - Raw webhook request body
 * @param {string} signature - Value from 'x-razorpay-signature' header
 * @param {string} [customSecret] - Webhook secret override
 */
export const verifyWebhookSignature = (rawBody, signature, customSecret) => {
  const secret = customSecret || config.razorpay.webhookSecret;
  if (!secret) return true; // If no secret set, bypass validation in dev mode
  if (!signature) return false;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody))
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf8'),
      Buffer.from(signature, 'utf8')
    );
  } catch (err) {
    console.error('Signature verification error:', err.message);
    return false;
  }
};

/**
 * Initiates a full or partial refund for a captured payment.
 * @param {string} paymentId - Razorpay Payment ID (e.g., 'pay_29QQoUBi66xm2f')
 * @param {number} [amountInRupees] - Amount to refund (omit for 100% full refund)
 * @param {Object} [notes] - Additional metadata / refund reason
 */
export const createRefund = async (paymentId, amountInRupees = null, notes = {}) => {
  const auth = getAuthHeader();
  if (!auth) {
    console.log(`ℹ️ [Razorpay Service] Refund simulated (no API keys configured).`);
    return {
      success: true,
      refundId: `rfd_simulated_${Date.now()}`,
      status: 'processed',
      amount: amountInRupees || 0,
      isSimulated: true
    };
  }

  const endpoint = `https://api.razorpay.com/v1/payments/${paymentId}/refund`;
  const payload = {
    reverse_all: 1,
    notes: {
      ...notes,
      source: 'Whatshells WhatsApp Automation'
    }
  };

  if (amountInRupees && amountInRupees > 0) {
    payload.amount = Math.round(amountInRupees * 100);
  }

  try {
    console.log(`💸 [Razorpay API] Processing refund for Payment ID ${paymentId}...`);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(`❌ [Razorpay Refund Error]:`, JSON.stringify(data, null, 2));
      return { success: false, error: data.error?.description || 'Refund failed', raw: data };
    }

    console.log(`✅ [Razorpay Refund Success] Refund ID: ${data.id} -> Status: ${data.status} (₹${(data.amount || 0) / 100})`);
    return {
      success: true,
      refundId: data.id,
      amount: (data.amount || 0) / 100,
      status: data.status,
      raw: data
    };
  } catch (err) {
    console.error(`❌ [Razorpay Refund Network Error]:`, err.message);
    return { success: false, error: err.message };
  }
};

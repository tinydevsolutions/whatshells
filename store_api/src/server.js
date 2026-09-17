import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config/config.js';
import apiRoutes from './routes/api.js';
import { renderCheckoutPage } from './controllers/paymentPageController.js';
import { handleWebhook } from './controllers/whatsappController.js';
import { handleRazorpayWebhook } from './controllers/paymentWebhookController.js';

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature']
}));
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));
app.use(express.urlencoded({ extended: true }));

// In-memory debug logger to inspect live webhook delivery remotely
export const recentLogs = [];
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (...args) => {
  recentLogs.unshift({ time: new Date().toISOString(), type: 'LOG', msg: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') });
  if (recentLogs.length > 50) recentLogs.pop();
  originalLog(...args);
};

console.error = (...args) => {
  recentLogs.unshift({ time: new Date().toISOString(), type: 'ERROR', msg: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') });
  if (recentLogs.length > 50) recentLogs.pop();
  originalError(...args);
};

console.warn = (...args) => {
  recentLogs.unshift({ time: new Date().toISOString(), type: 'WARN', msg: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') });
  if (recentLogs.length > 50) recentLogs.pop();
  originalWarn(...args);
};

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Direct Webhook Endpoints (Meta WhatsApp Cloud API)
app.get('/webhook', handleWebhook);
app.post('/webhook', handleWebhook);
app.get('/api/webhook', handleWebhook);
app.post('/api/webhook', handleWebhook);

// Razorpay Payment & Refund Webhook Endpoints
app.post('/api/payment/webhook', handleRazorpayWebhook);
app.post('/webhook/razorpay', handleRazorpayWebhook);

// Interactive WhatsApp Checkout Payment Page
app.get('/pay', renderCheckoutPage);

// API Routes
app.use('/api', apiRoutes);

// Live Debug Endpoint
app.get('/api/debug/logs', (req, res) => {
  res.json({
    whatsappConfig: {
      hasAccessToken: Boolean(config.whatsapp.accessToken && config.whatsapp.accessToken.length > 20),
      tokenLength: config.whatsapp.accessToken ? config.whatsapp.accessToken.length : 0,
      tokenPrefix: config.whatsapp.accessToken ? config.whatsapp.accessToken.substring(0, 15) : 'NONE',
      phoneNumberId: config.whatsapp.phoneNumberId,
      verifyToken: config.whatsapp.verifyToken
    },
    totalLogs: recentLogs.length,
    logs: recentLogs
  });
});

// Root greeting
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Whatshells Store API 🐚✨',
    brand: '@whatshells (Instagram Handcrafted Shell Store)',
    endpoints: {
      health: '/api/health',
      products: '/api/products',
      chatMessage: 'POST /api/chat/message',
      chatPay: 'POST /api/chat/pay',
      orders: '/api/orders',
      orderTrack: '/api/orders/track?query=<phone_or_order_id>',
      whatsappWebhook: '/api/whatsapp/webhook',
      directWebhook: '/webhook',
      paymentCheckout: '/pay?sessionId=<session_id>',
      downloadSheetCsv: '/api/sheets/csv'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

const PORT = config.port;

// Start HTTP server immediately
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🐚 WHATSHELLS STORE API RUNNING ON PORT ${PORT}`);
  console.log(`✨ Store: ${config.storeName} (${config.instagramHandle})`);
  console.log(`📱 WhatsApp Number: +${config.whatsappPhone}`);
  console.log(`📱 Phone Number ID: ${config.whatsapp.phoneNumberId}`);
  console.log(`🏢 Business Account ID: ${config.whatsapp.businessAccountId}`);
  console.log(`🔗 Webhook Endpoints: /webhook & /api/whatsapp/webhook`);
  console.log(`💳 Checkout Page: http://localhost:${PORT}/pay`);
  console.log(`📊 Google Sheets Config: ${config.google.sheetId ? 'Active (' + config.google.sheetId + ')' : 'Local CSV/Simulator Mode'}`);
  console.log(`🚀 API Base URL: http://localhost:${PORT}/api`);
  console.log('====================================================');

  // Connect to MongoDB asynchronously
  if (config.mongoUri) {
    mongoose.connect(config.mongoUri)
      .then(() => console.log('🍃 MongoDB Atlas connected successfully!'))
      .catch((err) => console.warn('⚠️ MongoDB connection notice (local fallback store active):', err.message));
  }
});

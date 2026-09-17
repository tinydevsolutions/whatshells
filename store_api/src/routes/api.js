import { Router } from 'express';
import { getAllProducts, getProductDetails } from '../controllers/productController.js';
import { handleChatMessage, handlePayAction, handleResetChat, handleWebhook } from '../controllers/whatsappController.js';
import { getAllOrders, getOrderById, trackOrderByPhoneOrId, syncOrderToSheetManual } from '../controllers/orderController.js';
import { handleRazorpayWebhook } from '../controllers/paymentWebhookController.js';
import { renderCheckoutPage } from '../controllers/paymentPageController.js';
import { getSheetHeaders, getCsvRows } from '../services/sheetsService.js';
import { config } from '../config/config.js';

const router = Router();

// Health check & Store Meta
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    store: config.storeName,
    instagram: config.instagramHandle,
    whatsappPhone: config.whatsappPhone,
    phoneNumberId: config.whatsapp.phoneNumberId,
    businessAccountId: config.whatsapp.businessAccountId,
    whatsappTokenConfigured: Boolean(config.whatsapp.accessToken && config.whatsapp.accessToken.length > 20),
    googleSheetsConnected: Boolean(config.google.sheetId || config.google.webhookUrl),
    razorpayConfigured: Boolean(config.razorpay.keyId),
    timestamp: new Date().toISOString()
  });
});

// Products Routes
router.get('/products', getAllProducts);
router.get('/products/:id', getProductDetails);

// WhatsApp Webhook (Meta WhatsApp Cloud API / Twilio)
router.get('/whatsapp/webhook', handleWebhook);
router.post('/whatsapp/webhook', handleWebhook);

// Razorpay Payment & Refund Webhook
router.post('/payment/webhook', handleRazorpayWebhook);

// WhatsApp Interactive Flow / Simulator API
router.post('/chat/message', handleChatMessage);
router.post('/chat/pay', handlePayAction);
router.post('/chat/reset', handleResetChat);

// Orders & Tracking Routes
router.get('/orders', getAllOrders);
router.get('/orders/track', trackOrderByPhoneOrId);
router.get('/orders/:orderId', getOrderById);
router.post('/orders/:orderId/sync-sheet', syncOrderToSheetManual);

// Google Sheets / CSV Data Viewer & Download
router.get('/sheets/headers', (req, res) => {
  res.json({ headers: getSheetHeaders() });
});

router.get('/sheets/csv', (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="orders_sheet.csv"');
  res.send(getCsvRows());
});

export default router;

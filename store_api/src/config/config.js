import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load store_api/.env regardless of the working directory from which Node was started
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // fallback to cwd if any

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  storeName: process.env.STORE_NAME || 'Whatshells',
  instagramHandle: process.env.INSTAGRAM_HANDLE || '@whatshells',
  whatsappPhone: (process.env.WHATSAPP_PHONE || '15556559552').replace(/[^0-9]/g, ''),
  whatsapp: {
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '1138121452713639',
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '979024581761847',
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'whatshells_secret_token',
    graphApiVersion: process.env.WHATSAPP_API_VERSION || 'v21.0',
  },
  google: {
    sheetId: process.env.GOOGLE_SHEET_ID || '',
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    privateKey: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
    webhookUrl: process.env.GOOGLE_SHEET_WEBHOOK_URL || '',
  },
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://tinydevsolutions_db_user:whatsapp_api_26@whatsappapi.ttv1x8k.mongodb.net/?appName=whatsappApi',
  publicUrl: process.env.PUBLIC_URL || 'http://localhost:5000',
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || 'whatshells_rzp_secret_2026',
  },
  razorpayMeLink: process.env.RAZORPAY_ME_LINK || 'https://razorpay.me/@navaneethakrishnanm',
  currency: 'INR',
  currencySymbol: '₹',
};

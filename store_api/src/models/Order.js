import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '../../orders_data.json');

// Mongoose Schema for MongoDB Atlas
const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  customerName: { type: String, default: 'Anonymous Customer' },
  phoneNumber: { type: String, default: '' },
  email: { type: String, default: '' },
  address: {
    line1: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
  },
  items: [
    {
      productId: String,
      name: String,
      sku: String,
      price: Number,
      quantity: Number,
      customNote: String,
    }
  ],
  totalAmount: { type: Number, default: 0 },
  paymentMethod: { type: String, default: 'UPI / Razorpay' },
  paymentId: { type: String, default: '' },
  paymentStatus: { type: String, default: 'PAID' },
  orderStatus: { type: String, default: 'CONFIRMED' },
  syncedToGoogleSheet: { type: Boolean, default: false },
  googleSheetRow: { type: Array, default: null },
  notes: { type: String, default: '' },
  updatedAt: { type: String, default: () => new Date().toISOString() }
}, { timestamps: true });

let MongoOrder = null;
try {
  MongoOrder = mongoose.models.Order || mongoose.model('Order', OrderSchema);
} catch (e) {
  // If mongoose is not initialized yet
}

// In-memory cache + file sync fallback
let ordersStore = [];

const loadOrders = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      ordersStore = JSON.parse(data);
    }
  } catch (err) {
    console.warn('Could not load orders from disk:', err.message);
    ordersStore = [];
  }
};

const persistOrders = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(ordersStore, null, 2), 'utf8');
  } catch (err) {
    console.warn('Could not persist orders to disk:', err.message);
  }
};

loadOrders();

export const OrderModel = {
  create: async (orderData) => {
    const newOrder = {
      id: orderData.id || `WS-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      customerName: orderData.customerName || 'Anonymous Customer',
      phoneNumber: orderData.phoneNumber || '',
      email: orderData.email || '',
      address: {
        line1: typeof orderData.address === 'string' ? orderData.address : (orderData.address?.line1 || ''),
        city: orderData.address?.city || '',
        state: orderData.address?.state || '',
        pincode: orderData.address?.pincode || orderData.pincode || '',
      },
      items: orderData.items || [
        {
          productId: orderData.productId || 'ws-mr-01',
          name: orderData.productName || 'Handcrafted Seashell Item',
          sku: orderData.sku || 'WS-01',
          price: orderData.price || 0,
          quantity: orderData.quantity || 1,
          customNote: orderData.customNote || '',
        }
      ],
      totalAmount: orderData.totalAmount || 0,
      paymentMethod: orderData.paymentMethod || 'UPI / Razorpay',
      paymentId: orderData.paymentId || `PAY-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      paymentStatus: orderData.paymentStatus || 'PAID',
      orderStatus: orderData.orderStatus || 'CONFIRMED',
      syncedToGoogleSheet: Boolean(orderData.syncedToGoogleSheet),
      googleSheetRow: orderData.googleSheetRow || null,
      notes: orderData.notes || '',
    };

    ordersStore.unshift(newOrder);
    persistOrders();

    // Also persist to MongoDB Atlas if connected
    if (mongoose.connection.readyState === 1 && MongoOrder) {
      try {
        await MongoOrder.create(newOrder);
        console.log(`🍃 [MongoDB] Order #${newOrder.id} saved to MongoDB Atlas!`);
      } catch (err) {
        console.warn('MongoDB save warning:', err.message);
      }
    }

    return newOrder;
  },

  findById: async (id) => {
    if (mongoose.connection.readyState === 1 && MongoOrder) {
      try {
        const found = await MongoOrder.findOne({ id: new RegExp(`^${id}$`, 'i') });
        if (found) return found.toObject();
      } catch (err) {
        // Fallback to in-memory
      }
    }
    return ordersStore.find(o => o.id.toLowerCase() === id.toLowerCase());
  },

  findByPhone: async (phone) => {
    const clean = phone.replace(/[^0-9]/g, '');
    if (mongoose.connection.readyState === 1 && MongoOrder) {
      try {
        const found = await MongoOrder.find({ phoneNumber: { $regex: clean } });
        if (found && found.length > 0) return found.map(f => f.toObject());
      } catch (err) {
        // Fallback to in-memory
      }
    }
    return ordersStore.filter(o => o.phoneNumber.replace(/[^0-9]/g, '').includes(clean));
  },

  getAll: async () => {
    if (mongoose.connection.readyState === 1 && MongoOrder) {
      try {
        const found = await MongoOrder.find({}).sort({ createdAt: -1 });
        if (found && found.length > 0) return found.map(f => f.toObject());
      } catch (err) {
        // Fallback to in-memory
      }
    }
    return [...ordersStore];
  },

  update: async (id, updateFields) => {
    const index = ordersStore.findIndex(o => o.id.toLowerCase() === id.toLowerCase());
    if (index !== -1) {
      ordersStore[index] = { ...ordersStore[index], ...updateFields, updatedAt: new Date().toISOString() };
      persistOrders();
    }

    if (mongoose.connection.readyState === 1 && MongoOrder) {
      try {
        await MongoOrder.findOneAndUpdate(
          { id: new RegExp(`^${id}$`, 'i') },
          { ...updateFields, updatedAt: new Date().toISOString() }
        );
      } catch (err) {
        // Fallback
      }
    }

    return ordersStore[index] || null;
  }
};

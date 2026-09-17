import { OrderModel } from '../models/Order.js';
import { syncOrderToGoogleSheet } from '../services/sheetsService.js';

export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.getAll();
    return res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    return res.json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const trackOrderByPhoneOrId = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, error: 'Search query required' });
    }

    // Try finding by Order ID first
    const byId = await OrderModel.findById(query);
    if (byId) {
      return res.json({ success: true, orders: [byId] });
    }

    // Otherwise search by phone number
    const byPhone = await OrderModel.findByPhone(query);
    return res.json({ success: true, orders: byPhone });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const syncOrderToSheetManual = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const sheetResult = await syncOrderToGoogleSheet(order);
    await OrderModel.update(order.id, {
      syncedToGoogleSheet: sheetResult.success,
      googleSheetRow: sheetResult.row
    });

    return res.json({
      success: true,
      message: 'Order synced with Google Sheet',
      sheetResult,
      order: await OrderModel.findById(orderId)
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

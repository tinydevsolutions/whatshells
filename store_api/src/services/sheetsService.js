import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CSV_FILE = path.join(__dirname, '../../orders_sheet.csv');

let sheetsClient = null;

export const getSheetHeaders = () => [
  'Order ID',
  'Order Date & Time',
  'Customer Name',
  'Phone Number',
  'Delivery Address',
  'Pincode',
  'Products Ordered',
  'Total Qty',
  'Total Amount',
  'Payment ID',
  'Payment Status',
  'Order Status',
  'Notes'
];

// Initialize local CSV headers if file doesn't exist
const initLocalCsv = () => {
  try {
    if (!fs.existsSync(CSV_FILE)) {
      const headers = getSheetHeaders().map(h => `"${h}"`).join(',') + '\n';
      fs.writeFileSync(CSV_FILE, headers, 'utf8');
    }
  } catch (err) {
    console.warn('Could not initialize CSV file:', err.message);
  }
};

initLocalCsv();

// Initialize Google Sheets API client if credentials are provided
const initSheetsClient = () => {
  if (sheetsClient) return sheetsClient;
  
  if (config.google.sheetId && config.google.serviceAccountEmail && config.google.privateKey) {
    try {
      const auth = new google.auth.JWT({
        email: config.google.serviceAccountEmail,
        key: config.google.privateKey,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      sheetsClient = google.sheets({ version: 'v4', auth });
      console.log('✅ Google Sheets API client initialized successfully with Service Account.');
    } catch (err) {
      console.warn('⚠️ Could not initialize Google Sheets client:', err.message);
    }
  }
  return sheetsClient;
};

export const syncOrderToGoogleSheet = async (order) => {
  const itemNames = order.items.map(i => `${i.name} (${i.sku}) x${i.quantity}`).join(', ');
  const totalQty = order.items.reduce((acc, i) => acc + (i.quantity || 1), 0);
  const formattedAddress = typeof order.address === 'string' 
    ? order.address 
    : `${order.address?.line1 || ''}, ${order.address?.city || ''} - ${order.address?.pincode || ''}`.replace(/^,\s*|,\s*$/g, '');

  const rowData = [
    order.id,
    new Date(order.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    order.customerName,
    order.phoneNumber,
    formattedAddress,
    order.address?.pincode || '',
    itemNames,
    totalQty,
    `₹${order.totalAmount}`,
    order.paymentId,
    order.paymentStatus,
    order.orderStatus,
    order.notes || 'Ordered via WhatsApp Bot'
  ];

  console.log(`\n📋 [Google Sheet Sync] Logging row for Order #${order.id}:`);
  console.log(JSON.stringify(rowData, null, 2));

  // 1. Always append to local CSV spreadsheet backup
  try {
    const csvLine = rowData.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',') + '\n';
    fs.appendFileSync(CSV_FILE, csvLine, 'utf8');
    console.log(`📄 [CSV Spreadsheet] Order #${order.id} appended to orders_sheet.csv`);
  } catch (err) {
    console.warn('Failed to write CSV line:', err.message);
  }

  // 2. Try Google Sheets API with Service Account
  if (config.google.sheetId && (config.google.serviceAccountEmail || config.google.privateKey)) {
    try {
      const client = initSheetsClient();
      if (client) {
        const response = await client.spreadsheets.values.append({
          spreadsheetId: config.google.sheetId,
          range: 'Orders!A:M',
          valueInputOption: 'USER_ENTERED',
          insertDataOption: 'INSERT_ROWS',
          requestBody: {
            values: [rowData],
          },
        });
        console.log(`✅ [Google Sheets API] Row appended to sheet ${config.google.sheetId}:`, response.data.updates?.updatedRange);
        return {
          success: true,
          method: 'GOOGLE_SHEETS_API',
          updatedRange: response.data.updates?.updatedRange,
          row: rowData
        };
      }
    } catch (err) {
      console.error('❌ [Google Sheets API Error]:', err.message);
    }
  }

  // 3. Try Google Apps Script Webhook
  if (config.google.webhookUrl) {
    try {
      const response = await fetch(config.google.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_ORDER',
          order: {
            orderId: order.id,
            timestamp: new Date(order.createdAt).toISOString(),
            customerName: order.customerName,
            phoneNumber: order.phoneNumber,
            address: formattedAddress,
            pincode: order.address?.pincode || '',
            items: itemNames,
            totalQuantity: totalQty,
            totalAmount: order.totalAmount,
            paymentId: order.paymentId,
            status: order.orderStatus,
            notes: order.notes || ''
          },
          rowData
        })
      });
      const data = await response.json().catch(() => ({ status: 'ok' }));
      console.log('✅ [Google Apps Script Webhook] Successfully sent order:', data);
      return {
        success: true,
        method: 'GOOGLE_APPS_SCRIPT_WEBHOOK',
        data,
        row: rowData
      };
    } catch (err) {
      console.error('❌ [Google Apps Script Webhook Error]:', err.message);
    }
  }

  // 4. Return summary with CSV backup confirmation
  console.log(`ℹ️ [Google Sheets Simulator] Order #${order.id} recorded in memory, orders_data.json and orders_sheet.csv.`);
  
  return {
    success: true,
    simulated: true,
    method: 'LOCAL_CSV_AND_MEMORY',
    message: 'Order stored in orders_sheet.csv and database. Configure GOOGLE_SHEET_ID & Service Account in .env for live cloud sync.',
    row: rowData
  };
};

export const syncOrderToGoogleSheets = syncOrderToGoogleSheet;

export const getCsvRows = () => {
  try {
    if (fs.existsSync(CSV_FILE)) {
      return fs.readFileSync(CSV_FILE, 'utf8');
    }
  } catch (err) {
    console.warn('Could not read CSV file:', err.message);
  }
  return '';
};

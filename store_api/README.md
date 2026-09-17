# Whatshells Store API 🐚

Backend API and WhatsApp workflow automation engine for **Whatshells** (@whatshells Instagram brand).

---

## 🚀 Features
- **WhatsApp Bot Workflow Engine**: Multi-step state machine handling enquiries, customer name, delivery address/pincode, quantity confirmation, instant payment link generation, and automated order confirmation.
- **Google Sheets Order Synchronization**: Automatically logs all confirmed orders as new rows in Google Sheets (Order ID, Timestamp, Customer, Phone, Address, Products, Total, Payment ID, Status).
- **Product Catalog API**: Complete with dynamic `wa.me` pre-filled click-to-chat links.
- **Order Tracking**: Track order status by Order ID (`WS-XXXXX`) or customer phone number.
- **Interactive Chat / Sandbox Endpoints**: Allows immediate testing directly from the web landing page.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally
```bash
npm run dev
# Server starts on http://localhost:5000
```

---

## 📊 Google Sheets Setup (How to Connect)

### Option A: Using Google Sheets API (Recommended for Cloud)
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and enable **Google Sheets API**.
3. Create a **Service Account** and generate a JSON Key.
4. Create a new Google Spreadsheet and share it with your Service Account email (give `Editor` permission).
5. Copy the Sheet ID from the URL (`https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit`).
6. Set in your `.env`:
   ```env
   GOOGLE_SHEET_ID=your_sheet_id_here
   GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

### Option B: Using Google Apps Script Webhook (Zero Auth Setup)
1. In your Google Sheet, open **Extensions > Apps Script**.
2. Paste the following script:
   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = JSON.parse(e.postData.contents);
     if (data.rowData) {
       sheet.appendRow(data.rowData);
       return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
     }
   }
   ```
3. Click **Deploy > New Deployment > Web App** (Set *Who has access* to `Anyone`).
4. Copy the Web App URL and set in `.env`:
   ```env
   GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
   ```

*Note: If no Google credentials are provided, the API automatically falls back to local logging and JSON storage in `orders_data.json` without failing.*

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health and store status |
| `GET` | `/api/products` | Get catalog with prefilled WhatsApp URLs |
| `GET` | `/api/products/:id` | Get single product |
| `POST` | `/api/chat/message` | Interactive WhatsApp Bot workflow simulation |
| `POST` | `/api/chat/pay` | Mock Payment verification & triggers Google Sheet sync |
| `POST` | `/api/chat/reset` | Reset chat session |
| `GET` | `/api/orders` | List all orders |
| `GET` | `/api/orders/track?query=` | Track order by ID or phone number |
| `POST` | `/api/orders/:orderId/sync-sheet` | Manually sync order to Google Sheet |
| `POST` | `/api/whatsapp/webhook` | Meta WhatsApp Cloud API / Twilio webhook |

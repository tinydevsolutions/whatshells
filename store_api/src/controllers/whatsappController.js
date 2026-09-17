import { processIncomingMessage, resetSession } from '../services/whatsappEngine.js';
import { sendWhatsAppCloudMessage } from '../services/whatsappCloudService.js';
import { config } from '../config/config.js';

export const handleChatMessage = async (req, res) => {
  try {
    const { sessionId = 'web-user-' + Math.floor(Math.random() * 10000), message = '', product = null } = req.body;
    
    const result = await processIncomingMessage(sessionId, message, product);
    return res.json({
      success: true,
      sessionId,
      ...result
    });
  } catch (err) {
    console.error('Error handling chat message:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const handlePayAction = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, error: 'sessionId is required' });
    }

    // Force payment completion through the engine
    const result = await processIncomingMessage(sessionId, 'PAID');
    return res.json({
      success: true,
      sessionId,
      ...result
    });
  } catch (err) {
    console.error('Error handling pay action:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const handleResetChat = async (req, res) => {
  try {
    const { sessionId = 'default-session' } = req.body;
    const session = resetSession(sessionId);
    return res.json({
      success: true,
      message: 'Chat session reset',
      session
    });
  } catch (err) {
    console.error('Error resetting chat:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Track processed message IDs to avoid duplicate processing on Meta retries
const processedMessageIds = new Set();

// WhatsApp Webhook endpoint (compatible with Meta WhatsApp Cloud API / Twilio)
export const handleWebhook = async (req, res) => {
  try {
    // 1. Webhook verification for Meta WhatsApp Cloud API (GET)
    if (req.method === 'GET') {
      const mode = req.query['hub.mode'] || req.query.hub?.mode;
      const token = req.query['hub.verify_token'] || req.query.hub?.verify_token;
      const challenge = req.query['hub.challenge'] || req.query.hub?.challenge;

      const verifyToken = config.whatsapp.verifyToken || 'whatshells_secret_token';

      if (mode === 'subscribe' && token === verifyToken) {
        console.log('✅ WhatsApp Webhook verified successfully with Meta!');
        return res.status(200).send(challenge);
      }
      console.warn(`⚠️ WhatsApp Webhook verification mismatch. Expected: "${verifyToken}", Received: "${token}"`);
      return res.sendStatus(403);
    }

    // 2. Handle incoming message events from Meta WhatsApp Cloud API (POST)
    const body = req.body;

    // Immediately acknowledge receipt to Meta with 200 OK so Meta never retries or times out
    res.status(200).json({ status: 'EVENT_RECEIVED' });

    let fromNumber = body.From || '';
    let incomingText = body.Body || '';
    let messageId = '';
    let contactName = '';

    if (body.entry && body.entry[0]?.changes && body.entry[0].changes[0]?.value?.messages) {
      const value = body.entry[0].changes[0].value;
      const msg = value.messages[0];
      fromNumber = msg.from;
      messageId = msg.id;
      contactName = value.contacts?.[0]?.profile?.name || '';

      if (msg.type === 'text') {
        incomingText = msg.text?.body || '';
      } else if (msg.type === 'interactive') {
        incomingText = msg.interactive?.button_reply?.id || msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.id || msg.interactive?.list_reply?.title || '';
      } else if (msg.type === 'button') {
        incomingText = msg.button?.payload || msg.button?.text || '';
      }
    }

    // Deduplicate Meta retries
    if (messageId && processedMessageIds.has(messageId)) {
      console.log(`ℹ️ Skipping duplicate Meta message [${messageId}]`);
      return;
    }
    if (messageId) {
      processedMessageIds.add(messageId);
      // Clean up cache after 10 minutes
      setTimeout(() => processedMessageIds.delete(messageId), 600000);
    }

    if (fromNumber && incomingText) {
      console.log(`💬 User [${fromNumber}] (${contactName || 'Anonymous'}) says: "${incomingText}"`);

      // Process through our Whatshells workflow state machine
      const response = await processIncomingMessage(fromNumber, incomingText, null);
      console.log(`🤖 Bot Reply to [${fromNumber}]:\n${response.reply}`);

      // Send the reply back to the real user on WhatsApp via Cloud API (with interactive buttons if available)
      const cloudResult = await sendWhatsAppCloudMessage(fromNumber, response.reply, response.buttons || []);
      if (!cloudResult.success) {
        console.error(`⚠️ Could not deliver message to +${fromNumber} via Meta Graph API:`, cloudResult.error || cloudResult.reason);
      }
    }

  } catch (err) {
    console.error('❌ WhatsApp Webhook processing error:', err);
  }
};

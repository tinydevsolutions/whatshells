import { config } from '../config/config.js';

/**
 * Sends an outgoing text or interactive button message to a user's WhatsApp number using Meta WhatsApp Cloud API.
 * @param {string} toPhoneNumber - Destination phone number with country code (e.g., '919876543210')
 * @param {string} textBody - Message text (supports WhatsApp markdown formatting like *bold*, _italic_)
 * @param {Array<{id: string, title: string}>} buttons - Optional interactive reply buttons (up to 3)
 */
export const sendWhatsAppCloudMessage = async (toPhoneNumber, textBody, buttons = []) => {
  const cleanTo = toPhoneNumber.replace(/[^0-9]/g, '');
  const { phoneNumberId, accessToken, graphApiVersion } = config.whatsapp;

  if (!accessToken) {
    console.warn(`⚠️ [WhatsApp Cloud API] WHATSAPP_ACCESS_TOKEN not set in .env. Message to +${cleanTo} not sent to Meta API.`);
    return { success: false, reason: 'NO_ACCESS_TOKEN' };
  }

  if (!phoneNumberId) {
    console.warn(`⚠️ [WhatsApp Cloud API] WHATSAPP_PHONE_NUMBER_ID not set in .env.`);
    return { success: false, reason: 'NO_PHONE_NUMBER_ID' };
  }

  const endpoint = `https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`;

  let payload;

  // Format as Interactive Button Message if buttons are provided (max 3 buttons, title max 20 chars)
  if (Array.isArray(buttons) && buttons.length > 0) {
    const formattedButtons = buttons.slice(0, 3).map((btn) => ({
      type: 'reply',
      reply: {
        id: btn.id.substring(0, 256),
        title: btn.title.substring(0, 20),
      }
    }));

    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanTo,
      type: 'interactive',
      interactive: {
        type: 'button',
        body: {
          text: textBody,
        },
        action: {
          buttons: formattedButtons,
        },
      },
    };
  } else {
    // Standard Text Message
    payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanTo,
      type: 'text',
      text: {
        preview_url: true,
        body: textBody,
      },
    };
  }

  try {
    console.log(`📤 [WhatsApp Cloud API] Sending ${buttons?.length > 0 ? 'interactive button' : 'text'} message to +${cleanTo}...`);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ [WhatsApp Cloud API Error] Status ${response.status}:`, JSON.stringify(data, null, 2));
      return { success: false, error: data };
    }

    console.log(`✅ [WhatsApp Cloud API] Message sent successfully! Message ID:`, data.messages?.[0]?.id);
    return { success: true, messageId: data.messages?.[0]?.id, data };
  } catch (err) {
    console.error(`❌ [WhatsApp Cloud API Network Error]:`, err.message);
    return { success: false, error: err.message };
  }
};


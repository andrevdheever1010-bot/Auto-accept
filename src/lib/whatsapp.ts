import type { Order } from '@/types';

const PHONE = process.env.WHATSAPP_PHONE || '';
const API_KEY = process.env.WHATSAPP_API_KEY || '';

export async function sendWhatsAppMessage(phone: string, message: string): Promise<boolean> {
  if (!API_KEY) return false;
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}&apikey=${API_KEY}`;
    const res = await fetch(url);
    return res.ok;
  } catch {
    return false;
  }
}

export async function notifyAdminNewOrder(order: Order): Promise<void> {
  if (!PHONE || !API_KEY) return;
  const items = order.items.map((i) => `• ${i.quantity}x ${i.productName} ${i.size}`).join('\n');
  const message = `🍗 *New A+Market Order!*\n\nOrder #${order.orderNumber}\nCustomer: ${order.name}\nPhone: ${order.phone}\nTotal: R${order.total.toFixed(2)}\nDelivery: ${order.deliveryType}\n\n${items}`;
  await sendWhatsAppMessage(PHONE, message);
}

export async function notifyCustomerOrderStatus(order: Order, status: string): Promise<void> {
  if (!order.phone || !API_KEY) return;

  const messages: Record<string, string> = {
    paid: `✅ *A+Market* — Hi ${order.name}! Your payment for order #${order.orderNumber} (R${order.total.toFixed(2)}) has been confirmed. We'll have it ready for ${order.deliveryType === 'delivery' ? 'delivery' : 'pickup'} on Saturday. 🍗`,
    processing: `👨‍🍳 *A+Market* — Your order #${order.orderNumber} is now being prepared! Fresh chicken coming your way on Saturday. 🔥`,
    ready: `🎉 *A+Market* — Your order #${order.orderNumber} is ready! ${order.deliveryType === 'delivery' ? 'Our driver is on the way.' : 'Please come collect at our location.'} 🍗`,
    delivered: `✅ *A+Market* — Order #${order.orderNumber} delivered! Enjoy your meal, ${order.name}! Thanks for choosing A+Market. 🙏`,
    cancelled: `❌ *A+Market* — Your order #${order.orderNumber} has been cancelled. Please contact Andre at 069 427 4833 for assistance.`,
  };

  const message = messages[status];
  if (!message) return;

  const customerPhone = order.phone.replace(/\s/g, '').replace(/^0/, '+27');
  await sendWhatsAppMessage(customerPhone, message);
}

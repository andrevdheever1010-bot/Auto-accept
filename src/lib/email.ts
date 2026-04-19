import nodemailer from 'nodemailer';
import type { Order } from '@/types';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderNotification(order: Order): Promise<void> {
  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 12px;border-bottom:1px solid #FFE4C0;">${item.productName} (${item.size})</td>
          <td style="padding:8px 12px;border-bottom:1px solid #FFE4C0;text-align:center;">${item.quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #FFE4C0;text-align:right;">R${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#FFF8F0;font-family:system-ui,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(44,24,16,0.12);">
        <div style="background:linear-gradient(135deg,#FF6B35,#E85D20);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;">🍗 A+Market</h1>
          <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;">New Order Received!</p>
        </div>
        <div style="padding:32px;">
          <div style="background:#FFF8F0;border-radius:12px;padding:20px;margin-bottom:24px;">
            <h2 style="margin:0 0 16px;color:#2C1810;font-size:18px;">Order #${order.orderNumber}</h2>
            <p style="margin:4px 0;color:#5C3D30;"><strong>Customer:</strong> ${order.name}</p>
            <p style="margin:4px 0;color:#5C3D30;"><strong>Phone:</strong> ${order.phone}</p>
            <p style="margin:4px 0;color:#5C3D30;"><strong>Email:</strong> ${order.email}</p>
            <p style="margin:4px 0;color:#5C3D30;"><strong>Delivery:</strong> ${order.deliveryType === 'delivery' ? `Delivery to: ${order.address}` : 'Pickup'}</p>
            ${order.notes ? `<p style="margin:4px 0;color:#5C3D30;"><strong>Notes:</strong> ${order.notes}</p>` : ''}
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
            <thead>
              <tr style="background:#FF6B35;color:#fff;">
                <th style="padding:10px 12px;text-align:left;">Item</th>
                <th style="padding:10px 12px;text-align:center;">Qty</th>
                <th style="padding:10px 12px;text-align:right;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="text-align:right;padding:16px 0;border-top:2px solid #FFE4C0;">
            <p style="margin:4px 0;color:#5C3D30;">Subtotal: <strong>R${order.subtotal.toFixed(2)}</strong></p>
            <p style="margin:4px 0;color:#5C3D30;">Delivery: <strong>R${order.deliveryFee.toFixed(2)}</strong></p>
            <p style="margin:8px 0 0;color:#FF6B35;font-size:20px;font-weight:700;">Total: R${order.total.toFixed(2)}</p>
          </div>
        </div>
        <div style="background:#2C1810;padding:20px;text-align:center;">
          <p style="color:rgba(255,255,255,0.6);margin:0;font-size:13px;">A+Market — Andre van der Heever — 069 427 4833</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `🍗 New Order #${order.orderNumber} — R${order.total.toFixed(2)} — ${order.name}`,
    html,
  });
}

export async function sendOrderConfirmationToCustomer(order: Order): Promise<void> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#FFF8F0;font-family:system-ui,sans-serif;">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#FF6B35,#E85D20);padding:32px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;">🍗 A+Market</h1>
          <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;">Order Confirmed!</p>
        </div>
        <div style="padding:32px;">
          <p style="color:#2C1810;font-size:16px;">Hi ${order.name},</p>
          <p style="color:#5C3D30;">Thank you for your order! We've received it and will have everything fresh and ready for ${order.deliveryType === 'delivery' ? 'delivery' : 'pickup'} on <strong>Saturday</strong>.</p>
          <div style="background:#FFF8F0;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0;color:#FF6B35;font-weight:700;font-size:18px;">Order #${order.orderNumber}</p>
            <p style="margin:8px 0 0;color:#2C1810;font-size:24px;font-weight:700;">Total: R${order.total.toFixed(2)}</p>
          </div>
          <p style="color:#5C3D30;">For any questions, reply to this email or WhatsApp Andre at <strong>069 427 4833</strong>.</p>
        </div>
        <div style="background:#2C1810;padding:20px;text-align:center;">
          <p style="color:rgba(255,255,255,0.6);margin:0;font-size:13px;">A+Market — Pretoria, South Africa</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: order.email,
    subject: `Your A+Market order #${order.orderNumber} is confirmed! 🍗`,
    html,
  });
}

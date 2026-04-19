import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPayFastITN } from '@/lib/payfast';
import { sendOrderConfirmationToCustomer } from '@/lib/email';
import { notifyCustomerOrderStatus } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const params: Record<string, string> = {};
    for (const pair of raw.split('&')) {
      const [key, val] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent((val || '').replace(/\+/g, ' '));
    }

    // Verify ITN signature and with PayFast server
    const valid = await verifyPayFastITN(params);
    if (!valid) {
      console.warn('[PayFast ITN] Invalid signature or verification failed');
      return new NextResponse('Invalid ITN', { status: 400 });
    }

    const orderId = params.m_payment_id;
    const paymentStatus = params.payment_status;
    const pfPaymentId = params.pf_payment_id;
    const amountGross = parseFloat(params.amount_gross || '0');

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return new NextResponse('Order not found', { status: 404 });
    }

    // Verify amount matches
    const diff = Math.abs(amountGross - order.total);
    if (diff > 0.01) {
      console.warn(`[PayFast ITN] Amount mismatch: expected ${order.total}, got ${amountGross}`);
      return new NextResponse('Amount mismatch', { status: 400 });
    }

    if (paymentStatus === 'COMPLETE') {
      const updated = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'paid', pfPaymentId, paymentId: pfPaymentId },
      });

      const orderForNotif = {
        ...updated,
        items: updated.items as never,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      };

      // Send confirmation to customer
      sendOrderConfirmationToCustomer(orderForNotif).catch(console.error);
      notifyCustomerOrderStatus(orderForNotif, 'paid').catch(console.error);
    } else if (paymentStatus === 'CANCELLED') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'cancelled' },
      });
    }

    return new NextResponse('OK', { status: 200 });
  } catch (err) {
    console.error('[PayFast ITN]', err);
    return new NextResponse('Internal error', { status: 500 });
  }
}

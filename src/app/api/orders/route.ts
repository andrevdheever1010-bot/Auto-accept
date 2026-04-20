import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildPayFastParams } from '@/lib/payfast';
import { sendOrderNotification } from '@/lib/email';
import { notifyAdminNewOrder } from '@/lib/whatsapp';

function generateOrderNumber(): string {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `APM-${ymd}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, address, deliveryType, items, subtotal, deliveryFee, total, notes } = body;

    if (!name || !phone || !email || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        address: address?.trim() || 'Pickup',
        deliveryType,
        items,
        subtotal: Number(subtotal),
        deliveryFee: Number(deliveryFee),
        total: Number(total),
        notes: notes?.trim() || null,
        status: 'pending',
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || req.nextUrl.origin;

    const payfastParams = buildPayFastParams({
      orderId: order.id,
      orderNumber,
      amount: Number(total),
      itemName: `A+Market Order #${orderNumber}`,
      customerName: name.trim(),
      customerEmail: email.trim().toLowerCase(),
      baseUrl,
    });

    // Non-blocking notifications
    const orderForNotif = {
      ...order,
      items: order.items as never,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    };

    sendOrderNotification(orderForNotif).catch(console.error);
    notifyAdminNewOrder(orderForNotif).catch(console.error);

    return NextResponse.json({ orderId: order.id, orderNumber, payfastParams });
  } catch (err) {
    console.error('[POST /api/orders]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status');

  const where = status ? { status } : {};
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return NextResponse.json({ orders, total, page, limit });
}

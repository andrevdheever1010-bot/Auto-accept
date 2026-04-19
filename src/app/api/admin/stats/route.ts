import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [totalOrders, todayOrders, paidOrders, revenue] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.count({ where: { status: { in: ['paid', 'processing', 'ready', 'delivered'] } } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ['paid', 'processing', 'ready', 'delivered'] } },
    }),
  ]);

  return NextResponse.json({
    totalOrders,
    todayOrders,
    paidOrders,
    totalRevenue: revenue._sum.total ?? 0,
  });
}

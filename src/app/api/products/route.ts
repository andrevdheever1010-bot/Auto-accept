import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const products = await prisma.product.findMany({
    select: { id: true, slug: true, name: true, soldOut: true },
  });
  return NextResponse.json(products);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug, soldOut } = await req.json();
  if (!slug || typeof soldOut !== 'boolean') {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { slug },
    data: { soldOut },
  });
  return NextResponse.json(product);
}

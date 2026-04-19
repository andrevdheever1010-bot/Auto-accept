import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PRODUCTS = [
  { name: 'Chicken Nuggets', slug: 'chicken-nuggets' },
  { name: 'Chicken Strips', slug: 'chicken-strips' },
  { name: 'Chicken Patties', slug: 'chicken-patties' },
  { name: 'Chicken Pops', slug: 'chicken-pops' },
  { name: 'Chicken Schnitzel', slug: 'chicken-schnitzel' },
];

async function main() {
  // Seed products
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  // Seed admin
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin1234';
  const hashed = await bcrypt.hash(password, 10);

  await prisma.admin.upsert({
    where: { username },
    update: {},
    create: { username, password: hashed },
  });

  console.log('Database seeded successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

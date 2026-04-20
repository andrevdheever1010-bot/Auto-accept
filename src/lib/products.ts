import type { ProductDef } from '@/types';

export const PRODUCTS: ProductDef[] = [
  {
    id: 'chicken-nuggets',
    name: 'Chicken Nuggets',
    slug: 'chicken-nuggets',
    description: 'Golden, crispy nuggets packed with juicy, tender chicken. Family favourite — perfect for kids and adults alike.',
    emoji: '🍗',
    variants: [
      { size: '1kg', price: 120 },
      { size: '2.5kg', price: 250 },
    ],
    image: '/nuggets.jpg',
  },
  {
    id: 'chicken-strips',
    name: 'Chicken Strips',
    slug: 'chicken-strips',
    description: 'Long, succulent strips of seasoned chicken breast — perfect for wraps, dipping or serving straight off the braai.',
    emoji: '🍖',
    variants: [
      { size: '1kg', price: 120 },
      { size: '2.5kg', price: 270 },
    ],
    image: '/strips.jpg',
  },
  {
    id: 'chicken-patties',
    name: 'Chicken Patties',
    slug: 'chicken-patties',
    description: 'Hand-pressed, seasoned chicken patties — the ultimate burger base. Juicy inside, perfectly browned outside.',
    emoji: '🍔',
    variants: [
      { size: '1kg', price: 120 },
      { size: '2.5kg', price: 250 },
    ],
    image: '/patties.jpg',
  },
  {
    id: 'chicken-pops',
    name: 'Chicken Pops',
    slug: 'chicken-pops',
    description: 'Bite-sized pops of crispy, flavour-packed chicken. Snack on them, share them, or make them a full meal.',
    emoji: '🔮',
    variants: [
      { size: '1kg', price: 110 },
    ],
    image: '/pops.jpg',
  },
  {
    id: 'chicken-schnitzel',
    name: 'Chicken Schnitzel',
    slug: 'chicken-schnitzel',
    description: 'Classic South African schnitzel — thin-pounded, golden-crumbed chicken breast. A hearty, satisfying favourite.',
    emoji: '🥩',
    variants: [
      { size: '1kg', price: 120 },
      { size: '2.5kg', price: 270 },
    ],
    image: '/schnitzel.jpg',
  },
];

export const DELIVERY_FEE = 40;
export const PICKUP_FEE = 0;

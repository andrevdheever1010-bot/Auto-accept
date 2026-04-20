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
    image: 'https://images.unsplash.com/photo-1585325701956-60dd9c8553bc?w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
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
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80',
  },
];

export const DELIVERY_FEE = 40;
export const PICKUP_FEE = 0;

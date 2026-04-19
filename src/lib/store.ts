'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productSlug: string, size: string) => void;
  updateQuantity: (productSlug: string, size: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productSlug === item.productSlug && i.size === item.size
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productSlug === item.productSlug && i.size === item.size
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productSlug, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productSlug === productSlug && i.size === size)
          ),
        }));
      },

      updateQuantity: (productSlug, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productSlug, size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productSlug === productSlug && i.size === size ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      total: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'aplus-market-cart',
    }
  )
);

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store';
import toast from 'react-hot-toast';
import type { ProductDef } from '@/types';

interface Props {
  product: ProductDef;
  index: number;
}

export default function ProductCard({ product, index }: Props) {
  const [selectedSize, setSelectedSize] = useState<'1kg' | '2.5kg'>(product.variants[0].size);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addItem, openCart } = useCartStore();

  const variant = product.variants.find((v) => v.size === selectedSize) || product.variants[0];

  const handleAdd = async () => {
    if (product.soldOut) return;
    setAdding(true);
    addItem({
      productSlug: product.slug,
      productName: product.name,
      size: selectedSize,
      price: variant.price,
      quantity: qty,
    });
    toast.success(`${qty}x ${product.name} (${selectedSize}) added to cart 🍗`);
    setTimeout(() => {
      setAdding(false);
      openCart();
    }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <div
        className={`relative bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 ${
          product.soldOut ? 'opacity-80' : ''
        }`}
      >
        {/* Sold out ribbon */}
        {product.soldOut && (
          <div className="sold-out-ribbon">Sold Out</div>
        )}

        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-cream-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-bark-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Emoji badge */}
          <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-xl shadow-warm">
            {product.emoji}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-display text-xl font-bold text-bark-900 mb-2 group-hover:text-ember-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-bark-700/70 text-sm leading-relaxed mb-5 line-clamp-2">
            {product.description}
          </p>

          {/* Size selector */}
          <div className="flex gap-2 mb-5">
            {product.variants.map((v) => (
              <button
                key={v.size}
                onClick={() => setSelectedSize(v.size)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                  selectedSize === v.size
                    ? 'border-ember-500 bg-ember-500 text-white'
                    : 'border-cream-300 bg-cream-100 text-bark-700 hover:border-ember-400'
                }`}
              >
                {v.size}
                <br />
                <span className="text-xs opacity-80">R{v.price}</span>
              </button>
            ))}
          </div>

          {/* Quantity + price row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 bg-cream-100 rounded-xl p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white shadow-sm text-bark-800 font-bold hover:bg-ember-500 hover:text-white transition-colors duration-200 flex items-center justify-center"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold text-bark-900">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 rounded-lg bg-white shadow-sm text-bark-800 font-bold hover:bg-ember-500 hover:text-white transition-colors duration-200 flex items-center justify-center"
              >
                +
              </button>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-ember-600 font-display">
                R{(variant.price * qty).toFixed(0)}
              </span>
              {qty > 1 && (
                <p className="text-xs text-bark-700/50">R{variant.price} each</p>
              )}
            </div>
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            disabled={product.soldOut || adding}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 relative overflow-hidden ${
              product.soldOut
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-ember-500 hover:bg-ember-600 text-white shadow-ember hover:shadow-ember-lg hover:-translate-y-0.5'
            }`}
          >
            <AnimatePresence mode="wait">
              {adding ? (
                <motion.span
                  key="adding"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Adding...
                </motion.span>
              ) : product.soldOut ? (
                <motion.span key="sold">Sold Out</motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </motion.span>
              )}
            </AnimatePresence>
            {!product.soldOut && !adding && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

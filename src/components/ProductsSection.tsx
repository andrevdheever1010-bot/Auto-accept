'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import ScrollReveal from './ScrollReveal';
import { PRODUCTS } from '@/lib/products';
import type { ProductDef } from '@/types';

export default function ProductsSection() {
  const [products, setProducts] = useState<ProductDef[]>(PRODUCTS);

  useEffect(() => {
    // Fetch sold-out status from DB
    fetch('/api/products')
      .then((r) => r.json())
      .then((data: Array<{ slug: string; soldOut: boolean }>) => {
        setProducts(
          PRODUCTS.map((p) => ({
            ...p,
            soldOut: data.find((d) => d.slug === p.slug)?.soldOut ?? false,
          }))
        );
      })
      .catch(() => {/* use defaults */});
  }, []);

  return (
    <section id="products" className="py-24 bg-cream-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block text-ember-500 text-sm font-semibold tracking-widest uppercase mb-4">
            Weekly Menu
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-bark-900 mb-6">
            Fresh From Our Kitchen
          </h2>
          <p className="text-bark-700/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Every batch is hand-prepared with premium chicken and flash-frozen to lock in freshness.
            Five cuts, family-friendly sizes, unbeatable quality.
          </p>
        </ScrollReveal>

        {/* Deadline banner */}
        <ScrollReveal delay={0.1}>
          <div className="flex items-center justify-center gap-4 bg-bark-900 text-white rounded-2xl p-4 mb-12 max-w-2xl mx-auto">
            <div className="flex-shrink-0 w-10 h-10 bg-ember-500 rounded-xl flex items-center justify-center text-lg">
              📅
            </div>
            <div>
              <p className="font-semibold text-sm">Order Deadline: Friday Morning</p>
              <p className="text-white/60 text-xs">Place your order before Friday to receive your fresh chicken on Saturday</p>
            </div>
          </div>
        </ScrollReveal>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Bottom info */}
        <ScrollReveal delay={0.2} className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: '🚚', title: 'Delivery', desc: 'R40 flat rate across Pretoria' },
              { icon: '🏪', title: 'Pickup', desc: 'Free pickup — Pretoria location' },
              { icon: '💳', title: 'Payment', desc: 'Secure card payments via PayFast' },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-card"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-semibold text-bark-900">{item.title}</p>
                  <p className="text-bark-700/60 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

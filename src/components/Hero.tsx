'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const ParticleCanvas = dynamic(() => import('./ParticleCanvas'), { ssr: false });

const SLIDES = [
  {
    title: 'Freshness You Can Taste.',
    subtitle: 'Premium chicken, expertly prepared — delivered every Saturday.',
    bg: 'from-[#1a0a04] via-[#2C1810] to-[#3d1a08]',
    accent: 'bg-ember-600',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=1920&q=85',
    tag: 'Chicken Nuggets',
  },
  {
    title: "Pretoria's Finest Chicken.",
    subtitle: 'Hand-prepared, flash-frozen fresh. Order Friday. Receive Saturday.',
    bg: 'from-[#0f0800] via-[#2a1405] to-[#3a1c0a]',
    accent: 'bg-gold-500',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=1920&q=85',
    tag: 'Chicken Strips',
  },
  {
    title: 'Golden. Crispy. Perfect.',
    subtitle: 'Five premium cuts to choose from — family packs available.',
    bg: 'from-[#12040a] via-[#280e18] to-[#3a1020]',
    accent: 'bg-ember-500',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1920&q=85',
    tag: 'Chicken Patties',
  },
];

const text = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero({ onOrder }: { onOrder: () => void }) {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);

  const next = useCallback(() => {
    setDir(1);
    setCurrent((p) => (p + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const t = setTimeout(next, 5500);
    return () => clearTimeout(t);
  }, [current, next]);

  const slide = SLIDES[current];

  return (
    <section className="relative h-screen min-h-[680px] overflow-hidden flex items-center">
      {/* Background slides */}
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={current}
          custom={dir}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 1.2, ease: 'easeOut' } }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}
        >
          {/* Product image with parallax feel */}
          <motion.div
            className="absolute right-0 bottom-0 w-[55%] h-[85%] opacity-30 md:opacity-40"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 0.35, transition: { duration: 1.4, ease: 'easeOut' } }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.tag}
              className="w-full h-full object-cover object-center"
              style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0))', WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 30%, rgba(0,0,0,0))' }}
            />
          </motion.div>
          {/* Grain texture */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Three.js particle layer */}
      <ParticleCanvas />

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 z-20 h-40 bg-gradient-to-t from-[#2C1810]/90 to-transparent" />

      {/* Content */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-6 md:px-12">
        <AnimatePresence mode="wait">
          <motion.div key={current} className="max-w-xl">
            {/* Tag */}
            <motion.span
              custom={0}
              variants={text}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 bg-ember-500/20 border border-ember-500/40 text-ember-400 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 bg-ember-400 rounded-full animate-pulse" />
              {slide.tag}
            </motion.span>

            {/* Title */}
            <motion.h1
              custom={1}
              variants={text}
              initial="hidden"
              animate="visible"
              className="font-display text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6"
            >
              {slide.title.split(' ').map((w, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-3"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              custom={3}
              variants={text}
              initial="hidden"
              animate="visible"
              className="text-cream-200/80 text-lg md:text-xl mb-10 leading-relaxed"
            >
              {slide.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={4}
              variants={text}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={onOrder}
                className="group relative overflow-hidden bg-ember-500 hover:bg-ember-600 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-300 shadow-ember hover:shadow-ember-lg hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Order Now
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>
              <a
                href="#products"
                className="flex items-center gap-2 border border-white/30 text-white/90 hover:text-white hover:border-white/60 font-semibold px-8 py-4 rounded-2xl backdrop-blur-sm transition-all duration-300"
              >
                View Menu
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="absolute bottom-10 left-6 md:left-12 z-30 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDir(i > current ? 1 : -1); setCurrent(i); }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current ? 'w-8 bg-ember-500' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Delivery badge */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-10 right-6 md:right-12 z-30 glass rounded-2xl px-5 py-4 hidden md:block"
        >
          <p className="text-cream-100/60 text-xs uppercase tracking-wider mb-1">Next Delivery</p>
          <p className="text-white font-semibold text-sm">Saturday — Order by Friday</p>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">Orders Open</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"
          animate={{ scaleY: [1, 0.3, 1], originY: 0 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}

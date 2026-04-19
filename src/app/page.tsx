'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import HowItWorks from '@/components/HowItWorks';
import ProductsSection from '@/components/ProductsSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import OrderModal from '@/components/OrderModal';

export default function Home() {
  const [orderOpen, setOrderOpen] = useState(false);

  return (
    <main className="page-enter">
      <Navbar />
      <Hero onOrder={() => setOrderOpen(true)} />
      <Marquee />
      <ProductsSection />
      <Marquee reverse />
      <HowItWorks />
      <AboutSection />
      <Footer />
      <Cart onCheckout={() => setOrderOpen(true)} />
      <OrderModal isOpen={orderOpen} onClose={() => setOrderOpen(false)} />
    </main>
  );
}

'use client';

import ScrollReveal from './ScrollReveal';

const STEPS = [
  {
    num: '01',
    icon: '🛒',
    title: 'Browse & Add to Cart',
    desc: 'Choose from our premium selection of fresh chicken cuts. Pick your size — 1kg or 2.5kg family packs.',
    color: 'from-ember-500 to-ember-600',
  },
  {
    num: '02',
    icon: '📅',
    title: 'Order by Friday',
    desc: 'Place your order before Friday morning. We prepare every batch fresh to ensure peak quality.',
    color: 'from-gold-400 to-gold-500',
  },
  {
    num: '03',
    icon: '💳',
    title: 'Pay Securely',
    desc: 'Complete your payment via PayFast — South Africa\'s most trusted payment gateway. Card & EFT accepted.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    num: '04',
    icon: '🚚',
    title: 'Delivered Saturday',
    desc: 'Fresh chicken arrives at your door on Saturday. Or collect for free at our Pretoria location.',
    color: 'from-bark-700 to-bark-900',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-bark-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-ember-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-400 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <ScrollReveal className="text-center mb-16">
          <span className="inline-block text-ember-400 text-sm font-semibold tracking-widest uppercase mb-4">
            Simple Process
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
            How It Works
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Getting premium fresh chicken delivered has never been this easy.
          </p>
        </ScrollReveal>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.num} delay={i * 0.1}>
              <div className="relative group">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(100%+0px)] w-full h-px bg-gradient-to-r from-white/20 to-transparent z-10" style={{ width: 'calc(100% - 4rem)', left: 'calc(100% - 1rem)' }} />
                )}

                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-3xl p-6 transition-all duration-300 group-hover:-translate-y-2">
                  {/* Number */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-4xl font-display font-bold text-white/10">{step.num}</span>
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal delay={0.4} className="text-center mt-14">
          <a
            href="#products"
            className="inline-flex items-center gap-2 bg-ember-500 hover:bg-ember-600 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-1 shadow-ember hover:shadow-ember-lg"
          >
            Start Your Order
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

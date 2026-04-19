'use client';

import ScrollReveal from './ScrollReveal';

const STATS = [
  { value: '5+', label: 'Premium Cuts' },
  { value: '100%', label: 'Fresh Chicken' },
  { value: 'R40', label: 'Flat Delivery' },
  { value: '1 Day', label: 'Order to Door' },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-cream-50 relative overflow-hidden">
      {/* Decorative orb */}
      <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-ember-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <ScrollReveal>
              <span className="inline-block text-ember-500 text-sm font-semibold tracking-widest uppercase mb-4">
                Our Story
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-bark-900 mb-6 leading-tight">
                Pretoria&apos;s Home for{' '}
                <em className="text-ember-500 not-italic">Premium</em>{' '}
                Fresh Chicken
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-bark-700/80 text-lg leading-relaxed mb-6">
                A+Market was born from a simple belief: every family deserves access to premium quality chicken without the premium markup. Andre van der Heever started this business right here in Pretoria, preparing every single batch by hand.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <p className="text-bark-700/70 leading-relaxed mb-8">
                Every week, we source the finest fresh chicken, prepare it using time-tested recipes, and deliver it straight to your door on Saturday morning. No preservatives, no shortcuts — just honest, delicious food your family will love.
              </p>
            </ScrollReveal>

            {/* Contact */}
            <ScrollReveal delay={0.2} id="contact">
              <div className="space-y-3">
                {[
                  { icon: '📞', label: 'Call or WhatsApp', value: '069 427 4833', href: 'tel:+27694274833' },
                  { icon: '✉️', label: 'Email', value: 'Andre.vdheever1010@gmail.com', href: 'mailto:Andre.vdheever1010@gmail.com' },
                  { icon: '📍', label: 'Location', value: 'Pretoria, South Africa', href: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-ember-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-bark-700/60 text-xs uppercase tracking-wider">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-bark-900 font-semibold hover:text-ember-600 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-bark-900 font-semibold">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Stats grid */}
          <ScrollReveal direction="left" delay={0.1}>
            <div className="grid grid-cols-2 gap-5">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className={`rounded-3xl p-8 text-center ${
                    i % 2 === 0
                      ? 'bg-bark-900 text-white'
                      : 'bg-ember-500 text-white'
                  }`}
                >
                  <p className="font-display text-5xl font-bold mb-2">{s.value}</p>
                  <p className="text-white/70 text-sm font-medium">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Banking details card */}
            <div className="mt-5 bg-cream-200 rounded-3xl p-6 border border-cream-300">
              <p className="text-bark-700/60 text-xs uppercase tracking-wider mb-3">Banking Details (EFT)</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-bark-700/70">Bank</span>
                  <span className="font-semibold text-bark-900">Capitec</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bark-700/70">Account Name</span>
                  <span className="font-semibold text-bark-900">A van der Heever</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-bark-700/70">Account No.</span>
                  <span className="font-semibold text-bark-900">1513178448</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

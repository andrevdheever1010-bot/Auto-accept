export default function Footer() {
  return (
    <footer className="bg-bark-900 text-white/60">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-ember-500 rounded-xl flex items-center justify-center shadow-ember">
                <span className="text-white font-display font-bold text-lg leading-none">A+</span>
              </div>
              <span className="font-display text-xl font-bold text-white">Market</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Premium fresh chicken, hand-prepared weekly in Pretoria. Order Friday. Delivered Saturday.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">Orders open this week</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Quick Links</p>
            <ul className="space-y-3 text-sm">
              {[
                { href: '#products', label: 'Browse Menu' },
                { href: '#how-it-works', label: 'How It Works' },
                { href: '#about', label: 'About Us' },
                { href: '#contact', label: 'Contact' },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-white hover:text-ember-400 transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact</p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="tel:+27694274833" className="flex items-center gap-2 hover:text-white transition-colors">
                  <span>📞</span> 069 427 4833
                </a>
              </li>
              <li>
                <a href="mailto:Andre.vdheever1010@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors break-all">
                  <span>✉️</span> Andre.vdheever1010@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span> Pretoria, South Africa
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} A+Market — Andre van der Heever. All rights reserved.</p>
          <p>
            Payments secured by{' '}
            <span className="text-white font-semibold">PayFast</span> ·{' '}
            <a href="/login" className="hover:text-white transition-colors">Admin</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

'use client';

const ITEMS = [
  '🍗 Chicken Nuggets — 1kg R120 · 2.5kg R250',
  '🍖 Chicken Strips — 1kg R120 · 2.5kg R270',
  '🍔 Chicken Patties — 1kg R120 · 2.5kg R250',
  '🔮 Chicken Pops — 1kg R110',
  '🥩 Chicken Schnitzel — 1kg R120 · 2.5kg R270',
  '🚚 Free delivery over Pretoria — R40 flat fee',
  '📅 Order by Friday · Delivered Saturday',
  '✨ Fresh, Premium, Hand-Prepared',
];

export default function Marquee({ reverse = false }: { reverse?: boolean }) {
  const content = [...ITEMS, ...ITEMS];

  return (
    <div className="overflow-hidden whitespace-nowrap py-3.5 bg-ember-600 relative">
      <div
        className={`inline-flex gap-0 ${reverse ? 'animate-marquee2' : 'animate-marquee'}`}
        style={{ willChange: 'transform' }}
      >
        {content.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-0 text-white/90 text-sm font-medium"
          >
            <span className="px-6">{item}</span>
            <span className="text-white/30 select-none">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

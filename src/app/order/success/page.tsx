import Link from 'next/link';

export default function OrderSuccess({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce-subtle">
          🎉
        </div>
        <h1 className="font-display text-3xl font-bold text-bark-900 mb-3">
          Payment Successful!
        </h1>
        <p className="text-bark-700/70 mb-4">
          Your order{searchParams.order ? ` #${searchParams.order}` : ''} has been confirmed. We&apos;ll have your fresh chicken ready for{' '}
          <strong>Saturday delivery</strong>.
        </p>
        <p className="text-bark-700/60 text-sm mb-8">
          You&apos;ll receive a WhatsApp notification and email confirmation shortly.
          <br />
          Questions? Call Andre on <a href="tel:+27694274833" className="text-ember-600 font-semibold">069 427 4833</a>.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-ember-500 hover:bg-ember-600 text-white font-semibold px-8 py-4 rounded-2xl transition-all hover:-translate-y-0.5 shadow-ember"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  );
}

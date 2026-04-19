'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store';
import { DELIVERY_FEE } from '@/lib/products';
import { PAYFAST_URL } from '@/lib/payfast';
import toast from 'react-hot-toast';
import type { OrderFormData } from '@/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const FIELDS: { name: keyof OrderFormData; label: string; type: string; placeholder: string; required?: boolean }[] = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Smith', required: true },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '069 427 4833', required: true },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true },
  { name: 'notes', label: 'Special Instructions', type: 'textarea', placeholder: 'Any allergies, special requests…', required: false },
];

export default function OrderModal({ isOpen, onClose }: Props) {
  const { items, total, clearCart } = useCartStore();
  const subtotal = total();
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [form, setForm] = useState<OrderFormData>({ name: '', phone: '', email: '', address: '', deliveryType: 'delivery' });
  const [loading, setLoading] = useState(false);
  const payfastFormRef = useRef<HTMLFormElement>(null);
  const [payfastParams, setPayfastParams] = useState<Record<string, string> | null>(null);

  const deliveryFee = deliveryType === 'delivery' ? DELIVERY_FEE : 0;
  const orderTotal = subtotal + deliveryFee;

  const handleChange = (field: keyof OrderFormData, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    if (deliveryType === 'delivery' && !form.address.trim()) {
      toast.error('Please enter your delivery address.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          deliveryType,
          items,
          subtotal,
          deliveryFee,
          total: orderTotal,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create order');

      // Redirect to PayFast
      setPayfastParams(data.payfastParams);
      clearCart();
      onClose();

      // Auto-submit PayFast form after render
      setTimeout(() => {
        payfastFormRef.current?.submit();
        toast.success(`Order #${data.orderNumber} created! Redirecting to payment…`);
      }, 300);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hidden PayFast form */}
      {payfastParams && (
        <form ref={payfastFormRef} action={PAYFAST_URL} method="POST" className="hidden">
          {Object.entries(payfastParams).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v} />
          ))}
        </form>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-x-4 top-[5vh] bottom-[5vh] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50 bg-white rounded-3xl overflow-hidden shadow-warm-lg flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-ember-600 to-ember-500 p-6 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">Complete Your Order</h2>
                  <p className="text-white/70 text-sm">{items.length} item{items.length !== 1 ? 's' : ''} · R{orderTotal.toFixed(2)} total</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Delivery type */}
                <div>
                  <label className="block text-sm font-semibold text-bark-800 mb-2">
                    Delivery or Pickup?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['delivery', 'pickup'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { setDeliveryType(t); handleChange('deliveryType', t); }}
                        className={`py-3 rounded-xl border-2 font-semibold text-sm capitalize transition-all ${
                          deliveryType === t
                            ? 'border-ember-500 bg-ember-50 text-ember-600'
                            : 'border-cream-300 text-bark-700 hover:border-ember-300'
                        }`}
                      >
                        {t === 'delivery' ? `🚚 Delivery (+R${DELIVERY_FEE})` : '🏪 Pickup (Free)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input fields */}
                {FIELDS.map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-semibold text-bark-800 mb-1.5">
                      {f.label}{f.required && <span className="text-ember-500 ml-0.5">*</span>}
                    </label>
                    {f.type === 'textarea' ? (
                      <textarea
                        value={form[f.name] || ''}
                        onChange={(e) => handleChange(f.name, e.target.value)}
                        placeholder={f.placeholder}
                        rows={3}
                        className="w-full border border-cream-300 rounded-xl px-4 py-3 text-bark-900 placeholder-bark-700/40 text-sm resize-none focus:border-ember-400 focus:ring-2 focus:ring-ember-400/20 transition-all outline-none"
                      />
                    ) : (
                      <input
                        type={f.type}
                        value={form[f.name] || ''}
                        onChange={(e) => handleChange(f.name, e.target.value)}
                        placeholder={f.placeholder}
                        required={f.required}
                        className="w-full border border-cream-300 rounded-xl px-4 py-3 text-bark-900 placeholder-bark-700/40 text-sm focus:border-ember-400 focus:ring-2 focus:ring-ember-400/20 transition-all outline-none"
                      />
                    )}
                  </div>
                ))}

                {/* Address (conditional) */}
                {deliveryType === 'delivery' && (
                  <div>
                    <label className="block text-sm font-semibold text-bark-800 mb-1.5">
                      Delivery Address<span className="text-ember-500 ml-0.5">*</span>
                    </label>
                    <textarea
                      value={form.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="123 Main Street, Pretoria, 0001"
                      rows={2}
                      required
                      className="w-full border border-cream-300 rounded-xl px-4 py-3 text-bark-900 placeholder-bark-700/40 text-sm resize-none focus:border-ember-400 focus:ring-2 focus:ring-ember-400/20 transition-all outline-none"
                    />
                  </div>
                )}

                {/* Order summary */}
                <div className="bg-cream-100 rounded-2xl p-4 space-y-2">
                  <p className="font-semibold text-bark-900 text-sm mb-3">Order Summary</p>
                  {items.map((item) => (
                    <div key={`${item.productSlug}-${item.size}`} className="flex justify-between text-sm">
                      <span className="text-bark-700">{item.quantity}x {item.productName} ({item.size})</span>
                      <span className="font-semibold text-bark-900">R{(item.price * item.quantity).toFixed(0)}</span>
                    </div>
                  ))}
                  <div className="border-t border-cream-300 pt-2 space-y-1">
                    <div className="flex justify-between text-sm text-bark-700/70">
                      <span>Subtotal</span><span>R{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-bark-700/70">
                      <span>Delivery</span><span>{deliveryFee === 0 ? 'Free' : `R${deliveryFee}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-bark-900">
                      <span className="font-display">Total</span>
                      <span className="text-ember-600 font-display text-lg">R{orderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-bark-700/50 text-center">
                  🔒 Your payment is processed securely by PayFast. You will be redirected to complete payment.
                </p>
              </form>

              {/* Submit */}
              <div className="p-6 border-t border-cream-200">
                <button
                  type="submit"
                  form=""
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-ember-500 hover:bg-ember-600 disabled:bg-gray-300 text-white font-semibold py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 shadow-ember hover:shadow-ember-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Pay R{orderTotal.toFixed(2)} with PayFast
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

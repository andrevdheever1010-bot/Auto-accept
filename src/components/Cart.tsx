'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store';
import { DELIVERY_FEE } from '@/lib/products';

interface Props {
  onCheckout: () => void;
}

export default function Cart({ onCheckout }: Props) {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore();
  const subtotal = total();

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white shadow-warm-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-cream-200">
              <div>
                <h2 className="font-display text-xl font-bold text-bark-900">Your Cart</h2>
                <p className="text-bark-700/60 text-sm">{items.length} item{items.length !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={closeCart}
                className="w-10 h-10 rounded-xl bg-cream-100 hover:bg-cream-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-bark-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center py-20"
                  >
                    <div className="text-6xl mb-4">🛒</div>
                    <p className="font-display text-xl text-bark-900 mb-2">Cart is empty</p>
                    <p className="text-bark-700/60 text-sm">Add some delicious chicken to get started!</p>
                    <button
                      onClick={closeCart}
                      className="mt-6 bg-ember-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-ember-600 transition-colors"
                    >
                      Browse Menu
                    </button>
                  </motion.div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={`${item.productSlug}-${item.size}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="flex items-center gap-4 bg-cream-50 rounded-2xl p-4"
                    >
                      <div className="w-14 h-14 bg-cream-200 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        🍗
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-bark-900 text-sm truncate">{item.productName}</p>
                        <p className="text-bark-700/60 text-xs">{item.size} — R{item.price} each</p>
                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.productSlug, item.size, item.quantity - 1)}
                            className="w-6 h-6 rounded-lg bg-white shadow-sm text-bark-800 text-sm font-bold hover:bg-ember-500 hover:text-white transition-colors flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="text-sm font-semibold text-bark-900 w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productSlug, item.size, item.quantity + 1)}
                            className="w-6 h-6 rounded-lg bg-white shadow-sm text-bark-800 text-sm font-bold hover:bg-ember-500 hover:text-white transition-colors flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-bold text-ember-600 font-display">
                          R{(item.price * item.quantity).toFixed(0)}
                        </span>
                        <button
                          onClick={() => removeItem(item.productSlug, item.size)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-cream-200 p-6 bg-white">
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-sm text-bark-700/70">
                    <span>Subtotal</span>
                    <span>R{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-bark-700/70">
                    <span>Delivery</span>
                    <span className="text-emerald-600">From R{DELIVERY_FEE}</span>
                  </div>
                  <div className="flex justify-between font-bold text-bark-900 text-lg pt-2 border-t border-cream-200">
                    <span className="font-display">Est. Total</span>
                    <span className="text-ember-600 font-display">R{(subtotal + DELIVERY_FEE).toFixed(2)}+</span>
                  </div>
                </div>
                <button
                  onClick={() => { closeCart(); onCheckout(); }}
                  className="w-full bg-ember-500 hover:bg-ember-600 text-white font-semibold py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 shadow-ember hover:shadow-ember-lg flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Proceed to Checkout
                </button>
                <p className="text-center text-xs text-bark-700/40 mt-3">
                  🔒 Secure payment via PayFast
                </p>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

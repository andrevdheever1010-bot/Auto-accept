'use client';

import { useState, useEffect, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { PRODUCTS } from '@/lib/products';
import type { Order, OrderStatus } from '@/types';

type Tab = 'orders' | 'products' | 'settings';

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700 border-amber-200',
  paid:       'bg-emerald-100 text-emerald-700 border-emerald-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  ready:      'bg-purple-100 text-purple-700 border-purple-200',
  delivered:  'bg-green-100 text-green-700 border-green-200',
  cancelled:  'bg-red-100 text-red-700 border-red-200',
};

const STATUS_NEXT: Record<string, OrderStatus[]> = {
  pending:    ['paid', 'cancelled'],
  paid:       ['processing', 'cancelled'],
  processing: ['ready', 'cancelled'],
  ready:      ['delivered', 'cancelled'],
  delivered:  [],
  cancelled:  [],
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalOrders: 0, todayOrders: 0, paidOrders: 0, totalRevenue: 0 });
  const [products, setProducts] = useState<Array<{ slug: string; name: string; soldOut: boolean }>>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoadingOrders(true);
    const url = statusFilter ? `/api/orders?status=${statusFilter}&limit=50` : '/api/orders?limit=50';
    const res = await fetch(url);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoadingOrders(false);
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => r.json()).then(setStats).catch(console.error);
    fetch('/api/products').then((r) => r.json()).then(setProducts).catch(console.error);
  }, []);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      toast.success(`Order marked as ${status}`);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
      if (selectedOrder?.id === orderId) setSelectedOrder((o) => o ? { ...o, status } : o);
    } else {
      toast.error('Failed to update status');
    }
  };

  const toggleSoldOut = async (slug: string, soldOut: boolean) => {
    const res = await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, soldOut }),
    });
    if (res.ok) {
      setProducts((prev) => prev.map((p) => p.slug === slug ? { ...p, soldOut } : p));
      toast.success(`${soldOut ? 'Marked sold out' : 'Back in stock'}!`);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    setPwLoading(true);
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }),
    });
    const data = await res.json();
    if (res.ok) { toast.success('Password changed!'); setPwForm({ current: '', newPw: '', confirm: '' }); }
    else toast.error(data.error || 'Failed');
    setPwLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-bark-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-ember-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">A+</span>
            </div>
            <div>
              <h1 className="text-white font-display font-bold text-lg leading-none">A+Market Admin</h1>
              <p className="text-white/40 text-xs">Management Console</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-white/60 hover:text-white text-sm transition-colors">View Shop</a>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-sm font-medium px-4 py-2 rounded-xl transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: stats.totalOrders, icon: '📦' },
            { label: 'Today', value: stats.todayOrders, icon: '📅' },
            { label: 'Paid Orders', value: stats.paidOrders, icon: '✅' },
            { label: 'Revenue', value: `R${stats.totalRevenue.toFixed(0)}`, icon: '💰' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card">
              <div className="text-2xl mb-2">{s.icon}</div>
              <p className="font-display text-2xl font-bold text-bark-900">{s.value}</p>
              <p className="text-bark-700/60 text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-card mb-6 w-fit">
          {(['orders', 'products', 'settings'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                tab === t ? 'bg-ember-500 text-white shadow-ember' : 'text-bark-700/70 hover:text-bark-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders list */}
            <div className="lg:col-span-2">
              {/* Filter */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {['', 'pending', 'paid', 'processing', 'ready', 'delivered', 'cancelled'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize ${
                      statusFilter === s
                        ? 'bg-ember-500 text-white border-ember-500'
                        : 'bg-white text-bark-700 border-cream-300 hover:border-ember-400'
                    }`}
                  >
                    {s || 'All'}
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                {loadingOrders ? (
                  <div className="p-8 text-center text-bark-700/50">Loading orders…</div>
                ) : orders.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-bark-700/60">No orders found</p>
                  </div>
                ) : (
                  <div className="divide-y divide-cream-200">
                    {orders.map((order) => (
                      <button
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`w-full text-left px-5 py-4 hover:bg-cream-50 transition-colors ${
                          selectedOrder?.id === order.id ? 'bg-cream-100' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-bark-900 text-sm">{order.orderNumber}</span>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[order.status] || ''}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-bark-700/80 text-sm">{order.name}</p>
                            <p className="text-bark-700/50 text-xs">{order.phone} · {order.deliveryType}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-ember-600 font-display">R{order.total.toFixed(0)}</p>
                            <p className="text-bark-700/40 text-xs">{new Date(order.createdAt).toLocaleDateString('en-ZA')}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Order detail */}
            <div>
              <AnimatePresence mode="wait">
                {selectedOrder ? (
                  <motion.div
                    key={selectedOrder.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-2xl shadow-card p-5 sticky top-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-bold text-bark-900">{selectedOrder.orderNumber}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${STATUS_COLORS[selectedOrder.status] || ''}`}>
                        {selectedOrder.status}
                      </span>
                    </div>

                    {/* Customer info */}
                    <div className="bg-cream-100 rounded-xl p-4 mb-4 space-y-1.5 text-sm">
                      <p><span className="text-bark-700/60">Name:</span> <strong>{selectedOrder.name}</strong></p>
                      <p><span className="text-bark-700/60">Phone:</span> <a href={`tel:${selectedOrder.phone}`} className="text-ember-600 font-semibold">{selectedOrder.phone}</a></p>
                      <p><span className="text-bark-700/60">Email:</span> {selectedOrder.email}</p>
                      <p><span className="text-bark-700/60">Type:</span> {selectedOrder.deliveryType}</p>
                      {selectedOrder.deliveryType === 'delivery' && (
                        <p><span className="text-bark-700/60">Address:</span> {selectedOrder.address}</p>
                      )}
                      {selectedOrder.notes && (
                        <p><span className="text-bark-700/60">Notes:</span> {selectedOrder.notes}</p>
                      )}
                    </div>

                    {/* Items */}
                    <div className="mb-4 space-y-2">
                      {(selectedOrder.items as Array<{productName: string; size: string; quantity: number; price: number}>).map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-bark-700">{item.quantity}× {item.productName} ({item.size})</span>
                          <span className="font-semibold text-bark-900">R{(item.price * item.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                      <div className="border-t border-cream-200 pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-ember-600">R{selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Status actions */}
                    {STATUS_NEXT[selectedOrder.status]?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-bark-700/60 uppercase tracking-wider">Update Status</p>
                        {STATUS_NEXT[selectedOrder.status].map((s) => (
                          <button
                            key={s}
                            onClick={() => updateOrderStatus(selectedOrder.id, s)}
                            className={`w-full py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                              s === 'cancelled'
                                ? 'border border-red-200 text-red-600 hover:bg-red-50'
                                : 'bg-ember-500 hover:bg-ember-600 text-white shadow-ember'
                            }`}
                          >
                            Mark as {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-card p-8 text-center text-bark-700/40">
                    <p className="text-3xl mb-2">👆</p>
                    <p className="text-sm">Select an order to view details</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {tab === 'products' && (
          <div className="max-w-2xl">
            <h2 className="font-display text-xl font-bold text-bark-900 mb-4">Product Availability</h2>
            <div className="bg-white rounded-2xl shadow-card divide-y divide-cream-200">
              {PRODUCTS.map((product) => {
                const dbProduct = products.find((p) => p.slug === product.slug);
                const soldOut = dbProduct?.soldOut ?? false;
                return (
                  <div key={product.slug} className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{product.emoji}</span>
                      <div>
                        <p className="font-semibold text-bark-900">{product.name}</p>
                        <p className="text-bark-700/60 text-xs">
                          {product.variants.map((v) => `${v.size} R${v.price}`).join(' · ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${soldOut ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {soldOut ? 'Sold Out' : 'In Stock'}
                      </span>
                      <button
                        onClick={() => toggleSoldOut(product.slug, !soldOut)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${soldOut ? 'bg-red-400' : 'bg-emerald-400'}`}
                      >
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${soldOut ? 'translate-x-0.5' : 'translate-x-6'}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {tab === 'settings' && (
          <div className="max-w-md">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <h2 className="font-display text-xl font-bold text-bark-900 mb-5">Change Password</h2>
              <form onSubmit={changePassword} className="space-y-4">
                {[
                  { label: 'Current Password', field: 'current' as const },
                  { label: 'New Password', field: 'newPw' as const },
                  { label: 'Confirm New Password', field: 'confirm' as const },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="block text-sm font-semibold text-bark-800 mb-1.5">{label}</label>
                    <input
                      type="password"
                      value={pwForm[field]}
                      onChange={(e) => setPwForm((p) => ({ ...p, [field]: e.target.value }))}
                      required
                      className="w-full border border-cream-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-ember-400 focus:ring-2 focus:ring-ember-400/20 transition-all"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="w-full bg-ember-500 hover:bg-ember-600 text-white font-semibold py-3 rounded-xl transition-all shadow-ember flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {pwLoading ? 'Saving…' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* Business info */}
            <div className="bg-white rounded-2xl shadow-card p-6 mt-4">
              <h2 className="font-display text-lg font-bold text-bark-900 mb-4">Business Info</h2>
              <div className="space-y-2 text-sm text-bark-700/80">
                <p><strong>Owner:</strong> Andre van der Heever</p>
                <p><strong>Phone:</strong> 069 427 4833</p>
                <p><strong>Email:</strong> Andre.vdheever1010@gmail.com</p>
                <p><strong>Location:</strong> Pretoria, South Africa</p>
                <p className="pt-2 border-t border-cream-200"><strong>PayFast Merchant ID:</strong> 27575353</p>
                <p><strong>Capitec Account:</strong> 1513178448</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

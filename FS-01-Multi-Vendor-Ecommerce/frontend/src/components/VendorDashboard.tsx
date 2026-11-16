import React, { useState, useEffect } from 'react';
import { Plus, Package, DollarSign, Clock, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import { Product, User } from '../types';

interface VendorDashboardProps {
  currentUser: User;
  token: string;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ currentUser, token }) => {
  const [stats, setStats] = useState({
    balance: 4250.0,
    totalSales: 47200.0,
    totalProducts: 3,
    totalOrders: 8,
    pendingOrders: 2,
    deliveredOrders: 6,
  });
  const [vendorProducts, setVendorProducts] = useState<Product[]>([]);
  const [vendorOrders, setVendorOrders] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newStock, setNewStock] = useState('25');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80');
  const [newDescription, setNewDescription] = useState('');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      // Fetch categories
      const catRes = await fetch('/api/products/categories');
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
        if (catData.length > 0) setNewCategory(catData[0].id);
      }

      // Fetch products
      const prodRes = await fetch('/api/products');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setVendorProducts(prodData.filter((p: any) => p.vendorId === currentUser.vendorProfile?.id));
      }

      // Fetch vendor orders
      const orderRes = await fetch('/api/orders/vendor-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setVendorOrders(orderData);
      }
    } catch (err) {
      console.error('Failed to load vendor data', err);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription || 'High performance quality merchandise.',
          price: parseFloat(newPrice),
          stock: parseInt(newStock, 10),
          categoryId: newCategory || categories[0]?.id,
          imageUrl: newImage,
          isFeatured: true,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewTitle('');
        setNewPrice('');
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to create product', err);
    }
  };

  const updateStatus = async (itemId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/items/${itemId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Vendor Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.vendorProfile?.logoUrl || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=150'}
            alt="Store Logo"
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/10"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight">
                {currentUser.vendorProfile?.storeName || 'Vendor Merchant Portal'}
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Active Store
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              {currentUser.vendorProfile?.description || 'Manage products, monitor inventory, and fulfill incoming customer orders.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-600/30 transition self-stretch md:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Withdrawable Balance</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ${(currentUser.vendorProfile?.balance || stats.balance).toFixed(2)}
            </h3>
            <span className="text-[11px] text-emerald-600 font-bold">Net Payouts (90% cut)</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Sales</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ${(currentUser.vendorProfile?.totalSales || stats.totalSales).toFixed(2)}
            </h3>
            <span className="text-[11px] text-blue-600 font-bold">Lifetime Sales Volume</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Inventory</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{vendorProducts.length} Products</h3>
            <span className="text-[11px] text-slate-500">Live in Marketplace</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Commission Rate</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {currentUser.vendorProfile?.commissionRate || 10}%
            </h3>
            <span className="text-[11px] text-purple-600 font-bold">Platform Retained Cut</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Columns: Products List & Received Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Managed Products */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span>Store Products Catalog ({vendorProducts.length})</span>
          </h2>

          <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto pr-1">
            {vendorProducts.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate">{p.title}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>Stock: {p.stock} units</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold">${p.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                  Listed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Received Orders */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span>Incoming Customer Orders ({vendorOrders.length})</span>
          </h2>

          <div className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto pr-1">
            {vendorOrders.length === 0 ? (
              <p className="text-sm text-slate-500 py-8 text-center">No orders received yet.</p>
            ) : (
              vendorOrders.map((item) => (
                <div key={item.id} className="py-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-blue-600">
                        {item.order?.orderNumber || 'ORD-001'}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{item.product?.title}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">
                        ${item.totalPrice.toFixed(2)}
                      </span>
                      <p className="text-[11px] text-emerald-600 font-medium">
                        Payout: ${item.vendorCut.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500">
                      Customer: {item.order?.customer?.name || 'Customer'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateStatus(item.id, 'PROCESSING')}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition ${
                          item.status === 'PROCESSING'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Processing
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, 'SHIPPED')}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition ${
                          item.status === 'SHIPPED'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Shipped
                      </button>
                      <button
                        onClick={() => updateStatus(item.id, 'DELIVERED')}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition ${
                          item.status === 'DELIVERED'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Delivered
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-slate-900">List New Product on Marketplace</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ultra-Light Aluminum Mechanical Keyboard"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="99.99"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Image URL</label>
                <input
                  type="url"
                  required
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  placeholder="Feature highlights, technical specifications, warranty..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
                >
                  Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

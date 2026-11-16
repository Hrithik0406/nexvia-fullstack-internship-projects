import React, { useState, useEffect } from 'react';
import { Package, ShieldCheck, Clock, CheckCircle2, Truck } from 'lucide-react';
import { Order } from '../types';

interface MyOrdersViewProps {
  token: string;
}

export const MyOrdersView: React.FC<MyOrdersViewProps> = ({ token }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Purchase History & Receipts</h1>
          <p className="text-xs text-slate-500 mt-1">Multi-vendor item statuses and tracking details.</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
          {orders.length} Total Orders
        </span>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading order records...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-3">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800">No Orders Yet</h3>
          <p className="text-xs text-slate-500">Items you purchase across vendors will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <span className="text-xs font-black text-blue-600">{order.orderNumber}</span>
                  <p className="text-[11px] text-slate-400">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-900">
                    Total: ${order.totalAmount.toFixed(2)}
                  </span>
                  <span className="block text-[10px] text-emerald-600 font-bold">
                    Payment Verified (Split Completed)
                  </span>
                </div>
              </div>

              {/* Items Breakdown by Vendor */}
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 text-xs bg-slate-50/70 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product?.imageUrl}
                        alt=""
                        className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{item.product?.title}</p>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Vendor: {item.vendor?.storeName || 'Verified Merchant'}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-slate-800">${item.totalPrice.toFixed(2)}</span>
                      <div className="mt-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                            item.status === 'DELIVERED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : item.status === 'SHIPPED'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {item.status === 'DELIVERED' && <CheckCircle2 className="w-3 h-3" />}
                          {item.status === 'SHIPPED' && <Truck className="w-3 h-3" />}
                          {item.status === 'PROCESSING' && <Clock className="w-3 h-3" />}
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping address info */}
              <p className="text-[11px] text-slate-500 pt-1">
                <strong>Delivery Address:</strong> {order.shippingAddress}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

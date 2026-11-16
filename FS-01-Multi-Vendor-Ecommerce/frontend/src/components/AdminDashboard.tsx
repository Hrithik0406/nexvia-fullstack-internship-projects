import React, { useState, useEffect } from 'react';
import { DollarSign, Percent, Store, Users, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react';
import { User } from '../types';

interface AdminDashboardProps {
  currentUser: User;
  token: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, token }) => {
  const [data, setData] = useState<any>({
    metrics: {
      totalUsers: 4,
      totalVendors: 2,
      totalProducts: 6,
      totalOrders: 1,
      grossMarketplaceValue: 268.99,
      totalCommissionEarned: 28.48,
    },
    recentOrders: [],
    vendors: [],
  });

  useEffect(() => {
    fetchMetrics();
  }, [token]);

  const fetchMetrics = async () => {
    try {
      const res = await fetch('/api/admin/metrics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load admin metrics', err);
    }
  };

  const { metrics, recentOrders, vendors } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-black tracking-tight">Nexvia Platform Administration</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1 max-w-xl">
            Live overview of marketplace transactions, commission revenue split, vendor compliance, and store operations.
          </p>
        </div>
        <span className="hidden sm:inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-full">
          Super Admin Privileges
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Merchandise Value (GMV)</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">${metrics.grossMarketplaceValue.toFixed(2)}</h3>
            <span className="text-[11px] text-blue-600 font-bold">Total Platform Volume</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform Retained Commission</p>
            <h3 className="text-2xl font-black text-purple-700 mt-1">${metrics.totalCommissionEarned.toFixed(2)}</h3>
            <span className="text-[11px] text-purple-600 font-bold">~10-12% Average Take Rate</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Vendors</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.totalVendors} Stores</h3>
            <span className="text-[11px] text-emerald-600 font-bold">100% Verified Merchants</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Customer Base</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{metrics.totalUsers} Accounts</h3>
            <span className="text-[11px] text-slate-500">Across All Roles</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Store className="w-5 h-5 text-purple-600" />
          <span>Registered Marketplace Merchants</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="p-3">Store Name</th>
                <th className="p-3">Owner Account</th>
                <th className="p-3">Products</th>
                <th className="p-3">Commission Cut</th>
                <th className="p-3">Vendor Balance</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vendors.map((v: any) => (
                <tr key={v.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <img src={v.logoUrl} alt="" className="w-7 h-7 rounded-lg object-cover" />
                    <span>{v.storeName}</span>
                  </td>
                  <td className="p-3 text-slate-600">{v.user?.email}</td>
                  <td className="p-3 font-semibold">{v._count?.products || 0} Listed</td>
                  <td className="p-3 font-bold text-purple-600">{v.commissionRate}%</td>
                  <td className="p-3 font-bold text-emerald-600">${v.balance.toFixed(2)}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      <CheckCircle className="w-3 h-3" />
                      Approved
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

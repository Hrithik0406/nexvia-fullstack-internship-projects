import React from 'react';
import { ShoppingBag, Store, ShieldAlert, Package, Search, UserCheck } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeView: 'store' | 'vendor' | 'admin' | 'orders';
  setActiveView: (view: 'store' | 'vendor' | 'admin' | 'orders') => void;
  currentUser: User;
  switchRole: (role: 'CUSTOMER' | 'VENDOR' | 'ADMIN') => void;
  cartCount: number;
  openCart: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  currentUser,
  switchRole,
  cartCount,
  openCart,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 text-center flex items-center justify-between">
        <span className="hidden sm:inline">Nexvia Capstone FS-01: Multi-Vendor E-Commerce Platform</span>
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="text-slate-400 font-medium">Quick Evaluator Role:</span>
          {(['CUSTOMER', 'VENDOR', 'ADMIN'] as const).map((r) => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                currentUser.role === r
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div
            onClick={() => setActiveView('store')}
            className="flex items-center gap-2.5 cursor-pointer flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Nexvia<span className="text-blue-600">Market</span>
              </span>
              <span className="hidden md:inline-block ml-1.5 px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                MULTI-VENDOR
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search premium tech, apparel, artisan gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-sm rounded-full border border-transparent focus:border-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveView('store')}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                activeView === 'store'
                  ? 'bg-slate-100 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Marketplace
            </button>

            {currentUser.role === 'VENDOR' && (
              <button
                onClick={() => setActiveView('vendor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  activeView === 'vendor'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Vendor Portal</span>
              </button>
            )}

            {currentUser.role === 'ADMIN' && (
              <button
                onClick={() => setActiveView('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  activeView === 'admin'
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Console</span>
              </button>
            )}

            <button
              onClick={() => setActiveView('orders')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                activeView === 'orders'
                  ? 'bg-slate-100 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span className="hidden md:inline">My Orders</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-full transition"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile pill */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div className="leading-tight">
                <p className="font-semibold text-slate-800">{currentUser.name}</p>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

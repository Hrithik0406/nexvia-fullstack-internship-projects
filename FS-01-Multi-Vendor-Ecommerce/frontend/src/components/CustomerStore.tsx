import React, { useState } from 'react';
import { Sparkles, Layers, SlidersHorizontal, Check } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { Product, Category } from '../types';

interface CustomerStoreProps {
  products: Product[];
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  onAddToCart: (product: Product) => void;
  searchQuery: string;
}

export const CustomerStore: React.FC<CustomerStoreProps> = ({
  products,
  categories,
  selectedCategory,
  setSelectedCategory,
  onAddToCart,
  searchQuery,
}) => {
  const [selectedVendorFilter, setSelectedVendorFilter] = useState<string>('all');

  // Filter products by category, search, and vendor
  const filteredProducts = products.filter((p) => {
    const matchesCategory = !selectedCategory || p.category?.slug === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVendor =
      selectedVendorFilter === 'all' || p.vendor?.id === selectedVendorFilter;
    return matchesCategory && matchesSearch && matchesVendor;
  });

  // Extract unique vendors from products
  const uniqueVendors = Array.from(
    new Map(
      products
        .filter((p) => p.vendor)
        .map((p) => [p.vendor!.id, p.vendor!])
    ).values()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-8 sm:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Multi-Vendor Direct Fulfillment</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Discover Curated Tech & Lifestyle Creators.
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Shop directly from verified independent vendors. Combined checkout with transparent split payments and automated delivery tracking.
          </p>
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Categories & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === null
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Departments
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === c.slug
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Vendor Filter Dropdown */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-500">Filter by Store:</span>
            <select
              value={selectedVendorFilter}
              onChange={(e) => setSelectedVendorFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Verified Merchants</option>
              {uniqueVendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.storeName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {selectedCategory ? `${selectedCategory.toUpperCase()} COLLECTION` : 'Available Products'}
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredProducts.length} items
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-2">
            <p className="font-bold text-slate-700">No products found matching your search.</p>
            <p className="text-xs text-slate-400">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

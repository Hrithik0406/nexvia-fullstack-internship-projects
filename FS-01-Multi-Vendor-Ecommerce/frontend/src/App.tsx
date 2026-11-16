import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CustomerStore } from './components/CustomerStore';
import { VendorDashboard } from './components/VendorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { MyOrdersView } from './components/MyOrdersView';
import { CartDrawer } from './components/CartDrawer';
import { Product, Category, CartItem, User } from './types';

export const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'store' | 'vendor' | 'admin' | 'orders'>('store');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'user-customer-1',
    name: 'Hrithik Sarkar',
    email: 'customer@test.com',
    role: 'CUSTOMER',
  });
  const [token, setToken] = useState<string>('');

  // Initial user setup
  useEffect(() => {
    loginAsRole('CUSTOMER');
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/products/categories'),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
      }
    } catch (err) {
      console.error('Error fetching marketplace data', err);
    }
  };

  const loginAsRole = async (role: 'CUSTOMER' | 'VENDOR' | 'ADMIN') => {
    let email = 'customer@test.com';
    if (role === 'VENDOR') email = 'sales@apexelectronics.com';
    if (role === 'ADMIN') email = 'admin@nexvia.com';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'password123' }),
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setCurrentUser(data.user);
        if (role === 'VENDOR') setActiveView('vendor');
        else if (role === 'ADMIN') setActiveView('admin');
        else setActiveView('store');
      }
    } catch (err) {
      console.error('Login error', err);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleCheckout = async (shippingAddress: string) => {
    try {
      const items = cart.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items, shippingAddress }),
      });

      if (res.ok) {
        setCart([]);
        fetchStoreData();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Checkout failed', err);
      return false;
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar
          activeView={activeView}
          setActiveView={setActiveView}
          currentUser={currentUser}
          switchRole={loginAsRole}
          cartCount={cartCount}
          openCart={() => setIsCartOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <main>
          {activeView === 'store' && (
            <CustomerStore
              products={products}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onAddToCart={handleAddToCart}
              searchQuery={searchQuery}
            />
          )}

          {activeView === 'vendor' && (
            <VendorDashboard currentUser={currentUser} token={token} />
          )}

          {activeView === 'admin' && (
            <AdminDashboard currentUser={currentUser} token={token} />
          )}

          {activeView === 'orders' && <MyOrdersView token={token} />}
        </main>
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Nexvia Technologies Internship — Capstone Project FS-01 (Multi-Vendor Marketplace)</p>
          <div className="flex items-center gap-4 font-semibold text-slate-600">
            <span>Candidate: Hrithik Sarkar</span>
            <span>•</span>
            <span>ID: NEX-INT-2026-1493</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

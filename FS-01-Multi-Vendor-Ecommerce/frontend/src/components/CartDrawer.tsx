import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, CheckCircle2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (shippingAddress: string) => Promise<boolean>;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [shippingAddress, setShippingAddress] = useState('Flat 402, Green Glen Heights, Hitec City, Hyderabad');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const estimatedTax = subtotal * 0.05; // 5% GST/Tax
  const platformFee = subtotal * 0.10; // 10% platform split calculation preview
  const finalTotal = subtotal + estimatedTax;

  // Group items by vendor
  const vendorGroups = cart.reduce<{ [vendorId: string]: { vendorName: string; items: CartItem[] } }>(
    (acc, item) => {
      const vId = item.product.vendorId;
      const vName = item.product.vendor?.storeName || 'Verified Vendor';
      if (!acc[vId]) {
        acc[vId] = { vendorName: vName, items: [] };
      }
      acc[vId].items.push(item);
      return acc;
    },
    {}
  );

  const handleCheckoutSubmit = async () => {
    setIsSubmitting(true);
    const success = await onCheckout(shippingAddress);
    setIsSubmitting(false);
    if (success) {
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        onClose();
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Your Cart ({cart.length})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-5 overflow-y-auto flex-1 space-y-6">
            {orderSuccess ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Payment Processed!</h3>
                <p className="text-sm text-slate-600 max-w-xs mx-auto">
                  Your multi-vendor order has been placed. Automated payouts and platform commissions have been distributed.
                </p>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <p className="text-slate-500 font-medium">Your shopping bag is empty.</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <>
                {/* Vendor Groups */}
                {Object.entries(vendorGroups).map(([vId, group]) => (
                  <div key={vId} className="border border-slate-200/80 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 pb-2 border-b border-slate-200">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      <span>Fulfillment by: {group.vendorName}</span>
                    </div>

                    {group.items.map((item) => (
                      <div key={item.product.id} className="flex gap-3 items-center">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {item.product.title}
                          </h4>
                          <span className="text-xs font-extrabold text-blue-600">
                            ${item.product.price.toFixed(2)}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="w-5 h-5 rounded bg-slate-200 text-xs font-bold flex items-center justify-center hover:bg-slate-300"
                            >
                              -
                            </button>
                            <span className="text-xs font-semibold px-1">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="w-5 h-5 rounded bg-slate-200 text-xs font-bold flex items-center justify-center hover:bg-slate-300"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-slate-400 hover:text-red-500 p-1 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Shipping Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Shipping Delivery Address</label>
                  <input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer & Split Breakdown */}
          {cart.length > 0 && !orderSuccess && (
            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-semibold">${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-blue-600 text-[11px] font-semibold bg-blue-50/70 p-2 rounded-lg">
                  <span>Automated Split: Vendor Payout 90% | Platform 10%</span>
                  <span>~${platformFee.toFixed(2)} fee</span>
                </div>
                <div className="flex justify-between text-slate-900 text-base font-extrabold pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutSubmit}
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Payment Split...</span>
                ) : (
                  <>
                    <span>Confirm & Pay ${finalTotal.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

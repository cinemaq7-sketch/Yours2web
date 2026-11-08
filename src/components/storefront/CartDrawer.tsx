import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { calculateCartTotals, formatCurrency } from '../../utils/storeLogic';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, Truck } from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    currentStore,
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useStore();

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  if (!isCartOpen) return null;

  const totals = calculateCartTotals(cart, discountPercent);
  const freeShippingTarget = 999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingTarget - totals.subtotal);
  const freeShippingProgress = Math.min(100, Math.round((totals.subtotal / freeShippingTarget) * 100));

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = promoCode.trim().toUpperCase();
    if (clean === 'SAVE10' || clean === 'WELCOME10') {
      setDiscountPercent(10);
      setPromoApplied(true);
      setPromoError('');
    } else if (clean === 'FESTIVE20') {
      setDiscountPercent(20);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try SAVE10');
    }
  };

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    onOpenCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="font-semibold text-base text-neutral-900">Your Shopping Bag</h2>
              <span className="text-xs text-neutral-500 font-mono">
                ({cart.reduce((s, i) => s + i.quantity, 0)})
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Free Shipping Progress Indicator */}
            {totals.subtotal > 0 && (
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-neutral-800">
                    <Truck className="w-4 h-4 text-amber-600" />
                    {amountNeededForFreeShipping === 0 ? (
                      <span className="text-emerald-700 font-semibold">
                        🎉 Free shipping unlocked!
                      </span>
                    ) : (
                      <span>
                        Add{' '}
                        <strong className="font-mono">
                          {formatCurrency(amountNeededForFreeShipping, currentStore.currencySymbol)}
                        </strong>{' '}
                        more for Free Express Shipping
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500">
                    {freeShippingProgress}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900">Your bag is empty</h3>
                <p className="text-xs text-neutral-500">
                  Discover handcrafted and curated essentials to add to your order.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-4 py-2 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 divide-y divide-neutral-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-3.5 first:pt-0 flex gap-3.5">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 rounded-lg object-cover bg-neutral-100 shrink-0 border border-neutral-200/60"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                            {item.product.title}
                          </h4>
                          <span className="text-[11px] text-neutral-500">
                            {item.product.category}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                          aria-label={`Remove ${item.product.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-neutral-200 rounded-md">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity - 1)
                            }
                            className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100 font-bold"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-mono font-medium text-neutral-900 min-w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.product.id, item.quantity + 1)
                            }
                            className="px-2 py-0.5 text-xs text-neutral-600 hover:bg-neutral-100 font-bold"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-semibold text-neutral-900 font-mono tabular-nums">
                          {formatCurrency(
                            item.product.price * item.quantity,
                            currentStore.currencySymbol
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-100 bg-neutral-50/50 space-y-4">
              {/* Promo Code input */}
              <form onSubmit={applyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Coupon (e.g. SAVE10)"
                    disabled={promoApplied}
                    className="w-full pl-8 pr-3 py-1.5 text-xs uppercase bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={promoApplied || !promoCode.trim()}
                  className="px-3 py-1.5 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg disabled:opacity-50"
                >
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </form>

              {promoApplied && (
                <div className="flex items-center justify-between text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-200">
                  <span className="flex items-center gap-1 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    Coupon applied ({discountPercent}% OFF)
                  </span>
                  <button
                    onClick={() => {
                      setDiscountPercent(0);
                      setPromoApplied(false);
                      setPromoCode('');
                    }}
                    className="text-[11px] underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {promoError && (
                <div className="text-[11px] text-red-600 font-medium">
                  {promoError}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">
                    {formatCurrency(totals.subtotal, currentStore.currencySymbol)}
                  </span>
                </div>

                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">
                      -{formatCurrency(totals.discount, currentStore.currencySymbol)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="font-mono tabular-nums">
                    {totals.shipping === 0 ? (
                      <span className="text-emerald-700 font-semibold">FREE</span>
                    ) : (
                      formatCurrency(totals.shipping, currentStore.currencySymbol)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes (5% GST)</span>
                  <span className="font-mono tabular-nums">
                    {formatCurrency(totals.tax, currentStore.currencySymbol)}
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-200 flex justify-between text-sm font-bold text-neutral-900">
                  <span>Grand Total</span>
                  <span className="font-mono tabular-nums text-base">
                    {formatCurrency(totals.total, currentStore.currencySymbol)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-neutral-900 hover:bg-neutral-800 text-white shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

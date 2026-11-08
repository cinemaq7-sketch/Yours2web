import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/storeLogic';
import { X, ShoppingBag, Check, Shield, Truck, RotateCcw, Star } from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { activeProductModal, setActiveProductModal, addToCart, currentStore } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!activeProductModal) return null;

  const product = activeProductModal;

  const handleAdd = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setActiveProductModal(null);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={() => setActiveProductModal(null)}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-700 flex items-center justify-center shadow-md transition-colors"
            aria-label="Close Product Details"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Product Image */}
            <div className="aspect-square md:aspect-auto w-full bg-neutral-100 relative">
              <img
                src={product.imageUrl}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Product Details & Purchase Module */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Clean unboxed category & rating */}
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <span className="uppercase tracking-wider font-semibold text-neutral-700">
                    {product.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-medium">
                    {product.inStock ? `${product.stockQuantity} in stock` : 'Out of stock'}
                  </span>
                  {product.rating && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-amber-700">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{product.rating}</span>
                        <span className="text-neutral-400">({product.reviewsCount})</span>
                      </span>
                    </>
                  )}
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-neutral-900 leading-snug">
                  {product.title}
                </h2>

                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-neutral-900 font-mono tabular-nums">
                    {formatCurrency(product.price, currentStore.currencySymbol)}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-sm text-neutral-400 line-through font-mono tabular-nums">
                      {formatCurrency(product.compareAtPrice, currentStore.currencySymbol)}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Tags if available */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-neutral-500 flex-wrap">
                    <span className="font-medium text-neutral-700">Highlights:</span>
                    {product.tags.map((t, idx) => (
                      <span key={t}>
                        {t}
                        {idx < product.tags.length - 1 && <span className="ml-2 text-neutral-300">/</span>}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Purchase Controls */}
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-4">
                  <label htmlFor="quantity-selector" className="text-xs font-semibold text-neutral-700">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-sm font-semibold disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span id="quantity-selector" className="px-4 py-1.5 text-xs font-mono font-medium text-neutral-900 min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= product.stockQuantity}
                      onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                      className="px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-sm font-semibold disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  disabled={!product.inStock}
                  onClick={handleAdd}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    !product.inStock
                      ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                      : isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-md active:scale-98'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Your Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        Add to Cart · {formatCurrency(product.price * quantity, currentStore.currencySymbol)}
                      </span>
                    </>
                  )}
                </button>

                {/* Trust Markers */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-neutral-500 border-t border-neutral-100 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-neutral-400" />
                    <span>Free Shipping &gt; ₹999</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Shield className="w-4 h-4 text-neutral-400" />
                    <span>Secure Gateway</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RotateCcw className="w-4 h-4 text-neutral-400" />
                    <span>7-Day Return</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

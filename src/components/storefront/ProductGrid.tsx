import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/store';
import { formatCurrency } from '../../utils/storeLogic';
import { Eye, ShoppingBag, Star, PackageCheck, AlertCircle } from 'lucide-react';

interface ProductGridProps {
  searchQuery: string;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  searchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { currentStore, addToCart, setActiveProductModal } = useStore();
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [addedId, setAddedId] = useState<string | null>(null);

  const theme = currentStore.themeConfig;

  // Filter products by category and search query
  const filtered = currentStore.products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="collection" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Category Filter Controls & Sort Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-neutral-200">
        {/* Interactive Category Segmented Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70'
            }`}
          >
            All Products ({currentStore.products.length})
          </button>
          {currentStore.categories.map((cat) => {
            const count = currentStore.products.filter((p) => p.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/70'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 self-end md:self-auto text-xs text-neutral-600">
          <span className="font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-neutral-100 hover:bg-neutral-200/60 border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            <option value="featured">Featured First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results Count & Active Filters feedback */}
      <div className="py-4 flex items-center justify-between text-xs text-neutral-500">
        <span>
          Showing {sorted.length} {sorted.length === 1 ? 'item' : 'items'}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
      </div>

      {/* Empty State */}
      {sorted.length === 0 && (
        <div className="py-20 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400 mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900">No products found</h3>
          <p className="text-xs text-neutral-500 mt-1 mb-4">
            Try adjusting your search query or switching to another category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
            }}
            className="px-4 py-2 text-xs font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Product Grid: 3-column desktop / 2-column tablet / 1-column mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {sorted.map((product) => {
          const isRecentlyAdded = addedId === product.id;
          return (
            <article
              key={product.id}
              onClick={() => setActiveProductModal(product)}
              className="group cursor-pointer flex flex-col bg-white rounded-xl border border-neutral-200/80 overflow-hidden hover:border-neutral-300 hover:shadow-lg transition-all duration-300"
            >
              {/* Image Container: 65-75% visual weight */}
              <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      const fallback = target.parentElement.querySelector('.image-fallback');
                      if (fallback) fallback.classList.remove('hidden');
                    }
                  }}
                />
                {/* Fallback container if image fails */}
                <div className="image-fallback hidden absolute inset-0 bg-neutral-100 flex flex-col items-center justify-center text-neutral-400 p-4 text-center">
                  <PackageCheck className="w-8 h-8 mb-1 stroke-1" />
                  <span className="text-xs font-medium text-neutral-500">{product.title}</span>
                </div>

                {/* Stock Indicator overlay */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center">
                    <span className="text-xs font-semibold text-neutral-800 tracking-wider uppercase px-3 py-1 bg-white border border-neutral-300 rounded shadow-xs">
                      Sold Out
                    </span>
                  </div>
                )}

                {/* Quick View Button overlay on desktop hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveProductModal(product);
                  }}
                  className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-white/90 hover:bg-white text-neutral-900 rounded-full shadow-md backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Quick view ${product.title}`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Quick View</span>
                </button>
              </div>

              {/* Product Info: Zero-Pill unboxed metadata & clear typography */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  {/* Clean unboxed metadata with separators */}
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="uppercase tracking-wider font-medium text-[11px] text-neutral-600">
                      {product.category}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {product.stockQuantity > 0
                        ? `${product.stockQuantity} in stock`
                        : 'Pre-order'}
                    </span>
                    {product.rating && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-0.5 text-amber-700 font-medium">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500 inline" />
                          <span>{product.rating}</span>
                        </span>
                      </>
                    )}
                  </div>

                  {/* Title in SemiBold */}
                  <h3 className="font-semibold text-base text-neutral-900 group-hover:text-amber-900 transition-colors line-clamp-1">
                    {product.title}
                  </h3>

                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price Baseline and Add to Cart Action */}
                <div className="pt-2 flex items-center justify-between border-t border-neutral-100">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-neutral-900 font-mono tabular-nums">
                      {formatCurrency(product.price, currentStore.currencySymbol)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-xs text-neutral-400 line-through font-mono tabular-nums">
                        {formatCurrency(product.compareAtPrice, currentStore.currencySymbol)}
                      </span>
                    )}
                  </div>

                  <button
                    disabled={!product.inStock}
                    onClick={(e) => handleAddToCart(product, e)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      !product.inStock
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : isRecentlyAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs active:scale-95'
                    }`}
                    aria-label={`Add ${product.title} to cart`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{isRecentlyAdded ? 'Added!' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

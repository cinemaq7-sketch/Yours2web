import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/store';
import { formatCurrency } from '../../utils/storeLogic';
import {
  Plus,
  Edit2,
  Trash2,
  Package,
  X,
  Check,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';

const PRESET_PRODUCT_IMAGES = [
  {
    name: 'Artisanal Tea Jar',
    url: '/src/assets/images/product_artisanal_tea_1794134233535.jpg',
  },
  {
    name: 'Ceramic Tableware & Kettle',
    url: '/src/assets/images/hero_artisan_crafts_1794134231221.jpg',
  },
  {
    name: 'Wireless ANC Headphones',
    url: '/src/assets/images/product_wireless_headphones_1794134231648.jpg',
  },
  {
    name: 'Belgian Linen Shirt',
    url: '/src/assets/images/product_linen_overshirt_1794134233208.jpg',
  },
];

export const AdminProducts: React.FC = () => {
  const { currentStore, addProduct, updateProduct, deleteProduct } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('20');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(PRESET_PRODUCT_IMAGES[0].url);
  const [tags, setTags] = useState('New, Premium');

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setCategory(currentStore.categories[0] || 'General');
    setPrice('999');
    setCompareAtPrice('1299');
    setStockQuantity('25');
    setDescription('');
    setImageUrl(PRESET_PRODUCT_IMAGES[0].url);
    setTags('Handcrafted, Premium');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setCategory(p.category);
    setPrice(p.price.toString());
    setCompareAtPrice(p.compareAtPrice ? p.compareAtPrice.toString() : '');
    setStockQuantity(p.stockQuantity.toString());
    setDescription(p.description);
    setImageUrl(p.imageUrl);
    setTags(p.tags ? p.tags.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numPrice = parseFloat(price) || 0;
    const numCompare = compareAtPrice ? parseFloat(compareAtPrice) : undefined;
    const numStock = parseInt(stockQuantity, 10) || 0;
    const tagsArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title,
        category,
        price: numPrice,
        compareAtPrice: numCompare,
        stockQuantity: numStock,
        inStock: numStock > 0,
        description,
        imageUrl,
        tags: tagsArray,
      });
    } else {
      addProduct({
        title,
        category,
        price: numPrice,
        compareAtPrice: numCompare,
        stockQuantity: numStock,
        inStock: numStock > 0,
        description,
        imageUrl,
        tags: tagsArray,
        featured: true,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900">Products Catalog & Inventory</h2>
          <p className="text-xs text-neutral-500">
            Upload new items, adjust stock counts, pricing, and showcase collections
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-2xs overflow-hidden">
        {currentStore.products.length === 0 ? (
          <div className="p-16 text-center text-xs text-neutral-500 space-y-3">
            <Package className="w-10 h-10 mx-auto text-neutral-400 stroke-1" />
            <p className="font-semibold text-neutral-800 text-sm">No products in your catalog</p>
            <p>Upload your first product to start accepting customer orders online.</p>
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-semibold"
            >
              Add Product Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/70 border-b border-neutral-200/60 text-neutral-600 font-medium">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Selling Price</th>
                  <th className="py-3 px-4">Stock Inventory</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {currentStore.products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover bg-neutral-100 shrink-0 border border-neutral-200/80"
                        />
                        <div>
                          <div className="font-semibold text-neutral-900 line-clamp-1 max-w-xs">
                            {product.title}
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            /{product.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-neutral-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-neutral-900 tabular-nums">
                      {formatCurrency(product.price, currentStore.currencySymbol)}
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="block text-[10px] text-neutral-400 line-through">
                          {formatCurrency(product.compareAtPrice, currentStore.currencySymbol)}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-medium text-neutral-800">
                        {product.stockQuantity} units
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          product.stockQuantity > 5
                            ? 'bg-emerald-50 text-emerald-800'
                            : product.stockQuantity > 0
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-red-50 text-red-800'
                        }`}
                      >
                        {product.stockQuantity > 5
                          ? 'In Stock'
                          : product.stockQuantity > 0
                          ? 'Low Stock'
                          : 'Sold Out'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded"
                          aria-label={`Edit ${product.title}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete product "${product.title}"?`)) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded"
                          aria-label={`Delete ${product.title}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
              <h3 className="font-semibold text-neutral-900 text-sm">
                {editingProduct ? 'Edit Product' : 'Add New Product to Store'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Handcrafted Ceramic Teapot, Organic Coffee Blend"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Tableware, Apparel, Audio"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Selling Price ({currentStore.currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 1499"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Compare at Price (Original Price for discount)
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="e.g. 1999"
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white font-mono"
                  />
                </div>
              </div>

              {/* Photo selector presets or custom URL */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">
                  Product Photography
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {PRESET_PRODUCT_IMAGES.map((img) => (
                    <button
                      key={img.name}
                      type="button"
                      onClick={() => setImageUrl(img.url)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        imageUrl === img.url
                          ? 'border-neutral-900 ring-2 ring-neutral-900/20'
                          : 'border-transparent hover:border-neutral-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {imageUrl === img.url && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-neutral-900 text-white rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Or enter custom image URL"
                  className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe material, dimensions, craftsmanship, usage instructions..."
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Tags / Badges (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Organic, Pure Brass, Handcrafted"
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-xs"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

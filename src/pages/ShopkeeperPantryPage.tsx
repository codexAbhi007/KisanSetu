import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  Store,
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
  TrendingUp,
  Boxes,
  Zap,
  DollarSign,
  Percent,
} from 'lucide-react';
import { ProductEditorModal } from '../components/ProductEditorModal';

export const ShopkeeperPantryPage: React.FC = () => {
  const { products, deleteProduct } = useApp();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'create' | 'edit';
    product: Product | null;
  }>({
    isOpen: false,
    mode: 'create',
    product: null,
  });

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const shopProducts = products.filter((p) => p.sellerType === 'shopkeeper');

  const handleOpenAdd = () => {
    setModalState({ isOpen: true, mode: 'create', product: null });
  };

  const handleOpenEdit = (p: Product) => {
    setModalState({ isOpen: true, mode: 'edit', product: p });
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 font-sans transition-colors">
      {/* Header */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-indigo-900/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-indigo-900/80 dark:bg-indigo-950 text-indigo-200 px-3 py-1 rounded-full text-xs font-mono font-bold border border-indigo-700 dark:border-indigo-600">
              <Store className="w-4 h-4 text-amber-300" />
              <span>Kirana Store & Neighborhood Retail Pantry</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              My Kirana Store Pantry
            </h1>
            <p className="text-indigo-100 dark:text-indigo-200 text-sm max-w-2xl">
              Add new retail inventory, update purchase vs selling margins, configure 30-minute quick delivery stock, or delete items in real-time.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>+ Add Store Item</span>
          </button>
        </div>
      </section>

      {/* Main Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Active Store Inventory & Margin Tracker</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live products offered to local households for 30-minute home delivery</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full font-bold border border-indigo-200 dark:border-indigo-800">
                {shopProducts.length} Items in Pantry
              </span>
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Item</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-mono uppercase border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-6">Produce / Item</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Stock Available</th>
                  <th className="py-4 px-6">Purchase Price</th>
                  <th className="py-4 px-6">Retail Selling Price</th>
                  <th className="py-4 px-6">Profit Margin</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {shopProducts.map((p) => {
                  const purchase = p.purchasePrice || Math.round(p.pricePerKg * 0.75);
                  const marginAmt = p.pricePerKg - purchase;
                  const marginPct = Math.round((marginAmt / p.pricePerKg) * 100);

                  return (
                    <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{p.name}</p>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">ID: {p.id} • {p.location}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-md font-semibold text-xs border border-slate-200 dark:border-slate-700">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-indigo-700 dark:text-indigo-400 text-sm">
                        {p.quantityAvailableKg} kg
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400 font-medium">₹{purchase} / kg</td>
                      <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white text-sm">₹{p.pricePerKg} / kg</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] uppercase font-mono ${
                            marginPct >= 20
                              ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          +{marginPct}% (₹{marginAmt}/kg)
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/80 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl transition-colors font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                          title="Edit product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setProductToDelete(p)}
                          className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl transition-colors font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Product Editor Modal (Add & Edit) */}
      <ProductEditorModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: 'create', product: null })}
        mode={modalState.mode}
        role="shopkeeper"
        initialProduct={modalState.product}
      />

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-800">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Delete Store Item?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Are you sure you want to remove <strong className="text-slate-900 dark:text-white">"{productToDelete.name}"</strong> from your store pantry? It will be removed from local customer search immediately.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-colors shadow-sm cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

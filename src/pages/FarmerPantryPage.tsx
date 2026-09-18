import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  Sprout,
  Plus,
  Edit3,
  Trash2,
  ShieldCheck,
  DollarSign,
  Boxes,
  ArrowRight,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { ProductEditorModal } from '../components/ProductEditorModal';

export const FarmerPantryPage: React.FC = () => {
  const { products, currentUser, deleteProduct, setActivePage } = useApp();
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

  // Filter products by sellerType === 'farmer'
  const farmerProducts = products.filter((p) => p.sellerType === 'farmer');

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
      <section className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 dark:from-slate-900 dark:via-emerald-950 dark:to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 dark:bg-emerald-900/80 text-emerald-200 px-3 py-1 rounded-full text-xs font-mono font-bold border border-emerald-700 dark:border-emerald-600">
              <Sprout className="w-4 h-4 text-amber-300" />
              <span>Farmer Produce Catalog & Pantry Management</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              My Farm Harvest Pantry
            </h1>
            <p className="text-emerald-100 dark:text-emerald-200 text-sm max-w-2xl">
              Add new crops, update wholesale selling prices with AI market oracles, edit harvest grades, or delete listings directly from your farmer terminal.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="px-6 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>+ Add Produce Listing</span>
          </button>
        </div>
      </section>

      {/* Main Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Active Farm Harvest Inventory</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live listings synchronized with KisanSetu Cloud Marketplace</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-full font-bold border border-emerald-200 dark:border-emerald-800">
                {farmerProducts.length} Listings Active
              </span>
              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-mono uppercase border-b border-slate-200 dark:border-slate-800">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Stock Available</th>
                  <th className="py-4 px-6">Price / kg</th>
                  <th className="py-4 px-6">Quality Grade</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {farmerProducts.map((p) => (
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
                    <td className="py-4 px-6 font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                      {p.quantityAvailableKg.toLocaleString()} kg
                    </td>
                    <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white text-sm">₹{p.pricePerKg}</td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase font-mono">
                        {p.qualityGrade || 'Grade A'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase font-mono">
                        Active & Live
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-colors font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                        title="Edit listing"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setProductToDelete(p)}
                        className="px-3 py-1.5 bg-rose-50 dark:bg-rose-950/80 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl transition-colors font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                        title="Delete listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
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
        role="farmer"
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
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Delete Produce Listing?</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Are you sure you want to remove <strong className="text-slate-900 dark:text-white">"{productToDelete.name}"</strong> from your farm pantry? This listing will be immediately deleted from the marketplace.
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

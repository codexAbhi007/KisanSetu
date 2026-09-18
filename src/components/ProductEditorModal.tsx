import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import {
  X,
  Sprout,
  Store,
  Sparkles,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Image as ImageIcon,
  HelpCircle,
  ArrowRight,
  Percent,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface ProductEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  role: 'farmer' | 'shopkeeper';
  initialProduct?: Product | null;
}

const PRODUCE_IMAGE_PRESETS = [
  {
    name: 'Fresh Tomatoes',
    url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    category: 'Vegetables' as ProductCategory,
  },
  {
    name: 'Nashik Red Onions',
    url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
    category: 'Vegetables' as ProductCategory,
  },
  {
    name: 'Green Capsicum',
    url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
    category: 'Vegetables' as ProductCategory,
  },
  {
    name: 'Fresh Spinach / Palak',
    url: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    category: 'Vegetables' as ProductCategory,
  },
  {
    name: 'Alphonso Mangoes',
    url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80',
    category: 'Fruits' as ProductCategory,
  },
  {
    name: 'Shimla Royal Apples',
    url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    category: 'Fruits' as ProductCategory,
  },
  {
    name: 'Sharbati Wheat',
    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    category: 'Grains' as ProductCategory,
  },
  {
    name: 'Organic Turmeric',
    url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    category: 'Spices' as ProductCategory,
  },
  {
    name: 'Farm Fresh Milk & Dairy',
    url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    category: 'Dairy' as ProductCategory,
  },
];

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  isOpen,
  onClose,
  mode,
  role,
  initialProduct,
}) => {
  const { addProduct, updateProduct, currentUser, showToast } = useApp();

  const isBulkEnabled = currentUser?.enableBulkQuantity !== false;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Vegetables');
  const [pricePerKg, setPricePerKg] = useState<number>(30);
  const [purchasePrice, setPurchasePrice] = useState<number>(22);
  const [quantityAvailableKg, setQuantityAvailableKg] = useState<number>(500);
  const [minOrderKg, setMinOrderKg] = useState<number>(5);
  const [qualityGrade, setQualityGrade] = useState<'Grade A' | 'Grade B' | 'Grade C'>('Grade A');
  const [farmingMethod, setFarmingMethod] = useState<
    'Organic' | 'Traditional' | 'Good Agricultural Practices (GAP)'
  >('Good Agricultural Practices (GAP)');
  const [location, setLocation] = useState('Nashik, Maharashtra');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
  );
  const [customImageMode, setCustomImageMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate state when opening or when initialProduct changes
  useEffect(() => {
    if (initialProduct && mode === 'edit') {
      setName(initialProduct.name || '');
      setCategory(initialProduct.category || 'Vegetables');
      setPricePerKg(initialProduct.pricePerKg || 30);
      setPurchasePrice(
        initialProduct.purchasePrice || Math.round(initialProduct.pricePerKg * 0.75)
      );
      setQuantityAvailableKg(initialProduct.quantityAvailableKg || 100);
      setMinOrderKg(initialProduct.minOrderKg || (role === 'farmer' ? 20 : 1));
      setQualityGrade(initialProduct.qualityGrade || 'Grade A');
      setFarmingMethod(
        initialProduct.farmingMethod || 'Good Agricultural Practices (GAP)'
      );
      setLocation(initialProduct.location || (role === 'farmer' ? 'Nashik, Maharashtra' : 'Local Kirana Store'));
      setDescription(initialProduct.description || '');
      setImage(
        initialProduct.image ||
          'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80'
      );
    } else {
      // Default creation state based on role
      if (role === 'farmer') {
        setName('');
        setCategory('Vegetables');
        setPricePerKg(28);
        setQuantityAvailableKg(1000);
        setMinOrderKg(50);
        setQualityGrade('Grade A');
        setFarmingMethod('Good Agricultural Practices (GAP)');
        setLocation(
          currentUser?.location?.villageOrCity
            ? `${currentUser.location.villageOrCity}, ${currentUser.location.state}`
            : 'Nashik Mandi, Maharashtra'
        );
        setDescription('Harvested fresh with APMC quality verification.');
        setImage(PRODUCE_IMAGE_PRESETS[0].url);
      } else {
        setName('');
        setCategory('Fresh Produce');
        setPricePerKg(38);
        setPurchasePrice(28);
        setQuantityAvailableKg(200);
        setMinOrderKg(1);
        setQualityGrade('Grade A');
        setLocation(
          currentUser?.location?.villageOrCity
            ? `${currentUser.location.villageOrCity} Retail Mart`
            : 'Kolkata Kirana Store'
        );
        setDescription('Freshly procured from FPO network. 30-min express home delivery available.');
        setImage(PRODUCE_IMAGE_PRESETS[0].url);
      }
    }
  }, [initialProduct, mode, role, isOpen, currentUser]);

  if (!isOpen) return null;

  // Calculated profit margin for shopkeepers
  const profitPerKg = pricePerKg - purchasePrice;
  const profitMarginPercent = pricePerKg > 0 ? Math.round((profitPerKg / pricePerKg) * 100) : 0;

  // AI recommended price range for farmers
  const aiSuggestedMin = Math.round(pricePerKg * 0.92);
  const aiSuggestedMax = Math.round(pricePerKg * 1.12);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a valid product name');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'edit' && initialProduct) {
        const updatedProduct: Product = {
          ...initialProduct,
          name: name.trim(),
          category,
          pricePerKg: Number(pricePerKg),
          purchasePrice: role === 'shopkeeper' ? Number(purchasePrice) : undefined,
          quantityAvailableKg: Number(quantityAvailableKg),
          minOrderKg: isBulkEnabled ? Number(minOrderKg) : 1,
          qualityGrade,
          farmingMethod,
          location,
          description: description.trim() || 'High-quality agricultural listing on KisanSetu.',
          image,
          aiSuggestedPriceMin: aiSuggestedMin,
          aiSuggestedPriceMax: aiSuggestedMax,
        };
        await updateProduct(updatedProduct);
      } else {
        await addProduct({
          name: name.trim(),
          category,
          pricePerKg: Number(pricePerKg),
          purchasePrice: role === 'shopkeeper' ? Number(purchasePrice) : undefined,
          quantityAvailableKg: Number(quantityAvailableKg),
          minOrderKg: isBulkEnabled ? Number(minOrderKg) : 1,
          harvestDate: new Date().toISOString().split('T')[0],
          qualityGrade,
          farmingMethod,
          expectedDeliveryDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
          location,
          description: description.trim() || (role === 'farmer' ? 'Fresh harvest direct from verified farm.' : 'Fresh retail stock available for fast local delivery.'),
          image,
          aiSuggestedPriceMin: aiSuggestedMin,
          aiSuggestedPriceMax: aiSuggestedMax,
        });
      }
      onClose();
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 font-sans overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative space-y-6 my-8 max-h-[92vh] overflow-y-auto transition-colors">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
            {role === 'farmer' ? (
              <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Farmer Harvest Listing</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-full">
                <Store className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Kirana Store Inventory</span>
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {mode === 'edit'
              ? role === 'farmer'
                ? 'Edit Farm Produce Listing'
                : 'Edit Store Inventory Item'
              : role === 'farmer'
              ? 'List New Harvest on KisanSetu'
              : 'Add New Retail Produce to Store'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {role === 'farmer'
              ? 'Publish your harvest directly to local kiranas, supermarkets, and consumer buyers with AI fair pricing.'
              : 'Update your neighborhood store pantry, set purchase vs retail prices, and manage 30-min express stock.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* 1. Item Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Produce / Item Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  role === 'farmer'
                    ? 'e.g. Fresh Organic Tomatoes (Grade A)'
                    : 'e.g. Nashik Red Onions (Premium Kirana Pack)'
                }
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-emerald-600 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Grains">Foodgrains & Atta</option>
                <option value="Pulses">Dals & Pulses</option>
                <option value="Spices">Spices & Turmeric</option>
                <option value="Dairy">Dairy & Ghee</option>
                <option value="Organic">Certified Organic</option>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Staples">Staples</option>
              </select>
            </div>
          </div>

          {/* 2. Pricing & Quantities */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Price & Stock Configuration</span>
              </span>

              {role === 'shopkeeper' && (
                <div
                  className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                    profitMarginPercent >= 20
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : profitMarginPercent > 0
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  Margin: {profitMarginPercent}% (+₹{profitPerKg}/kg profit)
                </div>
              )}

              {role === 'farmer' && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Benchmark: ₹{aiSuggestedMin} - ₹{aiSuggestedMax}/kg</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {role === 'shopkeeper' && (
                <div className="space-y-1">
                  <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                    Purchase / Wholesale (₹/kg)
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                  {role === 'farmer' ? 'Selling Price (₹/kg)' : 'Retail Price (₹/kg)'}{' '}
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-extrabold text-emerald-700 dark:text-emerald-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                  Available Stock (kg) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={quantityAvailableKg}
                  onChange={(e) => setQuantityAvailableKg(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px] flex items-center justify-between">
                  <span>Min Order Qty (kg)</span>
                  {isBulkEnabled ? (
                    <span className="text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-1.5 py-0.2 rounded">
                      Bulk MOQ
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-400 font-normal">
                      Retail (1 kg)
                    </span>
                  )}
                </label>
                {isBulkEnabled ? (
                  <input
                    type="number"
                    min={1}
                    required
                    value={minOrderKg}
                    onChange={(e) => setMinOrderKg(Number(e.target.value))}
                    placeholder="e.g. 5, 20, 100"
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white"
                  />
                ) : (
                  <input
                    type="number"
                    readOnly
                    value={1}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 font-bold text-slate-500 dark:text-slate-400 cursor-not-allowed"
                    title="Retail listing fixed at 1 kg. Enable Bulk Quantity in Settings to specify custom wholesale minimum order sizes."
                  />
                )}
              </div>
            </div>
          </div>

          {/* 3. Quality, Methods & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Quality Grade
              </label>
              <select
                value={qualityGrade}
                onChange={(e) =>
                  setQualityGrade(e.target.value as 'Grade A' | 'Grade B' | 'Grade C')
                }
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              >
                <option value="Grade A">Grade A (Premium Export Quality)</option>
                <option value="Grade B">Grade B (Standard Market Grade)</option>
                <option value="Grade C">Grade C (Processing & Bulk Lot)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Farming Practice
              </label>
              <select
                value={farmingMethod}
                onChange={(e) =>
                  setFarmingMethod(
                    e.target.value as
                      | 'Organic'
                      | 'Traditional'
                      | 'Good Agricultural Practices (GAP)'
                  )
                }
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              >
                <option value="Good Agricultural Practices (GAP)">
                  Good Agricultural Practices (GAP)
                </option>
                <option value="Organic">100% Certified Organic</option>
                <option value="Traditional">Traditional Cultivation</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Location / Mandi Hub
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Nashik, Maharashtra"
                className="w-full px-3.5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>
          </div>

          {/* 4. Product Image Selection (Presets + Custom URL) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Product Image
              </label>
              <button
                type="button"
                onClick={() => setCustomImageMode(!customImageMode)}
                className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-bold text-[11px] underline cursor-pointer"
              >
                {customImageMode ? '← Pick from Image Presets' : 'Enter Custom Image URL'}
              </button>
            </div>

            {customImageMode ? (
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
              />
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRODUCE_IMAGE_PRESETS.map((preset) => (
                  <div
                    key={preset.name}
                    onClick={() => setImage(preset.url)}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-square group ${
                      image === preset.url
                        ? 'border-emerald-600 ring-2 ring-emerald-500/50 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 p-1 text-[9px] font-bold text-white text-center truncate">
                      {preset.name}
                    </div>
                    {image === preset.url && (
                      <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. Description */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Description & Harvest Highlights
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail freshness, packaging, sugar content/brix, moisture levels or storage advice..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 resize-none font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3.5 rounded-xl text-white font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition-all cursor-pointer ${
                role === 'farmer'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-700/20'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-700/20'
              }`}
            >
              <span>
                {mode === 'edit'
                  ? 'Save Changes to Cloud'
                  : role === 'farmer'
                  ? 'Publish Produce to Marketplace'
                  : 'Save Item to Store Inventory'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

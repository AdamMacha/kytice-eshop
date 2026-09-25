"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Product } from "@/types/product";
import {
  toggleProductStockAction,
  upsertProductAction,
  uploadProductImageAction
} from "@/actions/admin-products";
import { Button } from "@/components/ui/button";
import { formatCZKFromWhole } from "@/lib/format";
import { CheckCircle2, Wine, Edit2, Plus, X } from "lucide-react";

function ProductFormModal({
  product,
  onClose,
  onSave
}: {
  product?: Product | null;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: "",
      subtitle: "",
      description: "",
      price: 0,
      image: "",
      containsAlcohol: true,
      alcoholDetails: "",
      color: "#C88D9A",
      inStock: true
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      finalValue = Number(value);
    }
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    
    const res = await uploadProductImageAction(form);
    if (res.success && res.url) {
      setFormData(prev => ({ ...prev, image: res.url }));
    } else {
      setError(res.error || "Chyba nahrávání obrázku.");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const res = await upsertProductAction(formData);
    if (res.success && res.slug) {
      onSave({ ...formData, slug: res.slug, priceHalere: formData.price! * 100 } as Product);
    } else {
      setError(res.error || "Chyba při ukládání.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-xl flex flex-col my-8 max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
          <h2 className="text-xl font-serif font-bold text-[#4A3A31]">
            {product ? "Upravit květinu" : "Přidat novou květinu"}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-50 rounded-lg">
              {error}
            </div>
          )}
          <form id="productForm" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Název</label>
                <input required type="text" name="name" value={formData.name || ""} onChange={handleChange} className="w-full p-2 border rounded-xl text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Podtitulek</label>
                <input required type="text" name="subtitle" value={formData.subtitle || ""} onChange={handleChange} className="w-full p-2 border rounded-xl text-sm" />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Popis</label>
              <textarea required name="description" value={formData.description || ""} onChange={handleChange} rows={3} className="w-full p-2 border rounded-xl text-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Cena (Kč)</label>
                <input required type="number" name="price" value={formData.price || 0} onChange={handleChange} className="w-full p-2 border rounded-xl text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Barva (Hex)</label>
                <div className="flex gap-2">
                  <input type="color" name="color" value={formData.color || "#C88D9A"} onChange={handleChange} className="h-9 w-9 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" name="color" value={formData.color || "#C88D9A"} onChange={handleChange} className="flex-1 p-2 border rounded-xl text-sm uppercase" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4 border-gray-100">
               <div className="space-y-2">
                 <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
                   <input type="checkbox" name="containsAlcohol" checked={formData.containsAlcohol || false} onChange={handleChange} className="rounded" />
                   Obsahuje alkohol
                 </label>
                 {formData.containsAlcohol && (
                   <input type="text" name="alcoholDetails" value={formData.alcoholDetails || ""} onChange={handleChange} placeholder="Např. Obsahuje bílé víno" className="w-full p-2 border rounded-xl text-sm" />
                 )}
               </div>
               <div className="space-y-2">
                 <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer">
                   <input type="checkbox" name="inStock" checked={formData.inStock || false} onChange={handleChange} className="rounded" />
                   Dostupné skladem
                 </label>
               </div>
            </div>

            <div className="border-t pt-4 border-gray-100 space-y-2">
              <label className="text-xs font-bold text-gray-700">Fotografie</label>
              <div className="flex items-center gap-4">
                {formData.image && (
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden bg-gray-100 border shrink-0">
                    <Image src={formData.image} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input type="text" name="image" value={formData.image || ""} onChange={handleChange} placeholder="URL obrázku (nebo nahrajte pomocí tlačítka níže)" className="w-full p-2 border rounded-xl text-sm" />
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs w-full" />
                </div>
              </div>
            </div>

          </form>
        </div>
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2 rounded-b-3xl sticky bottom-0 z-10">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Zrušit
          </Button>
          <Button form="productForm" type="submit" variant="primary" isLoading={loading}>
            Uložit květinu
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProductManagerClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleToggleStock = async (slug: string, currentStock: boolean) => {
    setLoadingSlug(slug);
    const newStock = !currentStock;
    const res = await toggleProductStockAction(slug, newStock);
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.slug === slug ? { ...p, inStock: newStock } : p))
      );
      setFeedback(`Dostupnost pro "${slug}" byla upravena.`);
      setTimeout(() => setFeedback(null), 3000);
    }
    setLoadingSlug(null);
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    setProducts((prev) => {
      const exists = prev.find(p => p.slug === updatedProduct.slug);
      if (exists) {
        return prev.map(p => p.slug === updatedProduct.slug ? updatedProduct : p);
      }
      return [...prev, updatedProduct];
    });
    setEditingProduct(null);
    setIsAddingNew(false);
    setFeedback(`Květina "${updatedProduct.name}" byla úspěšně uložena.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {feedback ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fade-in flex-1 mr-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
        ) : <div className="flex-1" />}
        
        <Button variant="gold" onClick={() => setIsAddingNew(true)} className="shrink-0 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Přidat novou květinu
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.slug}
            className={`p-6 bg-white rounded-3xl border shadow-xs flex flex-col justify-between space-y-5 transition relative ${
              product.inStock
                ? "border-[#E8D9CE]"
                : "border-gray-200 opacity-60 bg-gray-50"
            }`}
          >
            <button 
              onClick={() => setEditingProduct(product)}
              className="absolute top-8 right-8 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow hover:bg-gray-50 transition"
              title="Upravit květinu"
            >
              <Edit2 className="w-4 h-4 text-[#A87938]" />
            </button>

            <div className="space-y-4">
              {/* Image & Stock Badge */}
              <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-[#F3E7DF]">
                <Image
                  src={product.image || "/products/pink-edition.png"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <span
                  className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs ${
                    product.inStock
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.inStock ? "Aktivní v prodeji" : "Nedostupné"}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#A87938]">
                  {product.subtitle}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#4A3A31]">
                  {product.name}
                </h3>
                <p className="text-xs text-[#7D6B62] mt-1 line-clamp-2">
                  {product.description}
                </p>
              </div>

              {/* Alcohol info */}
              {product.containsAlcohol && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#B76E00] bg-[#FFF4E5] p-2 rounded-xl">
                  <Wine className="w-3.5 h-3.5 shrink-0" />
                  <span>{product.alcoholDetails}</span>
                </div>
              )}
            </div>

            {/* Price Edit & Stock Toggle */}
            <div className="space-y-3 pt-4 border-t border-[#F0E4DC]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#7D6B62]">Cena v e-shopu:</span>
                <span className="font-bold text-base text-[#4A3A31]">
                  {formatCZKFromWhole(product.price)}
                </span>
              </div>

              <Button
                variant={product.inStock ? "outline" : "primary"}
                size="sm"
                onClick={() =>
                  handleToggleStock(product.slug, product.inStock)
                }
                isLoading={loadingSlug === product.slug}
                className="w-full text-xs"
              >
                {product.inStock
                  ? "Označit jako nedostupné"
                  : "Aktivovat prodej kytice"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {(editingProduct || isAddingNew) && (
        <ProductFormModal 
          product={editingProduct} 
          onClose={() => { setEditingProduct(null); setIsAddingNew(false); }} 
          onSave={handleSaveProduct} 
        />
      )}
    </div>
  );
}

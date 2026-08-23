"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Product } from "@/types/product";
import {
  toggleProductStockAction,
  updateProductPriceAction,
} from "@/actions/admin-products";
import { Button } from "@/components/ui/button";
import { formatCZKFromWhole } from "@/lib/format";
import { CheckCircle2, AlertCircle, Wine, Sparkles } from "lucide-react";

export function ProductManagerClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editingPriceSlug, setEditingPriceSlug] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<string>("");
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

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

  const handleSavePrice = async (slug: string) => {
    const numPrice = parseInt(tempPrice, 10);
    if (isNaN(numPrice) || numPrice <= 0) return;

    setLoadingSlug(slug);
    const res = await updateProductPriceAction(slug, numPrice);
    if (res.success) {
      setProducts((prev) =>
        prev.map((p) =>
          p.slug === slug
            ? { ...p, price: numPrice, priceHalere: numPrice * 100 }
            : p
        )
      );
      setEditingPriceSlug(null);
      setFeedback(`Cena pro "${slug}" byla změněna na ${numPrice} Kč.`);
      setTimeout(() => setFeedback(null), 3000);
    }
    setLoadingSlug(null);
  };

  return (
    <div className="space-y-6">
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.slug}
            className={`p-6 bg-white rounded-3xl border shadow-xs flex flex-col justify-between space-y-5 transition ${
              product.inStock
                ? "border-[#E8D9CE]"
                : "border-gray-200 opacity-60 bg-gray-50"
            }`}
          >
            <div className="space-y-4">
              {/* Image & Stock Badge */}
              <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-[#F3E7DF]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <span
                  className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs ${
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
              <div className="flex items-center gap-1.5 text-[11px] text-[#B76E00] bg-[#FFF4E5] p-2 rounded-xl">
                <Wine className="w-3.5 h-3.5 shrink-0" />
                <span>{product.alcoholDetails}</span>
              </div>
            </div>

            {/* Price Edit & Stock Toggle */}
            <div className="space-y-3 pt-4 border-t border-[#F0E4DC]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#7D6B62]">Cena v e-shopu:</span>
                {editingPriceSlug === product.slug ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={tempPrice}
                      onChange={(e) => setTempPrice(e.target.value)}
                      className="w-20 px-2 py-1 text-xs border border-[#C88D9A] rounded-lg text-right font-bold"
                    />
                    <button
                      onClick={() => handleSavePrice(product.slug)}
                      className="px-2 py-1 bg-[#C88D9A] text-white rounded-lg text-xs font-bold"
                    >
                      Uložit
                    </button>
                    <button
                      onClick={() => setEditingPriceSlug(null)}
                      className="px-1.5 py-1 text-xs text-[#7D6B62]"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[#4A3A31]">
                      {formatCZKFromWhole(product.price)}
                    </span>
                    <button
                      onClick={() => {
                        setEditingPriceSlug(product.slug);
                        setTempPrice(String(product.price));
                      }}
                      className="text-[11px] text-[#C88D9A] hover:underline font-semibold"
                    >
                      Upravit
                    </button>
                  </div>
                )}
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
    </div>
  );
}

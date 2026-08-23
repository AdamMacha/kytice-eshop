import React from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductGrid } from "@/components/product/product-grid";
import { Wine, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Nabídka sladkých kytic",
  description:
    "Prohlédněte si naši nabídku ručně tvořených sladkých kytic s prémiovými čokoládami a alkoholem.",
};

export default async function ProductsPage() {
  const products = await db.product.findMany({
    where: { inStock: true },
    orderBy: { createdAt: "asc" },
  });
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E8D9CE] text-xs font-semibold text-[#A87938]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kompletní nabídka</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#4A3A31]">
          Originální sladké kytice
        </h1>
        <p className="text-sm text-[#7D6B62] leading-relaxed">
          Každá kytice v sobě ukrývá kombinaci kvalitních čokolád, ručně
          vázaných ozdob a vybraného alkoholu. Kytice vám také rádi upravíme na
          míru na přání.
        </p>
      </div>

      {/* Alcohol compliance note */}
      <div className="p-4 rounded-2xl bg-[#FFF4E5] border border-[#FFE0B2] text-center max-w-3xl mx-auto flex items-center justify-center gap-2 text-xs text-[#B76E00]">
        <Wine className="w-4 h-4 shrink-0" />
        <span>
          <strong>Upozornění:</strong> Všechny naše kytice obsahují alkohol a
          jsou určeny výhradně osobám starším 18 let.
        </span>
      </div>

      {/* Grid */}
      <ProductGrid products={products} />
    </div>
  );
}

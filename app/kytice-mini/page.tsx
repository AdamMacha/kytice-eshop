import React from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductGrid } from "@/components/product/product-grid";
import { Wine, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Nabídka Kytic mini | MoodBox Bloom",
  description:
    "Prohlédněte si naši nabídku ručně tvořených sladkých Kytic mini s prémiovými čokoládami a alkoholem.",
};

export default async function MiniBouquetsPage() {
  const productsData = await db.product.findMany({
    where: { inStock: true, category: "MINI_BOUQUET" },
    orderBy: { createdAt: "asc" },
  });
  const products = productsData as unknown as import("@/types/product").Product[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E8D9CE] text-xs font-semibold text-[#A87938]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kompaktní edice</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#4A3A31]">
          Originální Kytice mini
        </h1>
        <p className="text-sm text-[#7D6B62] leading-relaxed">
          Menší, ale stejně kouzelné. Kytice mini jsou ideální pozorností pro každou příležitost –
          kombinují vybrané čokolády, kvalitní alkohol a ručně vázané aranžmá v kompaktním provedení.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4 bg-white rounded-3xl border border-[#E8D9CE] shadow-sm max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#F9ECEF] flex items-center justify-center text-[#C88D9A] mb-2">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#4A3A31]">
            Nové mini kytice pro vás právě připravujeme
          </h2>
          <p className="text-[#7D6B62] max-w-lg">
            Připravujeme pro vás nabídku menších sladkých kytic.
            První kousky do této sekce přidáme již brzy!
          </p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

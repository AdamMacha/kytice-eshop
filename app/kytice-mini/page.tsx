import React from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductGrid } from "@/components/product/product-grid";
import { Wine, Sparkles, Heart, Gift, Truck } from "lucide-react";
import { getBreadcrumbSchema, getItemListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Kytice mini – Kompaktní sladké kytice",
  description:
    "Prohlédněte si naši nabídku ručně tvořených sladkých Kytic mini s prémiovými čokoládami a vybraným alkoholem. Elegantní a kompaktní dárek pro každou příležitost.",
  alternates: {
    canonical: "/kytice-mini",
  },
  openGraph: {
    title: "Kytice mini – Kompaktní sladké kytice | MoodBox Bloom",
    description:
      "Menší, ale stejně kouzelné. Kytice mini spojují kvalitní čokolády, alkohol a ručně vázané aranžmá v kompaktním provedení.",
    url: "/kytice-mini",
  },
};

export default async function MiniBouquetsPage() {
  const productsData = await db.product.findMany({
    where: { inStock: true, category: "MINI_BOUQUET" },
    orderBy: { createdAt: "asc" },
  });
  const products = productsData as unknown as import("@/types/product").Product[];

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Domů", url: "/" },
    { name: "Kytice mini", url: "/kytice-mini" },
  ]);

  const itemListSchema = getItemListSchema(
    products.map((p) => ({
      name: p.name,
      slug: p.slug,
      image: p.image,
      price: p.price,
    })),
    "Katalog Kytic mini MoodBox Bloom",
    "/kytice-mini"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Schema.org Breadcrumbs & ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbsSchema, itemListSchema]),
        }}
      />

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

      {/* SEO Content Section */}
      <section className="pt-12 border-t border-[#E8D9CE] space-y-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#4A3A31]">
            Kdy zvolit Kytici mini?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#7D6B62] leading-relaxed">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#4A3A31] text-sm">
                <Gift className="w-4 h-4 text-[#C88D9A]" />
                <span>Kompaktní milá pozornost</span>
              </div>
              <p>
                Hledáte drobný, ale výjimečný dárek pro kolegyni, kamarádku nebo
                paní učitelku? Kytice mini nabízí stejnou eleganci a prémiové
                ingredience v praktické velikosti.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#4A3A31] text-sm">
                <Heart className="w-4 h-4 text-[#C88D9A]" />
                <span>Ruční práce v každém detailu</span>
              </div>
              <p>
                I přes menší rozměry věnujeme každé mini kytici stejnou lásku a
                preciznost jako velkým formátům. Každá ozdoba je ručně vázaná a
                sladěná.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#4A3A31] text-sm">
                <Truck className="w-4 h-4 text-[#C88D9A]" />
                <span>Rozvoz Praha zdarma & Zásilkovna</span>
              </div>
              <p>
                Stejně jako u ostatních produktů platí bezplatné doručení po celé
                Praze nebo spolehlivé odeslání přes síť Zásilkovny po celé ČR.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

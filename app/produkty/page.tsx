import React from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductGrid } from "@/components/product/product-grid";
import { Wine, Sparkles, Heart, Gift, Truck } from "lucide-react";
import { getBreadcrumbSchema, getItemListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Sladké čokokytice s alkoholem a prémiovou čokoládou",
  description:
    "Prohlédněte si naši kompletní nabídku ručně vázaných sladkých kytic s prémiovými čokoládami, šumivým vínem a alkoholem. Osobní rozvoz po Praze zdarma a doručení po celé ČR.",
  alternates: {
    canonical: "/produkty",
  },
  openGraph: {
    title: "Sladké čokokytice s alkoholem a prémiovou čokoládou | MoodBox Bloom",
    description:
      "Ručně vázané čokokytice pro každou příležitost. Šumivé víno, prvotřídní čokolády a doručení po Praze zdarma.",
    url: "/produkty",
  },
};

export default async function ProductsPage() {
  const productsData = await db.product.findMany({
    where: { inStock: true, category: "BOUQUET" },
    orderBy: { createdAt: "asc" },
  });
  const products = productsData as unknown as import("@/types/product").Product[];

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Domů", url: "/" },
    { name: "Sladké kytice", url: "/produkty" },
  ]);

  const itemListSchema = getItemListSchema(
    products.map((p) => ({
      name: p.name,
      slug: p.slug,
      image: p.image,
      price: p.price,
    })),
    "Katalog sladkých kytic MoodBox Bloom",
    "/produkty"
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
          <span>Kompletní nabídka čokokytic</span>
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

      {/* SEO Content Section at Bottom of Catalog */}
      <section className="pt-12 border-t border-[#E8D9CE] space-y-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#4A3A31]">
            Proč zvolit sladkou kytici jako originální dárek?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#7D6B62] leading-relaxed">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#4A3A31] text-sm">
                <Gift className="w-4 h-4 text-[#C88D9A]" />
                <span>Dárek, který překvapí</span>
              </div>
              <p>
                Běžné řezané květiny po pár dnech uvadnou. Sladká kytice z
                čokolády a kvalitního alkoholu vydrží dlouhé měsíce a spojuje
                krásu luxusního květinového aranžmá s požitkem z lahodných
                cukrovinek.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#4A3A31] text-sm">
                <Heart className="w-4 h-4 text-[#C88D9A]" />
                <span>100% ruční tvorba v Praze</span>
              </div>
              <p>
                Každou kytici osobně tvoříme s láskou a maximální pečlivostí.
                Dbáme na každý detail balení, výběr stuh i harmonii barev, aby
                dárek zanechal nezapomenutelný dojem.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#4A3A31] text-sm">
                <Truck className="w-4 h-4 text-[#C88D9A]" />
                <span>Doprava zdarma v Praze</span>
              </div>
              <p>
                Po celé Praze kytici doručíme osobně a zcela zdarma až ke dveřím
                obdarovaného. Do ostatních koutů ČR odesíláme pečlivě zabalené
                prostřednictvím Zásilkovny.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

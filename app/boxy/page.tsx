import React from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductGrid } from "@/components/product/product-grid";
import { Wine, Sparkles, Heart, Gift, Truck } from "lucide-react";
import { getBreadcrumbSchema, getItemListSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Dárkové boxy s prémiovou čokoládou a alkoholem",
  description:
    "Prohlédněte si naši nabídku ručně tvořených dárkových boxů s prémiovými čokoládami a kvalitním alkoholem. Luxusní dárková balení pro ženy i muže s doručením po celé ČR.",
  alternates: {
    canonical: "/boxy",
  },
  openGraph: {
    title: "Dárkové boxy s prémiovou čokoládou a alkoholem | MoodBox Bloom",
    description:
      "Originální ručně aranžované dárkové boxy. Prémiový alkohol, čokolády a dekorace v dárkovém balení. Rozvoz v Praze zdarma.",
    url: "/boxy",
  },
};

export default async function BoxesPage() {
  const productsData = await db.product.findMany({
    where: { inStock: true, category: "BOX" },
    orderBy: { createdAt: "asc" },
  });
  const products = productsData as unknown as import("@/types/product").Product[];

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Domů", url: "/" },
    { name: "Dárkové boxy", url: "/boxy" },
  ]);

  const itemListSchema = getItemListSchema(
    products.map((p) => ({
      name: p.name,
      slug: p.slug,
      image: p.image,
      price: p.price,
    })),
    "Katalog dárkových boxů MoodBox Bloom",
    "/boxy"
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
          <span>Kompletní nabídka</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#4A3A31]">
          Originální dárkové boxy
        </h1>
        <p className="text-sm text-[#7D6B62] leading-relaxed">
          Každý box v sobě ukrývá kombinaci kvalitních čokolád, ručně
          vázaných ozdob a vybraného alkoholu. Boxy vám také rádi upravíme na
          míru na přání.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center space-y-4 bg-white rounded-3xl border border-[#E8D9CE] shadow-sm max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#F9ECEF] flex items-center justify-center text-[#C88D9A] mb-2">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#4A3A31]">
            Nové dárkové boxy pro vás právě připravujeme
          </h2>
          <p className="text-[#7D6B62] max-w-lg">
            Pečlivě pro vás vymýšlíme ty nejlepší kombinace chutí a designu.
            První limitované edice se tu objeví už velmi brzy, určitě se máte na co těšit!
          </p>
        </div>
      ) : (
        <>
          {/* Alcohol compliance note */}
          <div className="p-4 rounded-2xl bg-[#FFF4E5] border border-[#FFE0B2] text-center max-w-3xl mx-auto flex items-center justify-center gap-2 text-xs text-[#B76E00]">
            <Wine className="w-4 h-4 shrink-0" />
            <span>
              <strong>Upozornění:</strong> Všechny naše boxy obsahují alkohol a
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
            Luxusní dárkové boxy s překvapením uvnitř
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#7D6B62] leading-relaxed">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#4A3A31] text-sm">
                <Gift className="w-4 h-4 text-[#C88D9A]" />
                <span>Dokonalé překvapení</span>
              </div>
              <p>
                Dárkový box nabízí elegantní tajemství až do okamžiku otevření.
                Uvnitř se ukrývá bohatá kolekce prémiových sladkostí a vybraných
                lahví alkoholu.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#4A3A31] text-sm">
                <Heart className="w-4 h-4 text-[#C88D9A]" />
                <span>Vhodné pro ženy i muže</span>
              </div>
              <p>
                Díky možnosti volby alkoholu (šumivé víno, kvalitní rum nebo
                bylinný likér) a sladkostí jsou naše dárkové sady ideální jak pro
                dámy, tak pro pány.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#4A3A31] text-sm">
                <Truck className="w-4 h-4 text-[#C88D9A]" />
                <span>Bezpečné zabalení & Rozvoz</span>
              </div>
              <p>
                Každý box je konstruován tak, aby bezpečně přečkal manipulaci i
                přepravu. V Praze rozvážíme zdarma osobně.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

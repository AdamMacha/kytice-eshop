import React from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatCZKFromWhole } from "@/lib/format";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import {
  Sparkles,
  Heart,
  Truck,
  Gift,
  ShieldCheck,
  ArrowRight,
  Wine,
  Star,
} from "lucide-react";

export default async function Home() {
  const products = await db.product.findMany({
    where: { inStock: true },
    orderBy: { createdAt: "asc" },
  });
  
  const pinkEdition = products.find((p) => p.slug === "pink-edition");
  const heroPriceDisplay = pinkEdition ? formatCZKFromWhole(pinkEdition.price) : "999 Kč";

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] hero-glow pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#E8D9CE] shadow-xs text-xs font-semibold text-[#A87938]">
                <Sparkles className="w-4 h-4 text-[#D4AF7F]" />
                <span>Ručně tvořené sladké kytice s alkoholem</span>
              </div>

              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#4A3A31] leading-[1.15]">
                  Originální sladké kytice, které{" "}
                  <span className="italic font-normal text-[#C88D9A]">
                    říkají víc
                  </span>{" "}
                  než slova.
                </h1>
                <p className="text-base sm:text-lg text-[#7D6B62] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Každou kytici tvořím s láskou a pečlivostí tak, aby vyvolala
                  skutečnou emoci – překvapení, radost a úsměv. Spojení lahodné
                  čokolády, šumivého vína a jemných dekorací.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href={ROUTES.products}>
                  <Button variant="gold" size="lg" className="w-full sm:w-auto font-semibold">
                    Vybrat kytici
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <Link href={ROUTES.about}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Náš příběh
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#7D6B62]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C88D9A]" />
                  <span>Doprava po Praze zdarma</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#C88D9A]" />
                  <span>Možnost úpravy na míru</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wine className="w-4 h-4 text-[#C88D9A]" />
                  <span>Prémiový alkohol & čokoláda</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative glow box */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#EBC3CC] via-[#F3E7DF] to-[#D4AF7F] opacity-70 blur-2xl -z-10" />

                <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white">
                  <Image
                    src="/products/pink-edition.png"
                    alt="Pink Edition kytice MoodBox"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {/* Floating badge inside hero card */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E8D9CE] shadow-lg flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#A87938]">
                        Bestseller
                      </span>
                      <h4 className="font-serif font-bold text-base text-[#4A3A31]">
                        Pink Edition
                      </h4>
                      <p className="text-xs text-[#7D6B62]">
                        Se šumivým vínem & Raffaelo
                      </p>
                    </div>
                    <span className="font-bold text-base text-[#C88D9A]">
                      {heroPriceDisplay}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── USPs Section ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white/80 border border-[#E8D9CE]/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F9ECEF] flex items-center justify-center text-[#C88D9A]">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#4A3A31]">
              100% Ruční tvorba
            </h3>
            <p className="text-xs text-[#7D6B62] leading-relaxed">
              Každou kytici připravuji ručně a s láskou. Žádná pásová výroba –
              každý kus je jedinečný originál.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/80 border border-[#E8D9CE]/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FBF6EE] flex items-center justify-center text-[#D4AF7F]">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#4A3A31]">
              Doprava po Praze zdarma
            </h3>
            <p className="text-xs text-[#7D6B62] leading-relaxed">
              Objednávky po celé Praze doručuji osobně a zcela zdarma až k vašim
              dveřím.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/80 border border-[#E8D9CE]/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F9ECEF] flex items-center justify-center text-[#C88D9A]">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#4A3A31]">
              Úprava na přání
            </h3>
            <p className="text-xs text-[#7D6B62] leading-relaxed">
              Máte specifické přání ohledně barev nebo druhu čokolády? Ráda
              kytici přizpůsobím vaší představě.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/80 border border-[#E8D9CE]/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FBF6EE] flex items-center justify-center text-[#D4AF7F]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#4A3A31]">
              Celá ČR přes Zásilkovnu
            </h3>
            <p className="text-xs text-[#7D6B62] leading-relaxed">
              Zásilku bezpečně a dárkově zabalíme a odešleme na jakékoliv výdejní
              místo či přímo na adresu.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Product Catalog Section ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#A87938] font-bold">
            Naše kolekce
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3A31]">
            Vyberte si dokonalou sladkou kytici
          </h2>
          <p className="text-sm text-[#7D6B62]">
            Kytice pro každou příležitost – narozeniny, výročí, vyznání lásky
            nebo jen tak pro radost.
          </p>
        </div>

        <ProductGrid products={products} />
      </section>

      {/* ─── Story / About Highlight ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 lg:p-16 rounded-3xl bg-white border border-[#E8D9CE] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 relative aspect-square rounded-3xl overflow-hidden bg-[#F3E7DF]">
            <Image
              src="/products/golden-elegance.png"
              alt="Kateřina MoodBox tvorba"
              fill
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#A87938] font-bold">
              O značce MoodBox
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3A31] leading-snug">
              Dárky, které mají smysl a vytváří velké momenty.
            </h2>
            <div className="space-y-4 text-sm text-[#7D6B62] leading-relaxed">
              <p>
                Moodbox Bloom vznikl z lásky k tvoření a radosti z dárků, které
                mají smysl. Každou kytici připravuji ručně tak, aby nebyla jen
                hezká na pohled, ale hlavně aby vyvolala emoci – překvapení,
                radost a úsměv.
              </p>
              <p>
                Věřím, že i malý dárek může vytvořit velký moment. A právě
                takové momenty chci tvořit. Každá kytice je originál a může být
                upravena na přání – protože každý člověk i příležitost jsou jiné.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#F0E4DC]">
              <div>
                <p className="font-serif font-bold text-lg text-[#4A3A31]">
                  Kateřina Janovská
                </p>
                <p className="text-xs text-[#C88D9A]">
                  Zakladatelka & Tvůrkyně MoodBox Bloom
                </p>
              </div>
              <Link href={ROUTES.about}>
                <Button variant="outline" size="sm">
                  Číst celý příběh
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it Works ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#A87938] font-bold">
            Jednoduchý proces
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#4A3A31]">
            Jak objednat vaši kytici
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#F9ECEF]/70 border border-[#EBC3CC] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#C88D9A] text-white font-serif font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-[#C88D9A]/30">
              1
            </div>
            <h3 className="font-serif font-bold text-lg text-[#4A3A31]">
              Vyberte si edici
            </h3>
            <p className="text-xs text-[#7D6B62] leading-relaxed">
              Zvolte si barevnou variantu kytice s alkoholem a čokoládami, která
              nejlépe vystihuje obdarovaného.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#FBF6EE]/70 border border-[#E6C89C] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#D4AF7F] text-white font-serif font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-[#D4AF7F]/30">
              2
            </div>
            <h3 className="font-serif font-bold text-lg text-[#4A3A31]">
              Přidejte poznámku
            </h3>
            <p className="text-xs text-[#7D6B62] leading-relaxed">
              V pokladně můžete do poznámky uvést jakékoliv speciální přání na
              úpravu barev či složení.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#F9ECEF]/70 border border-[#EBC3CC] text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#C88D9A] text-white font-serif font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-[#C88D9A]/30">
              3
            </div>
            <h3 className="font-serif font-bold text-lg text-[#4A3A31]">
              Doručíme s láskou
            </h3>
            <p className="text-xs text-[#7D6B62] leading-relaxed">
              Po Praze doručíme zdarma osobně, do ostatních měst bezpečně přes
              Zásilkovnu (3–10 pracovních dní).
            </p>
          </div>
        </div>
      </section>

      {/* ─── Reviews / Love ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#4A3A31] to-[#362720] text-white space-y-8 text-center">
          <div className="flex items-center justify-center gap-1 text-[#D4AF7F]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <blockquote className="font-serif text-xl sm:text-2xl italic max-w-2xl mx-auto leading-relaxed text-[#F3E7DF]">
            &bdquo;Kytice udělala obrovskou radost na výročí! Nádherné balení,
            skvělé dobroty i víno. Vše dorazilo v naprostém pořádku.&ldquo;
          </blockquote>
          <p className="text-xs tracking-wider uppercase text-[#D4AF7F]">
            Ověřený zákazník – MoodBox Bloom
          </p>
        </div>
      </section>
    </div>
  );
}

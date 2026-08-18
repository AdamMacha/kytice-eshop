"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import { formatCZKFromWhole } from "@/lib/format";
import { useCart } from "@/hooks/use-cart";
import { ROUTES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Check,
  Wine,
  Truck,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  Plus,
  Minus,
  ArrowRight,
} from "lucide-react";

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("alcohol");

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push(ROUTES.checkout);
  };

  return (
    <div className="space-y-6">
      {/* Title & Subtitle */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="gold">{product.subtitle}</Badge>
          {product.containsAlcohol && (
            <Badge variant="alcohol" className="flex items-center gap-1">
              <Wine className="w-3 h-3" />
              <span>18+ Alkohol</span>
            </Badge>
          )}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3A31]">
          {product.name}
        </h1>
        <p className="text-2xl sm:text-3xl font-bold text-[#C88D9A] pt-1">
          {formatCZKFromWhole(product.price)}
          <span className="text-xs font-normal text-[#7D6B62] ml-2">
            včetně DPH
          </span>
        </p>
      </div>

      {/* Description */}
      <p className="text-sm text-[#7D6B62] leading-relaxed">
        {product.description}
      </p>

      {/* Alcohol Warning Box */}
      <div className="p-4 rounded-2xl bg-[#FFF4E5] border border-[#FFE0B2] flex items-start gap-3 text-xs text-[#B76E00]">
        <Wine className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">Informace o alkoholu:</p>
          <p>
            {product.alcoholDetails}. Prodej je povolen výhradně osobám starším
            18 let. V košíku a při předání bude vyžadováno potvrzení věku.
          </p>
        </div>
      </div>

      {/* Quantity & CTA Actions */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between sm:justify-start border border-[#E8D9CE] rounded-full p-1 bg-white shadow-xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="p-2.5 rounded-full text-[#4A3A31] hover:bg-[#F3E7DF] disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Snížit množství"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-5 font-bold text-sm text-[#4A3A31]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(10, quantity + 1))}
              disabled={quantity >= 10}
              className="p-2.5 rounded-full text-[#4A3A31] hover:bg-[#F3E7DF] disabled:opacity-30 disabled:cursor-not-allowed transition"
              aria-label="Zvýšit množství"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <Button
            variant={isAdded ? "gold" : "primary"}
            size="lg"
            onClick={handleAddToCart}
            className="flex-1 font-semibold shadow-md"
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Přidáno do košíku!
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5 mr-2" />
                Přidat do košíku ({formatCZKFromWhole(product.price * quantity)})
              </>
            )}
          </Button>
        </div>

        {/* Buy Now Button */}
        <Button
          variant="gold"
          size="lg"
          onClick={handleBuyNow}
          className="w-full font-semibold shadow-lg group"
        >
          Koupit ihned
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>

      {/* Accordion Information */}
      <div className="pt-6 border-t border-[#E8D9CE] space-y-3">
        {/* Accordion 1: Složení & Alkohol */}
        <div className="border border-[#E8D9CE] rounded-2xl overflow-hidden bg-white/80">
          <button
            onClick={() => toggleAccordion("alcohol")}
            className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-[#4A3A31] hover:bg-[#F9ECEF]/50 transition"
          >
            <div className="flex items-center gap-2">
              <Wine className="w-4 h-4 text-[#C88D9A]" />
              <span>Složení a obsah balení</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                openAccordion === "alcohol" ? "rotate-180" : ""
              }`}
            />
          </button>
          {openAccordion === "alcohol" && (
            <div className="p-4 pt-0 text-xs text-[#7D6B62] space-y-2 border-t border-[#F0E4DC] mt-2">
              <p>
                <strong>Balení obsahuje:</strong> {product.description}
              </p>
              <p>
                <strong>Alkoholický nápoj:</strong> {product.alcoholDetails}
              </p>
              <p className="text-[11px] text-[#A87938]">
                Všechny dekorace a kytice jsou vázány ručně. Jednotlivé druhy
                čokolád se mohou mírně lišit dle aktuální dostupnosti při zachování
                stejné či vyšší hodnoty a kvality.
              </p>
            </div>
          )}
        </div>

        {/* Accordion 2: Doprava */}
        <div className="border border-[#E8D9CE] rounded-2xl overflow-hidden bg-white/80">
          <button
            onClick={() => toggleAccordion("shipping")}
            className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-[#4A3A31] hover:bg-[#F9ECEF]/50 transition"
          >
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C88D9A]" />
              <span>Možnosti dopravy & Doba dodání</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                openAccordion === "shipping" ? "rotate-180" : ""
              }`}
            />
          </button>
          {openAccordion === "shipping" && (
            <div className="p-4 pt-0 text-xs text-[#7D6B62] space-y-2.5 border-t border-[#F0E4DC] mt-2">
              <ul className="space-y-1.5 list-disc list-inside">
                <li>
                  <strong className="text-[#4A3A31]">
                    Doprava po Praze zdarma:
                  </strong>{" "}
                  Osobní doručení až ke dveřím.
                </li>
                <li>
                  <strong className="text-[#4A3A31]">
                    Zásilkovna – výdejní místo:
                  </strong>{" "}
                  89 Kč (výběr ze stovek poboček a Z-BOXů po celé ČR).
                </li>
                <li>
                  <strong className="text-[#4A3A31]">
                    Zásilkovna – doručení na adresu:
                  </strong>{" "}
                  129 Kč.
                </li>
              </ul>
              <p className="text-[11px] text-[#A87938]">
                Doba dodání je obvykle 3–10 pracovních dní od potvrzení
                objednávky (v závislosti na ruční výrobě).
              </p>
            </div>
          )}
        </div>

        {/* Accordion 3: Úprava na přání */}
        <div className="border border-[#E8D9CE] rounded-2xl overflow-hidden bg-white/80">
          <button
            onClick={() => toggleAccordion("custom")}
            className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-[#4A3A31] hover:bg-[#F9ECEF]/50 transition"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF7F]" />
              <span>Úprava kytice na míru</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                openAccordion === "custom" ? "rotate-180" : ""
              }`}
            />
          </button>
          {openAccordion === "custom" && (
            <div className="p-4 pt-0 text-xs text-[#7D6B62] space-y-2 border-t border-[#F0E4DC] mt-2">
              <p>
                Každou kytici ráda upravím dle vašeho přání – například jiná
                barevná stuha, preferovaná značka čokolády nebo osobní věnování.
              </p>
              <p>
                Stačí uvést vaše přání do poznámky v pokladně nebo nás kontaktovat
                na emailu{" "}
                <strong className="text-[#4A3A31]">moodboxcz@gmail.cz</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

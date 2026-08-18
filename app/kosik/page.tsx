"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { formatCZK } from "@/lib/format";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Wine,
  Sparkles,
} from "lucide-react";

export default function CartPage() {
  const { items, subtotalHalere, updateQuantity, removeItem, clearCart, totalItems } =
    useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#F9ECEF] text-[#C88D9A] flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#4A3A31]">
            Váš nákupní košík je prázdný
          </h1>
          <p className="text-sm text-[#7D6B62] max-w-md mx-auto">
            Zatím jste si do košíku nic nepřidali. Prohlédněte si naši nabídku
            ručně vázaných kytic s alkoholem a čokoládami.
          </p>
        </div>
        <Link href={ROUTES.products}>
          <Button variant="gold" size="lg" className="font-semibold shadow-lg">
            Prozkoumat nabídku kytic
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8D9CE] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#A87938] font-bold">
            Nákupní košík ({totalItems} {totalItems === 1 ? "položka" : "položek"})
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3A31]">
            Váš výběr kytic
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-[#A4948B] hover:text-red-500 transition flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          <span>Vysypat košík</span>
        </button>
      </div>

      {/* Free delivery banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F9ECEF] to-[#FBF6EE] border border-[#EBC3CC] flex items-center gap-3 text-xs text-[#4A3A31]">
        <div className="w-8 h-8 rounded-full bg-[#C88D9A] text-white flex items-center justify-center shrink-0">
          <Truck className="w-4 h-4" />
        </div>
        <div>
          <strong className="text-[#C88D9A]">Tip:</strong> Doručení po celé
          Praze je u nás vždy <strong>zcela zdarma</strong>! Do ostatních měst ČR
          zasíláme přes Zásilkovnu od 89 Kč.
        </div>
      </div>

      {/* Grid: Cart Items List + Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.product.slug}
              className="p-5 sm:p-6 bg-white rounded-3xl border border-[#E8D9CE] shadow-xs flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
            >
              {/* Product Photo & Title */}
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-[#F3E7DF] shrink-0 border border-[#E8D9CE]/60">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-[#A87938] font-bold">
                    {item.product.subtitle}
                  </span>
                  <Link href={ROUTES.product(item.product.slug)}>
                    <h3 className="font-serif text-lg font-bold text-[#4A3A31] hover:text-[#C88D9A] transition">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#7D6B62]">
                    {item.product.price} Kč / ks
                  </p>
                  {item.product.containsAlcohol && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#B76E00] bg-[#FFF4E5] px-2 py-0.5 rounded-full font-medium">
                      <Wine className="w-3 h-3" />
                      18+ Obsahuje alkohol
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper & Price & Delete */}
              <div className="flex items-center justify-between w-full sm:w-auto sm:gap-8 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F0E4DC]">
                {/* Stepper */}
                <div className="flex items-center border border-[#E8D9CE] rounded-full bg-[#FDFBF7] p-0.5">
                  <button
                    onClick={() =>
                      updateQuantity(item.product.slug, item.quantity - 1)
                    }
                    className="p-2 text-[#4A3A31] hover:text-[#C88D9A] transition rounded-full"
                    aria-label="Snížit množství"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-bold text-xs text-[#4A3A31]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product.slug, item.quantity + 1)
                    }
                    className="p-2 text-[#4A3A31] hover:text-[#C88D9A] transition rounded-full"
                    aria-label="Zvýšit množství"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Total Price */}
                <div className="text-right min-w-[90px]">
                  <span className="text-base font-bold text-[#4A3A31]">
                    {formatCZK(item.product.priceHalere * item.quantity)}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeItem(item.product.slug)}
                  className="p-2 text-[#A4948B] hover:text-red-500 transition rounded-full hover:bg-red-50"
                  aria-label="Odstranit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Continue shopping link */}
          <div className="pt-2">
            <Link
              href={ROUTES.products}
              className="text-xs font-semibold text-[#C88D9A] hover:underline inline-flex items-center gap-1"
            >
              <span>← Pokračovat ve výběru dalších kytic</span>
            </Link>
          </div>
        </div>

        {/* Right: Summary Card */}
        <div className="lg:col-span-4">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8D9CE] shadow-sm space-y-6 sticky top-28">
            <h3 className="font-serif text-xl font-bold text-[#4A3A31]">
              Shrnutí objednávky
            </h3>

            <div className="space-y-3 text-sm text-[#7D6B62]">
              <div className="flex justify-between">
                <span>Cena kytic:</span>
                <span className="font-semibold text-[#4A3A31]">
                  {formatCZK(subtotalHalere)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Doprava po Praze:</span>
                <span className="text-emerald-600 font-semibold">Zdarma</span>
              </div>
              <div className="flex justify-between">
                <span>Zásilkovna ČR:</span>
                <span>od 89 Kč</span>
              </div>

              <div className="pt-4 border-t border-[#F0E4DC] flex justify-between items-baseline">
                <span className="font-serif font-bold text-base text-[#4A3A31]">
                  Mezisoučet:
                </span>
                <span className="text-2xl font-bold text-[#C88D9A]">
                  {formatCZK(subtotalHalere)}
                </span>
              </div>
              <p className="text-[11px] text-[#A4948B] text-right">
                Včetně DPH. Přesná cena dopravy a platby se dopočítá v dalším
                kroku.
              </p>
            </div>

            <Link href={ROUTES.checkout} className="block w-full">
              <Button
                variant="gold"
                size="lg"
                className="w-full font-bold shadow-lg group"
              >
                Přejít do pokladny
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <div className="pt-2 border-t border-[#F0E4DC] space-y-2 text-xs text-[#7D6B62]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF7F]" />
                <span>Bezpečné platby kartou (Stripe) & Dobírka</span>
              </div>
              <div className="flex items-center gap-2">
                <Wine className="w-4 h-4 text-[#C88D9A]" />
                <span>Ověření věku 18+ proběhne v pokladně</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

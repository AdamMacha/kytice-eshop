"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { formatCZK } from "@/lib/format";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, subtotalHalere, updateQuantity, removeItem, totalItems } =
    useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FDFBF7] shadow-2xl flex flex-col border-l border-[#E8D9CE]">
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#E8D9CE] flex items-center justify-between bg-white/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C88D9A]" />
              <h2 className="font-serif text-lg font-bold text-[#4A3A31]">
                Váš nákupní košík
              </h2>
              <span className="text-xs bg-[#F9ECEF] text-[#C88D9A] font-semibold px-2 py-0.5 rounded-full">
                {totalItems}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#7D6B62] hover:text-[#4A3A31] hover:bg-[#EBC3CC]/30 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-[#F3E7DF] flex items-center justify-center text-[#A4948B]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-medium text-[#4A3A31]">
                    Váš košík je zatím prázdný
                  </p>
                  <p className="text-xs text-[#7D6B62] mt-1">
                    Vyberte si některou z našich originálních sladkých kytic
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={onClose}>
                  <Link href={ROUTES.products}>Prohlédnout kytice</Link>
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.slug}
                  className="flex gap-4 p-3 bg-white rounded-2xl border border-[#E8D9CE]/80 shadow-xs"
                >
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#F3E7DF] shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif font-bold text-sm text-[#4A3A31]">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.slug)}
                          className="text-[#A4948B] hover:text-red-500 transition p-1"
                          aria-label="Odstranit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-[#A87938] mt-0.5">
                        {item.product.price} Kč / ks
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity controls */}
                      <div className="flex items-center border border-[#E8D9CE] rounded-full bg-[#FDFBF7]">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.slug, item.quantity - 1)
                          }
                          className="p-1.5 text-[#4A3A31] hover:text-[#C88D9A] transition rounded-full"
                          aria-label="Snížit množství"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-[#4A3A31]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.slug, item.quantity + 1)
                          }
                          className="p-1.5 text-[#4A3A31] hover:text-[#C88D9A] transition rounded-full"
                          aria-label="Zvýšit množství"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#4A3A31]">
                        {formatCZK(item.product.priceHalere * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#E8D9CE] space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#7D6B62]">
                  <span>Mezisoučet produktů:</span>
                  <span>{formatCZK(subtotalHalere)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#7D6B62]">
                  <span>Doprava:</span>
                  <span className="text-[#C88D9A] font-medium">
                    od 0 Kč (po Praze) / 89 Kč
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#4A3A31] pt-2 border-t border-[#E8D9CE]/60">
                  <span>Celkem k úhradě:</span>
                  <span className="text-[#C88D9A]">
                    {formatCZK(subtotalHalere)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link href={ROUTES.cart} onClick={onClose} className="w-full">
                  <Button variant="outline" size="md" className="w-full">
                    Detail košíku
                  </Button>
                </Link>
                <Link href={ROUTES.checkout} onClick={onClose} className="w-full">
                  <Button variant="primary" size="md" className="w-full group">
                    Pokladna
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              <p className="text-[11px] text-center text-[#A4948B]">
                Všechny ceny jsou uvedeny včetně DPH.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

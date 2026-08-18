"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { formatCZKFromWhole } from "@/lib/format";
import { ROUTES } from "@/lib/constants";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Check, Wine } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#E8D9CE]/80 shadow-xs hover:shadow-xl hover:border-[#D4AF7F]/50 transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image Link */}
      <Link
        href={ROUTES.product(product.slug)}
        className="relative aspect-4/5 w-full overflow-hidden bg-[#F3E7DF] block cursor-pointer"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-108"
        />

        {/* Alcohol Badge */}
        {product.containsAlcohol && (
          <div className="absolute top-3 left-3 z-10">
            <Badge variant="alcohol" className="shadow-xs backdrop-blur-xs flex items-center gap-1">
              <Wine className="w-3 h-3" />
              <span>18+ Alkohol</span>
            </Badge>
          </div>
        )}

        {/* Quick Add Overlay on Desktop */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
          <Button
            variant={isAdded ? "gold" : "primary"}
            size="md"
            onClick={handleAddToCart}
            className="w-full font-semibold shadow-lg backdrop-blur-md"
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 mr-1.5" />
                Přidáno do košíku
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 mr-1.5" />
                Přidat do košíku
              </>
            )}
          </Button>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between bg-white space-y-4">
        <div className="space-y-1.5">
          <p className="text-xs uppercase tracking-widest text-[#A87938] font-semibold">
            {product.subtitle}
          </p>
          <Link href={ROUTES.product(product.slug)}>
            <h3 className="font-serif text-xl font-bold text-[#4A3A31] group-hover:text-[#C88D9A] transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-[#7D6B62] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-[#F0E4DC] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-[#A4948B]">
              Cena včetně DPH
            </span>
            <span className="text-lg sm:text-xl font-bold text-[#4A3A31]">
              {formatCZKFromWhole(product.price)}
            </span>
          </div>

          {/* Mobile Add to Cart button */}
          <div className="sm:hidden">
            <Button
              variant={isAdded ? "gold" : "primary"}
              size="sm"
              onClick={handleAddToCart}
              className="p-2.5 rounded-full"
              aria-label="Přidat do košíku"
            >
              {isAdded ? (
                <Check className="w-4 h-4" />
              ) : (
                <ShoppingBag className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

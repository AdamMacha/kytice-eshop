"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag, Menu, X, Sparkles } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { href: ROUTES.products, label: "Kytice" },
    { href: ROUTES.boxes, label: "Boxy" },
    { href: ROUTES.about, label: "O nás" },
    { href: ROUTES.contact, label: "Kontakt" },
    { href: ROUTES.terms, label: "Doprava & Platba" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#F3E7DF]/90 backdrop-blur-md border-b border-[#E8D9CE]/70 transition-all duration-300">
        {/* Top banner */}
        <div className="bg-gradient-to-r from-[#C88D9A] via-[#D4AF7F] to-[#C88D9A] text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Doprava zdarma po Praze | Ručně tvořené sladké kytice s alkoholem</span>
          <Sparkles className="w-3.5 h-3.5 animate-pulse hidden sm:inline" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-[#4A3A31] hover:bg-[#EBC3CC]/30 transition"
                aria-label="Otevřít menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Logo */}
            <div className="flex-1 md:flex-none flex justify-center md:justify-start">
              <Link href={ROUTES.home} className="flex items-center gap-3 group">
                <div className="relative w-14 h-14 transition-transform group-hover:scale-105">
                  <Image
                    src="/logo.png"
                    alt="MoodBox Bloom Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl tracking-tight text-[#4A3A31] font-bold group-hover:text-[#C88D9A] transition-colors">
                    MoodBox Bloom
                  </span>
                  <span className="text-[10px] tracking-widest uppercase text-[#A87938]">
                    Sladké kytice
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[#4A3A31] hover:text-[#C88D9A] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#C88D9A] hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right actions (Cart) */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-2.5 rounded-full bg-white/80 hover:bg-white text-[#4A3A31] hover:text-[#C88D9A] border border-[#E8D9CE] shadow-sm hover:shadow transition-all cursor-pointer group"
                aria-label="Nákupní košík"
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 bg-[#C88D9A] text-white text-[11px] font-bold rounded-full animate-fade-in shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8D9CE] bg-[#F3E7DF]/98 px-4 pt-3 pb-6 space-y-3 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-[#4A3A31] hover:bg-[#EBC3CC]/40 transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
      />
    </>
  );
}

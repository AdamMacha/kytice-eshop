"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BRAND, ROUTES } from "@/lib/constants";
import { Heart, ShieldAlert, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="bg-[#4A3A31] text-[#F3E7DF] pt-16 pb-12 border-t border-[#D4AF7F]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#7D6B62]/40">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 brightness-0 invert opacity-90">
                <Image
                  src="/logo.png"
                  alt="MoodBox Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                MoodBox Bloom
              </span>
            </div>
            <p className="text-xs text-[#E6D3C2] leading-relaxed">
              {BRAND.tagline}
            </p>
            <p className="text-xs text-[#C88D9A] italic">
              Ruční tvorba s láskou od Kateřiny Janovské.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#D4AF7F]">
              Informace pro zákazníky
            </h4>
            <ul className="space-y-2.5 text-xs text-[#E6D3C2]">
              <li>
                <Link
                  href={ROUTES.products}
                  className="hover:text-white hover:underline transition"
                >
                  Nabídka sladkých kytic
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.about}
                  className="hover:text-white hover:underline transition"
                >
                  O značce MoodBox
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.terms}
                  className="hover:text-white hover:underline transition"
                >
                  Obchodní podmínky & Doprava
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.complaints}
                  className="hover:text-white hover:underline transition"
                >
                  Reklamace a vrácení zboží
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.privacy}
                  className="hover:text-white hover:underline transition"
                >
                  Zásady ochrany osobních údajů (GDPR)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm font-semibold tracking-wider uppercase text-[#D4AF7F]">
              Kontakt & Provozovatel
            </h4>
            <ul className="space-y-3 text-xs text-[#E6D3C2]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF7F] shrink-0 mt-0.5" />
                <span>
                  {BRAND.owner}
                  <br />
                  {BRAND.address}
                  <br />
                  IČO: {BRAND.ico}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF7F] shrink-0" />
                <a
                  href={`mailto:${BRAND.email}`}
                  className="hover:text-white transition"
                >
                  {BRAND.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF7F] shrink-0" />
                <a
                  href={`tel:${BRAND.phone}`}
                  className="hover:text-white transition"
                >
                  {BRAND.phoneFormatted}
                </a>
              </li>
            </ul>
          </div>

          {/* 18+ Warning & Payment Badges */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#3D2F28] border border-[#D4AF7F]/30 space-y-2">
              <div className="flex items-center gap-2 text-[#D4AF7F]">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span className="font-bold text-xs uppercase tracking-wider">
                  Prodej pouze od 18 let
                </span>
              </div>
              <p className="text-[11px] text-[#E6D3C2] leading-relaxed">
                Produkty obsahují alkoholická vína a likéry. Zákaz prodeje osobám
                mladším 18 let podle zákona č. 65/2017 Sb.
              </p>
            </div>

            <div className="pt-2 text-xs text-[#E6D3C2]">
              <span className="block font-medium text-white mb-1.5">
                Bezpečné platby & Doprava:
              </span>
              <p className="text-[11px] text-[#CBB9AD]">
                Stripe Card Payments, Dobírka, Zásilkovna, Osobní doručení po
                Praze.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A4948B] gap-4">
          <p>© {new Date().getFullYear()} MoodBox Bloom. Všechna práva vyhrazena.</p>
          <p className="flex items-center gap-1">
            Vytvořeno s <Heart className="w-3.5 h-3.5 text-[#C88D9A] fill-current" /> pro jedinečné momenty
          </p>
        </div>
      </div>
    </footer>
  );
}

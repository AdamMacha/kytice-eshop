import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stránka nenalezena (404)",
  description: "Omlouváme se, ale požadovaná stránka v e-shopu MoodBox Bloom nebyla nalezena.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center space-y-8">
      <div className="w-20 h-20 rounded-full bg-[#F9ECEF] text-[#C88D9A] flex items-center justify-center mx-auto shadow-inner">
        <Sparkles className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#A87938]">
          Chyba 404
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#4A3A31]">
          Jejda, tato stránka už u nás nekvete
        </h1>
        <p className="text-sm text-[#7D6B62] max-w-md mx-auto leading-relaxed">
          Omlouváme se, ale stránka nebo produkt, který hledáte, byl buď
          přesunut, nebo již není v naší stálé nabídce.
        </p>
      </div>

      {/* Recommended Category Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link href={ROUTES.home}>
          <Button variant="primary" size="lg" className="w-full sm:w-auto font-semibold">
            Přejít na hlavní stránku
          </Button>
        </Link>
        <Link href={ROUTES.products}>
          <Button variant="gold" size="lg" className="w-full sm:w-auto font-semibold shadow-lg">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Všechny sladké kytice
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Helpful links */}
      <div className="pt-8 border-t border-[#E8D9CE] flex flex-wrap justify-center gap-6 text-xs text-[#7D6B62]">
        <Link href={ROUTES.boxes} className="hover:text-[#C88D9A] underline">
          Dárkové boxy
        </Link>
        <Link href={ROUTES.mini} className="hover:text-[#C88D9A] underline">
          Kytice mini
        </Link>
        <Link href={ROUTES.about} className="hover:text-[#C88D9A] underline">
          O značce MoodBox
        </Link>
        <Link href={ROUTES.contact} className="hover:text-[#C88D9A] underline">
          Kontaktujte nás
        </Link>
      </div>
    </div>
  );
}


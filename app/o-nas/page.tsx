import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Gift, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "O nás – Příběh MoodBox Bloom",
  description:
    "MoodBox Bloom vznikl z lásky k tvoření a radosti z dárků, které mají smysl. Ručně tvořené sladké kytice od Kateřiny.",
};

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E8D9CE] text-xs font-semibold text-[#A87938]">
          <Heart className="w-3.5 h-3.5 text-[#C88D9A]" />
          <span>Náš příběh</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#4A3A31]">
          Dárky, které říkají víc než slova
        </h1>
        <p className="text-base text-[#7D6B62] leading-relaxed">
          Ruční práce, prémiové suroviny a vášeň pro tvoření jedinečných
          momentů.
        </p>
      </div>

      {/* Main Story Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left: Image with decorative elements */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#F3E7DF]">
            <Image
              src="/products/pink-edition.png"
              alt="Kateřina tvoří kytice MoodBox"
              fill
              className="object-cover"
            />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-4 -right-4 p-4 rounded-2xl bg-white/95 border border-[#E8D9CE] shadow-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F9ECEF] flex items-center justify-center text-[#C88D9A]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs text-[#4A3A31]">Ruční tvorba</p>
              <p className="text-[10px] text-[#7D6B62]">Každý kus je originál</p>
            </div>
          </div>
        </div>

        {/* Right: Personal letter / story */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A3A31]">
              O mně a MoodBoxu
            </h2>

            <div className="space-y-4 text-sm text-[#7D6B62] leading-relaxed">
              <p>
                Moodbox Bloom vznikl z lásky k tvoření a radosti z dárků, které
                mají smysl.
              </p>
              <p>
                Každou kytici připravuji ručně tak, aby nebyla jen hezká na
                pohled, ale hlavně aby vyvolala emoci – překvapení, radost a
                úsměv.
              </p>
              <p>
                Věřím, že i malý dárek může vytvořit velký moment. A právě takové
                momenty chci tvořit pro vás a vaše blízké.
              </p>
              <p>
                Každá kytice je originál a může být upravena na přání – protože
                každý člověk i příležitost jsou jiné.
              </p>
              <p className="font-medium text-[#4A3A31]">
                Děkuji, že podporujete malou značku a ruční tvorbu.
              </p>
            </div>

            <div className="pt-4 border-t border-[#F0E4DC] flex items-center justify-between">
              <div>
                <p className="font-serif font-bold text-lg text-[#4A3A31]">
                  Kateřina Janovská
                </p>
                <p className="text-xs text-[#C88D9A]">MoodBox Bloom</p>
              </div>
              <Link href={ROUTES.products}>
                <Button variant="gold" size="md">
                  Vybrat kytici
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

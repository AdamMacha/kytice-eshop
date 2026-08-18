import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BRAND, ROUTES } from "@/lib/constants";
import { RotateCcw, AlertTriangle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Reklamace a vrácení zboží",
  description:
    "Postup při uplatnění reklamace a informace o možnostech vrácení zboží v e-shopu MoodBox Bloom.",
};

export default function ComplaintsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8D9CE] text-xs font-semibold text-[#A87938]">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Servis & Péče</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3A31]">
          Reklamace a vrácení zboží
        </h1>
        <p className="text-xs text-[#7D6B62]">
          Vaše spokojenost je pro nás na prvním místě
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-8 text-sm text-[#4A3A31] leading-relaxed">
        {/* Postup reklamace */}
        <section className="space-y-3">
          <h2 className="font-serif text-lg font-bold text-[#4A3A31]">
            Jak postupovat při reklamaci
          </h2>
          <p>
            Všechny naše kytice tvoříme s maximální pečlivostí a dárkově balíme
            tak, aby k vám dorazily v perfektním stavu. Pokud se přesto vyskytne
            jakákoliv vada, postupujte následovně:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-[#7D6B62]">
            <li>
              Vyfoťte poškození zásilky či vady na produktu ihned po rozbalení.
            </li>
            <li>
              Zašlete nám email na adresu:{" "}
              <strong className="text-[#4A3A31]">{BRAND.email}</strong>.
            </li>
            <li>
              Do předmětu uveďte <em>&bdquo;Reklamace - číslo objednávky&ldquo;</em>{" "}
              a přiložte popis vady s fotografiemi.
            </li>
            <li>
              Reklamaci posoudíme bez zbytečného odkladu (obvykle do 2–3
              pracovních dnů) a navrhneme vám nejlepší řešení (zaslání nové
              kytice nebo vrácení peněz).
            </li>
          </ol>
        </section>

        {/* Informace o odstoupení */}
        <section className="space-y-3 p-5 rounded-2xl bg-[#F9ECEF] border border-[#EBC3CC]">
          <div className="flex items-center gap-2 text-[#C88D9A]">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="font-serif text-base font-bold">
              Důležité informace k vrácení zboží (14denní lhůta)
            </h2>
          </div>
          <div className="text-xs text-[#4A3A31] space-y-2">
            <p>
              V souladu s § 1837 občanského zákoníku{" "}
              <strong>nelze odstoupit od smlouvy</strong> u:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[#7D6B62]">
              <li>
                <strong>Zboží upraveného na přání zákazníka</strong> (zakázková
                výroba kytic a boxů na míru),
              </li>
              <li>
                <strong>Zboží podléhajícího rychlé zkáze</strong> (čokoládové
                cukrovinky a potraviny s porušeným hygienickým obalem).
              </li>
            </ul>
          </div>
        </section>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F0E4DC]">
          <div className="text-xs text-[#7D6B62]">
            Máte jakékoliv otázky? Rádi vám pomůžeme.
          </div>
          <Link href={ROUTES.contact}>
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-1.5" />
              Kontaktovat podporu
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

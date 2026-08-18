import React from "react";
import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů (GDPR)",
  description:
    "Zásady zpracování a ochrany osobních údajů v e-shopu MoodBox Bloom.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8D9CE] text-xs font-semibold text-[#A87938]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>GDPR</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3A31]">
          Zásady ochrany osobních údajů
        </h1>
        <p className="text-xs text-[#7D6B62]">
          Platné a účinné od 18. 8. 2026
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-8 text-sm text-[#4A3A31] leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#4A3A31]">
            1. Správce osobních údajů
          </h2>
          <p>
            Správcem osobních údajů podle čl. 4 bod 7 Nařízení Evropského
            parlamentu a Rady (EU) 2016/679 o ochraně fyzických osob v
            souvislosti se zpracováním osobních údajů (GDPR) je:
            <br />
            <strong>{BRAND.owner}</strong>, IČO: {BRAND.ico}, se sídlem{" "}
            {BRAND.address}.
            <br />
            Email: {BRAND.email}, Tel: {BRAND.phoneFormatted}.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#4A3A31]">
            2. Účel zpracování a právní základ
          </h2>
          <p>
            Správce zpracovává osobní údaje, které jste mu poskytli při vytváření
            objednávky (jméno, příjmení, doručovací adresa, fakturační adresa,
            email, telefonní číslo, potvrzení o dosažení věku 18 let).
          </p>
          <ul className="list-disc list-inside space-y-1 text-[#7D6B62]">
            <li>
              <strong>Plnění smlouvy (čl. 6 odst. 1 písm. b) GDPR):</strong> Za
              účelem vyřízení vaší objednávky, doručení kytice a komunikace o
              stavu zásilky.
            </li>
            <li>
              <strong>
                Plnění právní povinnosti (čl. 6 odst. 1 písm. c) GDPR):
              </strong>{" "}
              Vedení účetnictví a daňové evidence (10 let) a ověření věku při
              prodeji alkoholu (zákon č. 65/2017 Sb.).
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#4A3A31]">
            3. Příjemci osobních údajů (Zpracovatelé)
          </h2>
          <p>
            Osobní údaje nejsou předávány třetím stranám za účelem marketingu.
            Předávány jsou výhradně partnerům nezbytným pro vyřízení objednávky:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[#7D6B62]">
            <li>
              <strong>Dopravci:</strong> Zásilkovna s.r.o. (pro doručení
              zásilky),
            </li>
            <li>
              <strong>Platební brána:</strong> Stripe Payments Europe Ltd. (pro
              zpracování online plateb kartou),
            </li>
            <li>
              <strong>Poskytovatel hostingu a emailů:</strong> Vercel Inc. a
              Resend.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#4A3A31]">
            4. Vaše práva
          </h2>
          <p>
            Podle podmínek stanovených v GDPR máte právo na přístup ke svým
            osobním údajům, právo na jejich opravu, výmaz (právo být zapomenut),
            omezení zpracování a právo vznést námitku. Pro uplatnění svých práv
            kontaktujte správce na emailu: <strong>{BRAND.email}</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}

import React from "react";
import { HelpCircle, ChevronDown } from "lucide-react";
import { getFAQSchema } from "@/lib/schema";

export const HOME_FAQS = [
  {
    question: "Co přesně je sladká kytice a co obsahuje?",
    answer:
      "Naše sladké kytice (čokokytice) jsou originální ručně vázané dárky tvořené kombinací kvalitních značkových čokolád (např. Raffaello, Ferrero Rocher, Kinder), vybraného alkoholu (šumivé víno, bílé víno, rum nebo Jägermeister) a jemných dekorativních prvků. Na rozdíl od živých květin vydrží podstatně déle a potěší všechny smysly.",
  },
  {
    question: "Jak funguje doprava po Praze zdarma a po celé ČR?",
    answer:
      "Po celé Praze zajišťujeme osobní doručení zcela ZDARMA přímo k vašim dveřím nebo na adresu oslavence v předem domluveném čase. Pro doručení do ostatních měst po celé České republice zasíláme zásilky bezpečně a dárkově zabalené přes Zásilkovnu – buď na výdejní místo či Z-BOX (od 89 Kč), nebo přímo na doručovací adresu (129 Kč).",
  },
  {
    question: "Je možné kytici upravit na míru nebo přidat osobní věnování?",
    answer:
      "Určitě ano! Každou kytici vážeme ručně na zakázku. Můžeme upravit barevné ladění stuh a obalů, vyměnit druh čokolády nebo láhev alkoholu dle vašich preferencí. K objednávce vám také rádi zdarma přiložíme ručně psané přání či věnování. Stačí uvést vaše požadavky do poznámky v pokladně.",
  },
  {
    question: "Jak probíhá zákonné ověření věku 18+?",
    answer:
      "Protože naše kytice obsahují prémiový alkohol, v souladu se zákonem č. 65/2017 Sb. je jejich prodej povolen výhradně osobám starším 18 let. Zákazník stvrzuje dosažení plnoletosti čestným prohlášením v pokladně a fyzické ověření věku provádí kurýr nebo obsluha výdejního místa při převzetí.",
  },
  {
    question: "Jak dlouho dopředu je nutné sladkou kytici objednat?",
    answer:
      "Běžná doba ruční výroby a expedice je 3 až 10 pracovních dní. Pokud dárek spěchá na konkrétní datum (např. oslava narozenin, výročí nebo svátek), kontaktujte nás předem telefonicky nebo emailem a rádi uděláme maximum pro expresní zhotovení.",
  },
  {
    question: "Jak dlouho čokolády a dobroty v kytici vydrží?",
    answer:
      "Používáme výhradně čerstvé a originálně balené cukrovinky s dlouhou dobou minimální trvanlivosti (obvykle 6 až 12 měsíců). Kytice doporučujeme skladovat na suchém místě při pokojové teplotě (ideálně 15–20 °C) a nevystavovat je přímému slunci či zdrojům tepla.",
  },
];

export function FaqSection() {
  const faqSchema = getFAQSchema(HOME_FAQS);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Schema.org FAQPage for rich search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E8D9CE] text-xs font-semibold text-[#A87938]">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Vše, co potřebujete vědět</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3A31]">
          Často kladené otázky (FAQ)
        </h2>
        <p className="text-sm text-[#7D6B62] max-w-xl mx-auto">
          Zajímá vás, jak probíhá doručení, z čeho kytice tvoříme nebo jak si
          nechat vytvořit dárek na míru? Zde najdete odpovědi na nejčastější
          dotazy.
        </p>
      </div>

      <div className="space-y-4">
        {HOME_FAQS.map((faq, index) => (
          <details
            key={index}
            className="group rounded-2xl bg-white border border-[#E8D9CE] p-5 [&_summary::-webkit-details-marker]:hidden transition-colors hover:border-[#D4AF7F]/60"
          >
            <summary className="flex items-center justify-between gap-4 cursor-pointer font-serif font-bold text-base sm:text-lg text-[#4A3A31] list-none select-none">
              <span>{faq.question}</span>
              <ChevronDown className="w-5 h-5 text-[#C88D9A] shrink-0 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <p className="mt-4 pt-3 border-t border-[#F0E4DC] text-xs sm:text-sm text-[#7D6B62] leading-relaxed">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}


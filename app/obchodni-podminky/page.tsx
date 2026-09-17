import React from "react";
import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { FileText, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Obchodní podmínky",
  description: "Všeobecné obchodní podmínky e-shopu MoodBox Bloom.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8D9CE] text-xs font-semibold text-[#A87938]">
          <FileText className="w-3.5 h-3.5" />
          <span>Právní informace</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3A31]">
          Obchodní podmínky
        </h1>
        <p className="text-xs text-[#7D6B62]">
          Platné a účinné od 18. 8. 2026
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-8 text-sm text-[#4A3A31] leading-relaxed">
        <p className="text-xs text-[#7D6B62] italic">
          Tyto obchodní podmínky upravují vztahy mezi prodávajícím a kupujícím
          při prodeji zboží prostřednictvím internetového obchodu MoodBox Bloom.
        </p>

        {/* 1. Prodávající */}
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#4A3A31]">
            1. Prodávající
          </h2>
          <p>
            <strong>Jméno a příjmení:</strong> {BRAND.owner}
            <br />
            <strong>Sídlo:</strong> {BRAND.address}
            <br />
            <strong>IČO:</strong> {BRAND.ico}
            <br />
            <strong>Email:</strong> {BRAND.email}
            <br />
            <strong>Telefon:</strong> {BRAND.phoneFormatted}
          </p>
        </section>

        {/* 2. Objednávka a uzavření smlouvy */}
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#4A3A31]">
            2. Objednávka a uzavření kupní smlouvy
          </h2>
          <p>
            Kupující objednává zboží prostřednictvím e-shopu odesláním
            objednávkového formuláře. Odesláním objednávky kupující stvrzuje, že
            se seznámil s těmito obchodními podmínkami a zásadami ochrany
            osobních údajů a že s nimi bez výhrad souhlasí. Kupní smlouva vzniká
            potvrzením objednávky ze strany prodávajícího.
          </p>
        </section>

        {/* 3. Cena a platba */}
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#4A3A31]">
            3. Cena a platební podmínky
          </h2>
          <p>
            Všechny ceny na e-shopu jsou konečné a uvedené včetně DPH. Kupující
            může uhradit kupní cenu následujícími způsoby:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[#7D6B62]">
            <li>
              <strong>Platba kartou online (Stripe):</strong> Bezpečně přes
              platební bránu bez poplatku.
            </li>
            <li>
              <strong>Dobírka:</strong> Platba při převzetí zásilky v hotovosti
              nebo kartou u dopravce (+30 Kč příplatek).
            </li>
          </ul>
        </section>

        {/* 4. Doprava a dodání */}
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#4A3A31]">
            4. Doprava a dodání zboží
          </h2>
          <p>Zboží je doručováno následujícími způsoby:</p>
          <ul className="list-disc list-inside space-y-1 text-[#7D6B62]">
            <li>
              <strong>Doprava po Praze:</strong> Zdarma – osobní doručení na
              zadanou adresu v Praze.
            </li>
            <li>
              <strong>Zásilkovna – výdejní místo:</strong> 89 Kč (vyzvednutí na
              vybrané pobočce či Z-BOXu).
            </li>
            <li>
              <strong>Zásilkovna – doručení na adresu:</strong> 129 Kč (doručení
              kurýrem na adresu v ČR).
            </li>
          </ul>
          <p className="text-xs text-[#7D6B62]">
            Doba dodání je obvykle <strong>3–10 pracovních dní</strong> od
            potvrzení objednávky (s ohledem na časově náročnou ruční výrobu
            kytice). Prodávající nenese odpovědnost za poškození zásilky
            způsobené nevhodným zacházením dopravce během přepravy, kupující je
            povinen zásilku při převzetí zkontrolovat.
          </p>
        </section>

        {/* 5. Odstoupení od smlouvy */}
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#4A3A31]">
            5. Odstoupení od kupní smlouvy
          </h2>
          <p>
            Kupující (spotřebitel) má právo odstoupit od kupní smlouvy bez udání
            důvodu do 14 dnů od převzetí zboží.
          </p>
          <div className="p-4 rounded-2xl bg-[#F9ECEF] border border-[#EBC3CC] text-xs text-[#4A3A31] space-y-1.5">
            <p className="font-bold text-[#C88D9A]">Zákonné výjimky:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Zboží vyrobené na zakázku:</strong> U kytic a dárkových
                boxů vyrobených nebo upravených na míru dle specifického přání
                kupujícího není možné od smlouvy odstoupit (§ 1837 písm. d) občanského
                zákoníku).
              </li>
              <li>
                <strong>Zboží podléhající rychlé zkáze:</strong> Potraviny a
                čokoládové cukrovinky podléhající rychlé zkáze nelze po rozbalení
                vrátit.
              </li>
            </ul>
          </div>
        </section>

        {/* 6. Reklamace */}
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#4A3A31]">
            6. Práva z vadného plnění (Reklamace)
          </h2>
          <p>
            V případě vady má kupující právo na uplatnění reklamace. Reklamaci je
            nutné uplatnit bez zbytečného odkladu písemně na email prodávajícího:{" "}
            <strong>{BRAND.email}</strong> včetně fotodokumentace vady.
          </p>
        </section>

        {/* 7. Ochrana osobních údajů */}
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#4A3A31]">
            7. Ochrana osobních údajů (GDPR)
          </h2>
          <p>
            Osobní údaje kupujícího jsou zpracovávány výhradně za účelem vyřízení
            a doručení objednávky v souladu s Nařízením GDPR. Podrobné zásady
            jsou uvedeny na stránce Ochrana osobních údajů.
          </p>
        </section>

        {/* 8. Prodej výrobků obsahujících alkohol */}
        <section className="space-y-3 p-5 rounded-2xl bg-[#FFF4E5] border border-[#FFE0B2]">
          <div className="flex items-center gap-2 text-[#B76E00]">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="font-serif text-base font-bold">
              8. Prodej výrobků obsahujících alkohol (Zákon č. 65/2017 Sb.)
            </h2>
          </div>
          <div className="text-xs text-[#4A3A31] space-y-2 leading-relaxed">
            <p>
              Všechny sladké kytice a boxy nabízené v e-shopu obsahují alkohol a
              jsou určeny <strong>výhradně osobám starším 18 let</strong>.
            </p>
            <p>
              Odesláním objednávky kupující čestně prohlašuje, že je starší 18
              let a je oprávněn tyto produkty zakoupit. Prodávající nenese
              odpovědnost za uvedení nepravdivých údajů o věku ze strany
              kupujícího.
            </p>
            <p>
              <strong>Prodávající si vyhrazuje právo:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Odmítnout nebo zrušit objednávku, pokud vznikne důvodné podezření,
                že kupující nesplňuje věkovou hranici 18 let,
              </li>
              <li>Požadovat ověření věku před odesláním objednávky,</li>
              <li>
                Neodeslat zboží, pokud nebude věk kupujícího prokazatelně ověřen.
              </li>
            </ul>
            <p>
              Při převzetí zásilky může být ze strany dopravce (Zásilkovna /
              kurýr) provedena kontrola věku příjemce předložením průkazu
              totožnosti. V případě, že příjemce nesplňuje podmínku minimálního
              věku 18 let, zásilka nebude předána.
            </p>
          </div>
        </section>

        {/* 9. Mimosoudní řešení sporů (ADR / ČOI) */}
        <section className="space-y-2 pt-2 border-t border-[#F0E4DC]">
          <h2 className="font-serif text-lg font-bold text-[#4A3A31]">
            9. Mimosoudní řešení spotřebitelských sporů
          </h2>
          <p className="text-xs text-[#7D6B62]">
            K mimosoudnímu řešení spotřebitelských sporů z kupní smlouvy je
            příslušná <strong>Česká obchodní inspekce</strong>, se sídlem
            Štěpánská 567/15, 120 00 Praha 2, IČO: 000 20 869, internetová
            adresa:{" "}
            <a
              href="https://adr.coi.cz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C88D9A] underline hover:text-[#B67886]"
            >
              https://adr.coi.cz
            </a>
            . Platformu pro řešení sporů on-line nacházející se na internetové
            adrese{" "}
            <a
              href="http://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C88D9A] underline hover:text-[#B67886]"
            >
              http://ec.europa.eu/consumers/odr
            </a>{" "}
            je možné využít při řešení sporů mezi prodávajícím a kupujícím z kupní
            smlouvy.
          </p>
        </section>

        {/* 10. Závěrečná ustanovení */}
        <section className="space-y-2 pt-2 border-t border-[#F0E4DC]">
          <h2 className="font-serif text-lg font-bold text-[#4A3A31]">
            10. Závěrečná ustanovení
          </h2>
          <p className="text-xs text-[#7D6B62]">
            Vztahy neupravené těmito obchodními podmínkami se řídí platným právním
            řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský
            zákoník, a zákonem č. 634/1992 Sb., o ochraně spotřebitele.
          </p>
        </section>
      </div>
    </div>
  );
}

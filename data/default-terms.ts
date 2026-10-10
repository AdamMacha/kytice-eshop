import { BRAND } from "@/lib/constants";

export const DEFAULT_TERMS_MARKDOWN = `*Tyto obchodní podmínky upravují vztahy mezi prodávajícím a kupujícím při prodeji zboží prostřednictvím internetového obchodu MoodBox Bloom.*

## 1. Prodávající
**Jméno a příjmení:** ${BRAND.owner}  
**Sídlo:** ${BRAND.address}  
**IČO:** ${BRAND.ico}  
**Email:** ${BRAND.email}  
**Telefon:** ${BRAND.phoneFormatted}  

## 2. Objednávka a uzavření kupní smlouvy
Kupující objednává zboží prostřednictvím e-shopu odesláním objednávkového formuláře. Odesláním objednávky kupující stvrzuje, že se seznámil s těmito obchodními podmínkami a zásadami ochrany osobních údajů a že s nimi bez výhrad souhlasí. Kupní smlouva vzniká potvrzením objednávky ze strany prodávajícího.

## 3. Cena a platební podmínky
Všechny ceny na e-shopu jsou konečné a uvedené včetně DPH. Kupující může uhradit kupní cenu následujícími způsoby:
- **Platba kartou online (Stripe):** Bezpečně přes platební bránu bez poplatku.
- **Dobírka:** Platba při převzetí zásilky v hotovosti nebo kartou u dopravce (+30 Kč příplatek).

## 4. Doprava a dodání zboží
Zboží je doručováno následujícími způsoby:
- **Doprava po Praze:** Zdarma – osobní doručení na zadanou adresu v Praze.
- **Zásilkovna – výdejní místo:** 89 Kč (vyzvednutí na vybrané pobočce či Z-BOXu).
- **Zásilkovna – doručení na adresu:** 129 Kč (doručení kurýrem na adresu v ČR).

Doba dodání je obvykle **3–10 pracovních dní** od potvrzení objednávky (s ohledem na časově náročnou ruční výrobu kytice). Prodávající nenese odpovědnost za poškození zásilky způsobené nevhodným zacházením dopravce během přepravy, kupující je povinen zásilku při převzetí zkontrolovat.

## 5. Odstoupení od kupní smlouvy
Kupující (spotřebitel) má právo odstoupit od kupní smlouvy bez udání důvodu do 14 dnů od převzetí zboží.

> **Zákonné výjimky:**
> - **Zboží vyrobené na zakázku:** U kytic a dárkových boxů vyrobených nebo upravených na míru dle specifického přání kupujícího není možné od smlouvy odstoupit (§ 1837 písm. d) občanského zákoníku).
> - **Zboží podléhající rychlé zkáze:** Potraviny a čokoládové cukrovinky podléhající rychlé zkáze nelze po rozbalení vrátit.

## 6. Práva z vadného plnění (Reklamace)
V případě vady má kupující právo na uplatnění reklamace. Reklamaci je nutné uplatnit bez zbytečného odkladu písemně na email prodávajícího: **${BRAND.email}** včetně fotodokumentace vady.

## 7. Ochrana osobních údajů (GDPR)
Osobní údaje kupujícího jsou zpracovávány výhradně za účelem vyřízení a doručení objednávky v souladu s Nařízením GDPR. Podrobné zásady jsou uvedeny na stránce Ochrana osobních údajů.

## 8. Prodej výrobků obsahujících alkohol (Zákon č. 65/2017 Sb.)
Všechny sladké kytice a boxy nabízené v e-shopu obsahují alkohol a jsou určeny **výhradně osobám starším 18 let**.

Odesláním objednávky kupující čestně prohlašuje, že je starší 18 let a je oprávněn tyto produkty zakoupit. Prodávající nenese odpovědnost za uvedení nepravdivých údajů o věku ze strany kupujícího.

**Prodávající si vyhrazuje právo:**
- Odmítnout nebo zrušit objednávku, pokud vznikne důvodné podezření, že kupující nesplňuje věkovou hranici 18 let,
- Požadovat ověření věku před odesláním objednávky,
- Neodeslat zboží, pokud nebude věk kupujícího prokazatelně ověřen.

Při převzetí zásilky může být ze strany dopravce (Zásilkovna / kurýr) provedena kontrola věku příjemce předložením průkazu totožnosti. V případě, že příjemce nesplňuje podmínku minimálního věku 18 let, zásilka nebude předána.

## 9. Mimosoudní řešení spotřebitelských sporů
K mimosoudnímu řešení spotřebitelských sporů z kupní smlouvy je příslušná **Česká obchodní inspekce**, se sídlem Štěpánská 567/15, 120 00 Praha 2, IČO: 000 20 869, internetová adresa: [https://adr.coi.cz](https://adr.coi.cz). Platformu pro řešení sporů on-line nacházející se na internetové adrese [http://ec.europa.eu/consumers/odr](http://ec.europa.eu/consumers/odr) je možné využít při řešení sporů mezi prodávajícím a kupujícím z kupní smlouvy.

## 10. Závěrečná ustanovení
Vztahy neupravené těmito obchodními podmínkami se řídí platným právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník, a zákonem č. 634/1992 Sb., o ochraně spotřebitele.
`;

import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    slug: "pink-edition",
    name: "Pink Edition",
    subtitle: "Pro důležitý okamžik",
    description:
      "Jemná a elegantní. Stylové růžové balení ukrývá kombinaci čokolády, jemných dekorací a šumivého vína, díky čemuž je ideálním dárkem pro každou příležitost – narozeniny, výročí nebo jen tak z lásky.",
    price: 1999,
    priceHalere: 199900,
    image: "/products/pink-edition.png",
    containsAlcohol: true,
    alcoholDetails: "Obsahuje šumivé víno",
    color: "#F4B8C5",
    inStock: true,
    category: "BOUQUET",
  },
  {
    slug: "red-passion",
    name: "Red Passion",
    subtitle: "Pro chvíle plné lásky",
    description:
      "Silná a nepřehlédnutelná. Výrazné červené balení ukrývá kombinaci lahodné čokolády, jemných dekorací a rumu nebo Jägermeisteru, která vytváří nepřehlédnutelný dárek pro výjimečné okamžiky – výročí, romantická překvapení nebo chvíle, kdy chceš říct víc než slova.",
    price: 1999,
    priceHalere: 199900,
    image: "/products/red-passion.png",
    containsAlcohol: true,
    alcoholDetails: "Obsahuje rum nebo Jägermeister",
    color: "#C41E3A",
    inStock: true,
    category: "BOUQUET",
  },
  {
    slug: "blue-dream",
    name: "Blue Dream",
    subtitle: "Pro chvíle klidu a harmonie",
    description:
      "Klidná a osvěžující. Jemně modré balení ukrývá sladké dobroty z čokolády, vkusné detaily a bílé víno, které společně vytváří dokonalý dárek pro chvíle pohody, relaxu a vnitřní harmonie.",
    price: 1999,
    priceHalere: 199900,
    image: "/products/blue-dream.png",
    containsAlcohol: true,
    alcoholDetails: "Obsahuje bílé víno",
    color: "#7BB8E0",
    inStock: true,
    category: "BOUQUET",
  },
  {
    slug: "magic-bloom",
    name: "Magic Bloom",
    subtitle: "Pro chvíle plné tajemství",
    description:
      "Originální a hravá. Fialové balení plné sladkostí, dekorací a červeného vína přináší jedinečný zážitek pro ty, kteří milují něco trochu jiného.",
    price: 1999,
    priceHalere: 199900,
    image: "/products/magic-bloom.png",
    containsAlcohol: true,
    alcoholDetails: "Obsahuje červené víno",
    color: "#9B59B6",
    inStock: true, // NOTE: image not yet provided — set to false before launch if missing
    category: "BOUQUET",
  },
  {
    slug: "golden-elegance",
    name: "Golden Elegance",
    subtitle: "Pro jedinečné okamžiky",
    description:
      "Výjimečná a nezapomenutelná. Bílo-zlaté balení ukrývá pečlivě vybranou čokoládu, jemné dekorace, rum a šumivé víno – ideální volba pro jedinečné okamžiky, na které se nezapomíná.",
    price: 1999,
    priceHalere: 199900,
    image: "/products/golden-elegance.png",
    containsAlcohol: true,
    alcoholDetails: "Obsahuje rum a šumivé víno",
    color: "#D4AF37",
    inStock: true,
    category: "BOUQUET",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllProducts(): Product[] {
  return products.filter((p) => p.inStock);
}

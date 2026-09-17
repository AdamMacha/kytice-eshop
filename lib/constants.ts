// ─── MoodBox Bloom Constants ────────────────────────────────────────

/** Brand information */
export const BRAND = {
  name: "MoodBox Bloom",
  tagline: "Originální sladké kytice, které říkají víc než slova.",
  owner: "Kateřina Janovská",
  ico: "23965878",
  address: "Hlavní 28, Průhonice 25243",
  email: "moodboxcz@gmail.com",
  phone: "776 208 814",
  phoneFormatted: "+420 776 208 814",
} as const;

/** Color palette from brand guidelines */
export const COLORS = {
  primary: "#C88D9A",
  secondary: "#EBC3CC",
  background: "#F3E7DF",
  accent: "#E6D3C2",
  gold: "#D4AF7F",
  text: "#4A3A31",
} as const;

/** Application URLs */
export const ROUTES = {
  home: "/",
  products: "/produkty",
  product: (slug: string) => `/produkty/${slug}` as const,
  cart: "/kosik",
  checkout: "/pokladna",
  orderConfirmation: "/objednavka/potvrzeni",
  orderStatus: (id: string) => `/objednavka/${id}` as const,
  about: "/o-nas",
  contact: "/kontakt",
  terms: "/obchodni-podminky",
  privacy: "/ochrana-udaju",
  complaints: "/reklamace",
} as const;

/** Order number generation */
export const ORDER_NUMBER_PREFIX =
  process.env.ORDER_NUMBER_PREFIX || "MB";

/** Maximum quantity per product in cart */
export const MAX_QUANTITY_PER_ITEM = 10;

/** Stripe configuration */
export const STRIPE_CURRENCY = "czk";

/** Age gate storage key */
export const AGE_VERIFIED_KEY = "moodbox_age_verified";

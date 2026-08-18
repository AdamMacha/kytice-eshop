export interface Product {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number; // in CZK (whole units for display)
  priceHalere: number; // in haléře for Stripe/DB
  image: string;
  containsAlcohol: boolean;
  alcoholDetails: string;
  color: string; // primary color for UI accents
  inStock: boolean;
}

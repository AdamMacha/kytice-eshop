import type { ShippingMethod } from "@/types/shipping";

export const shippingMethods: ShippingMethod[] = [
  {
    id: "PRAGUE_DELIVERY",
    name: "Doručení po Praze",
    description: "Osobní doručení po Praze zdarma",
    price: 0,
    priceHalere: 0,
    estimatedDays: "1–3 pracovní dny",
    requiresAddress: true,
    requiresPacketaPoint: false,
  },
  {
    id: "PACKETA_PICKUP",
    name: "Zásilkovna – výdejní místo",
    description: "Vyzvednutí na výdejním místě Zásilkovny",
    price: 89,
    priceHalere: 8900,
    estimatedDays: "3–5 pracovních dnů",
    requiresAddress: false,
    requiresPacketaPoint: true,
  },
  {
    id: "PACKETA_ADDRESS",
    name: "Zásilkovna – doručení na adresu",
    description: "Doručení na vaši adresu prostřednictvím Zásilkovny",
    price: 129,
    priceHalere: 12900,
    estimatedDays: "3–5 pracovních dnů",
    requiresAddress: true,
    requiresPacketaPoint: false,
  },
];

/** COD surcharge in CZK and haléře */
export const COD_FEE = 30;
export const COD_FEE_HALERE = 3000;

export function getShippingMethod(
  id: string
): ShippingMethod | undefined {
  return shippingMethods.find((m) => m.id === id);
}

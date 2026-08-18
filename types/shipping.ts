import type { ShippingMethodId } from "@/types/order";

export interface ShippingMethod {
  id: ShippingMethodId;
  name: string;
  description: string;
  price: number; // in CZK
  priceHalere: number; // in haléře
  estimatedDays: string;
  requiresAddress: boolean;
  requiresPacketaPoint: boolean;
}

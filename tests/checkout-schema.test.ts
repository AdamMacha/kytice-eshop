import { describe, it, expect } from "vitest";
import { checkoutFormSchema } from "@/schemas/checkout";

describe("Checkout Schema Validation", () => {
  const validBaseData = {
    firstName: "Kateřina",
    lastName: "Nováková",
    email: "katerina@example.cz",
    phone: "+420776208814",
    billingStreet: "Hlavní 28",
    billingCity: "Praha",
    billingZip: "110 00",
    shippingMethod: "PRAGUE_DELIVERY" as const,
    shippingStreet: "Václavské náměstí 1",
    shippingCity: "Praha",
    shippingZip: "110 00",
    paymentMethod: "STRIPE_CARD" as const,
    ageVerified: true as const,
    termsAccepted: true as const,
    privacyAccepted: true as const,
    items: [{ productSlug: "pink-edition", quantity: 1 }],
  };

  it("passes validation with valid data", () => {
    const result = checkoutFormSchema.safeParse(validBaseData);
    expect(result.success).toBe(true);
  });

  it("fails validation if 18+ age verification is false", () => {
    const result = checkoutFormSchema.safeParse({
      ...validBaseData,
      ageVerified: false,
    });
    expect(result.success).toBe(false);
  });

  it("fails validation if Packeta pickup is selected but no point is provided", () => {
    const result = checkoutFormSchema.safeParse({
      ...validBaseData,
      shippingMethod: "PACKETA_PICKUP",
      packetaPointId: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("passes validation if Packeta pickup is selected with a point ID", () => {
    const result = checkoutFormSchema.safeParse({
      ...validBaseData,
      shippingMethod: "PACKETA_PICKUP",
      packetaPointId: "12345",
      packetaPointName: "Z-BOX Praha",
    });
    expect(result.success).toBe(true);
  });

  it("fails validation if cart is empty", () => {
    const result = checkoutFormSchema.safeParse({
      ...validBaseData,
      items: [],
    });
    expect(result.success).toBe(false);
  });
});

import { z } from "zod";

// ─── Checkout Form Schema ──────────────────────────────────────────

const shippingMethodEnum = z.enum([
  "PRAGUE_DELIVERY",
  "PACKETA_PICKUP",
  "PACKETA_ADDRESS",
]);

const paymentMethodEnum = z.enum(["STRIPE_CARD", "COD"]);

export const checkoutFormSchema = z
  .object({
    // Contact info
    firstName: z
      .string()
      .min(2, "Jméno musí mít alespoň 2 znaky")
      .max(50, "Jméno je příliš dlouhé"),
    lastName: z
      .string()
      .min(2, "Příjmení musí mít alespoň 2 znaky")
      .max(50, "Příjmení je příliš dlouhé"),
    email: z.string().email("Zadejte platný email"),
    phone: z
      .string()
      .regex(
        /^(\+420)?[0-9]{9}$/,
        "Zadejte platné telefonní číslo (9 číslic nebo +420...)"
      ),

    // Billing address
    billingStreet: z
      .string()
      .min(3, "Zadejte ulici a číslo popisné"),
    billingCity: z.string().min(2, "Zadejte město"),
    billingZip: z
      .string()
      .regex(/^[0-9]{3}\s?[0-9]{2}$/, "Zadejte platné PSČ (např. 110 00)"),

    // Shipping method
    shippingMethod: shippingMethodEnum,

    // Packeta pickup point (required when shippingMethod = PACKETA_PICKUP)
    packetaPointId: z.string().optional(),
    packetaPointName: z.string().optional(),

    // Shipping address (required when shippingMethod = PRAGUE_DELIVERY or PACKETA_ADDRESS)
    shippingStreet: z.string().optional(),
    shippingCity: z.string().optional(),
    shippingZip: z.string().optional(),

    // Payment method
    paymentMethod: paymentMethodEnum,

    // Required consents
    ageVerified: z.literal(true, {
      errorMap: () => ({
        message:
          "Musíte potvrdit, že vám je 18 let",
      }),
    }),
    termsAccepted: z.literal(true, {
      errorMap: () => ({
        message:
          "Musíte souhlasit s obchodními podmínkami",
      }),
    }),
    privacyAccepted: z.literal(true, {
      errorMap: () => ({
        message:
          "Musíte souhlasit se zpracováním osobních údajů",
      }),
    }),

    // Optional
    note: z.string().max(500, "Poznámka je příliš dlouhá").optional(),

    // Cart items
    items: z
      .array(
        z.object({
          productSlug: z.string(),
          quantity: z
            .number()
            .int()
            .positive("Množství musí být alespoň 1")
            .max(10, "Maximální množství je 10"),
        })
      )
      .min(1, "Košík je prázdný"),
  })
  .superRefine((data, ctx) => {
    // Validate Packeta pickup point is selected
    if (
      data.shippingMethod === "PACKETA_PICKUP" &&
      !data.packetaPointId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vyberte výdejní místo Zásilkovny",
        path: ["packetaPointId"],
      });
    }

    // Validate shipping address for address-based delivery
    if (
      data.shippingMethod === "PRAGUE_DELIVERY" ||
      data.shippingMethod === "PACKETA_ADDRESS"
    ) {
      if (!data.shippingStreet || data.shippingStreet.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Zadejte ulici doručení",
          path: ["shippingStreet"],
        });
      }
      if (!data.shippingCity || data.shippingCity.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Zadejte město doručení",
          path: ["shippingCity"],
        });
      }
      if (
        !data.shippingZip ||
        !/^[0-9]{3}\s?[0-9]{2}$/.test(data.shippingZip)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Zadejte platné PSČ doručení",
          path: ["shippingZip"],
        });
      }
    }
  });

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

// ─── Cart Item Schema (for API validation) ────────────────────────

export const cartItemSchema = z.object({
  productSlug: z.string(),
  quantity: z.number().int().positive().max(10),
});

export type CartItemData = z.infer<typeof cartItemSchema>;

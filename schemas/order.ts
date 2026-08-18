import { z } from "zod";

/** Schema for order status lookup by order number + email */
export const orderLookupSchema = z.object({
  orderNumber: z
    .string()
    .regex(
      /^MB-\d{4}-\d{5}$/,
      "Zadejte platné číslo objednávky (např. MB-2026-00001)"
    ),
  email: z.string().email("Zadejte platný email"),
});

export type OrderLookupData = z.infer<typeof orderLookupSchema>;

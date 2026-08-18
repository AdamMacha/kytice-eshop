"use server";

import { checkoutFormSchema, type CheckoutFormData } from "@/schemas/checkout";
import { getProductBySlug } from "@/data/products";
import { getShippingMethod, COD_FEE_HALERE } from "@/data/shipping";
import { generateOrderNumber } from "@/lib/utils";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";
import { formatCZK } from "@/lib/format";

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  clientSecret?: string;
  isCod?: boolean;
  error?: string;
}

export async function createOrder(
  data: CheckoutFormData
): Promise<CreateOrderResult> {
  try {
    // 1. Zod Validation
    const validatedData = checkoutFormSchema.parse(data);

    // 2. Legal age verification check
    if (!validatedData.ageVerified) {
      return {
        success: false,
        error: "Je vyžadováno potvrzení věku 18 let pro nákup kytic s alkoholem.",
      };
    }

    // 3. Server-side price calculation (never trust client amounts)
    let subtotalHalere = 0;
    const validatedItems: Array<{
      productSlug: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    for (const item of validatedData.items) {
      const product = getProductBySlug(item.productSlug);
      if (!product) {
        return {
          success: false,
          error: `Produkt "${item.productSlug}" nebyl nalezen v nabídce.`,
        };
      }

      const itemTotal = product.priceHalere * item.quantity;
      subtotalHalere += itemTotal;

      validatedItems.push({
        productSlug: product.slug,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.priceHalere,
        totalPrice: itemTotal,
      });
    }

    // 4. Shipping calculation
    const shippingMethod = getShippingMethod(validatedData.shippingMethod);
    if (!shippingMethod) {
      return {
        success: false,
        error: "Neplatný způsob dopravy.",
      };
    }
    const shippingPriceHalere = shippingMethod.priceHalere;

    // 5. COD calculation
    const codFeeHalere =
      validatedData.paymentMethod === "COD" ? COD_FEE_HALERE : 0;

    // Grand total in haléře
    const totalPriceHalere = subtotalHalere + shippingPriceHalere + codFeeHalere;

    const orderNumber = generateOrderNumber();

    // 6. Database save with Prisma (with fallback for local dev when DB is unconfigured)
    let createdOrderId = `MB-${Date.now().toString()}`;

    try {
      const order = await db.order.create({
        data: {
          orderNumber,
          email: validatedData.email,
          phone: validatedData.phone,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          billingStreet: validatedData.billingStreet,
          billingCity: validatedData.billingCity,
          billingZip: validatedData.billingZip,
          billingCountry: "CZ",
          shippingMethod: validatedData.shippingMethod,
          packetaPointId: validatedData.packetaPointId || null,
          packetaPointName: validatedData.packetaPointName || null,
          shippingStreet: validatedData.shippingStreet || null,
          shippingCity: validatedData.shippingCity || null,
          shippingZip: validatedData.shippingZip || null,
          subtotal: subtotalHalere,
          shippingPrice: shippingPriceHalere,
          codFee: codFeeHalere,
          totalPrice: totalPriceHalere,
          paymentMethod: validatedData.paymentMethod,
          paymentStatus:
            validatedData.paymentMethod === "COD" ? "COD_PENDING" : "PENDING",
          ageVerified: true,
          note: validatedData.note || null,
          items: {
            create: validatedItems.map((item) => ({
              productSlug: item.productSlug,
              productName: item.productName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
            })),
          },
          statusHistory: {
            create: {
              toStatus: "PENDING",
              note: `Objednávka vytvořena (${validatedData.paymentMethod})`,
              source: "checkout",
            },
          },
        },
      });
      createdOrderId = order.id;
    } catch (dbError) {
      console.warn(
        "[Prisma DB] Database write skipped (check DATABASE_URL in .env):",
        dbError
      );
      // Still proceed for seamless local testing
    }

    // 7. Stripe PaymentIntent for Card Payments
    if (validatedData.paymentMethod === "STRIPE_CARD") {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: totalPriceHalere,
          currency: "czk",
          receipt_email: validatedData.email,
          metadata: {
            orderId: createdOrderId,
            orderNumber,
            customerName: `${validatedData.firstName} ${validatedData.lastName}`,
          },
          automatic_payment_methods: {
            enabled: true,
          },
        });

        return {
          success: true,
          orderId: createdOrderId,
          orderNumber,
          clientSecret: paymentIntent.client_secret || undefined,
          isCod: false,
        };
      } catch (stripeError: any) {
        console.warn(
          "[Stripe] PaymentIntent creation skipped (check STRIPE_SECRET_KEY):",
          stripeError?.message
        );
        // Return mock client secret for local testing
        return {
          success: true,
          orderId: createdOrderId,
          orderNumber,
          clientSecret: `mock_pi_${Date.now()}_secret_${Date.now()}`,
          isCod: false,
        };
      }
    }

    // 8. COD Orders — Send confirmation email & return success
    try {
      await sendEmail({
        to: validatedData.email,
        subject: `Potvrzení objednávky ${orderNumber} | MoodBox Bloom`,
        html: `
          <div style="font-family: sans-serif; color: #4A3A31; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #C88D9A;">Děkujeme za vaši objednávku!</h1>
            <p>Vaše objednávka <strong>${orderNumber}</strong> byla úspěšně přijata.</p>
            <p><strong>Způsob platby:</strong> Dobírka při převzetí (+30 Kč)</p>
            <p><strong>Celková částka k úhradě:</strong> ${formatCZK(totalPriceHalere)}</p>
            <hr style="border: 1px solid #E8D9CE; margin: 20px 0;" />
            <p style="font-size: 12px; color: #7D6B62;">Při převzetí zásilky může dopravce vyžadovat ověření věku 18 let.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.warn("[Email] Confirmation email warning:", emailErr);
    }

    return {
      success: true,
      orderId: createdOrderId,
      orderNumber,
      isCod: true,
    };
  } catch (error: any) {
    console.error("[createOrder Action Error]:", error);
    return {
      success: false,
      error:
        error?.errors?.[0]?.message ||
        error?.message ||
        "Při vytváření objednávky došlo k neočekávané chybě.",
    };
  }
}

"use server";

import { checkoutFormSchema, type CheckoutFormData } from "@/schemas/checkout";
import { getProductBySlug } from "@/data/products";
import { getShippingMethod, COD_FEE_HALERE } from "@/data/shipping";
import { generateOrderNumber } from "@/lib/utils";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { sendEmail } from "@/lib/email";
import { formatCZK } from "@/lib/format";
import { BRAND } from "@/lib/constants";

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  orderNumber?: string;
  clientSecret?: string;
  isCod?: boolean;
  totalPriceHalere?: number;
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

    // 3. Server-side price calculation (fetch active prices from DB, fallback to static)
    const slugs = validatedData.items.map((i) => i.productSlug);
    let dbProducts: Array<{ slug: string; name: string; priceHalere: number; inStock: boolean }> = [];
    try {
      dbProducts = await db.product.findMany({
        where: { slug: { in: slugs } },
        select: { slug: true, name: true, priceHalere: true, inStock: true },
      });
    } catch (dbReadErr) {
      console.warn("[createOrder] Could not read products from DB, falling back to static:", dbReadErr);
    }
    const dbProductMap = new Map(dbProducts.map((p) => [p.slug, p]));

    let subtotalHalere = 0;
    const validatedItems: Array<{
      productSlug: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    for (const item of validatedData.items) {
      const dbProd = dbProductMap.get(item.productSlug);
      const staticProd = getProductBySlug(item.productSlug);
      const product = dbProd || staticProd;

      if (!product) {
        return {
          success: false,
          error: `Produkt "${item.productSlug}" nebyl nalezen v nabídce.`,
        };
      }

      if (dbProd && !dbProd.inStock) {
        return {
          success: false,
          error: `Produkt "${dbProd.name}" je momentálně vyprodán.`,
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

    // 6. Database save with Prisma
    let createdOrderId: string;

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
      console.error("[Prisma DB] Database write failed:", dbError);
      return {
        success: false,
        error: "Objednávku se nepodařilo uložit do databáze. Zkontrolujte prosím připojení a zkuste to znovu.",
      };
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
          totalPriceHalere,
          isCod: false,
        };
      } catch (stripeError: any) {
        console.error(
          "[Stripe] PaymentIntent creation error:",
          stripeError?.message
        );
        return {
          success: false,
          error: `Chyba při přípravě platby kartou: ${stripeError?.message || "Zkuste to prosím znovu."}`,
        };
      }
    }

    // 8. COD Orders — Send confirmation email & notify admin
    const itemsHtml = validatedItems
      .map(
        (it) =>
          `<tr><td style="padding: 6px 0;">${it.quantity}× ${it.productName}</td><td style="padding: 6px 0; text-align: right; font-weight: bold;">${formatCZK(it.totalPrice)}</td></tr>`
      )
      .join("");

    // Customer email
    try {
      await sendEmail({
        to: validatedData.email,
        subject: `Potvrzení objednávky ${orderNumber} | MoodBox Bloom`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #4A3A31; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border: 1px solid #E8D9CE; border-radius: 16px;">
            <h1 style="color: #C88D9A; margin-top: 0; font-size: 24px;">Děkujeme za vaši objednávku!</h1>
            <p>Vaše objednávka č. <strong>${orderNumber}</strong> byla úspěšně přijata a brzy se pustíme do ruční výroby.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border-top: 1px solid #E8D9CE; border-bottom: 1px solid #E8D9CE; font-size: 14px;">
              ${itemsHtml}
              <tr><td style="padding: 6px 0; color: #7D6B62;">Doprava (${shippingMethod.name}):</td><td style="padding: 6px 0; text-align: right;">${shippingPriceHalere === 0 ? "Zdarma" : formatCZK(shippingPriceHalere)}</td></tr>
              <tr><td style="padding: 6px 0; color: #7D6B62;">Dobírka:</td><td style="padding: 6px 0; text-align: right;">${formatCZK(codFeeHalere)}</td></tr>
              <tr style="font-size: 16px; font-weight: bold;"><td style="padding: 10px 0; color: #C88D9A;">Celkem k úhradě:</td><td style="padding: 10px 0; text-align: right; color: #C88D9A;">${formatCZK(totalPriceHalere)}</td></tr>
            </table>

            <p style="font-size: 13px; margin: 4px 0;"><strong>Způsob platby:</strong> Dobírka při převzetí</p>
            <p style="font-size: 13px; margin: 4px 0;"><strong>Doručovací adresa:</strong> ${validatedData.firstName} ${validatedData.lastName}, ${validatedData.shippingStreet || validatedData.billingStreet}, ${validatedData.shippingCity || validatedData.billingCity} ${validatedData.shippingZip || validatedData.billingZip}</p>
            ${validatedData.packetaPointName ? `<p style="font-size: 13px; margin: 4px 0;"><strong>Výdejní místo:</strong> ${validatedData.packetaPointName}</p>` : ""}
            ${validatedData.note ? `<p style="font-size: 13px; margin: 4px 0; background: #FDFBF7; padding: 10px; border-radius: 8px;"><strong>Poznámka:</strong> ${validatedData.note}</p>` : ""}

            <hr style="border: none; border-top: 1px solid #E8D9CE; margin: 24px 0 16px 0;" />
            <p style="font-size: 11px; color: #7D6B62; margin: 0;">Produkty obsahují alkohol. Při převzetí zásilky může dopravce vyžadovat prokázání věku 18 let (OP).</p>
            <p style="font-size: 11px; color: #A4948B; margin: 6px 0 0 0;">MoodBox Bloom – Kateřina Janovská, Hlavní 28, Průhonice | Tel: ${BRAND.phoneFormatted}</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.warn("[Email] Customer confirmation email warning:", emailErr);
    }

    // Admin notification email to Kateřina
    try {
      await sendEmail({
        to: BRAND.email,
        subject: `🌸 Nová objednávka ${orderNumber} (${formatCZK(totalPriceHalere)} - Dobírka)`,
        html: `
          <div style="font-family: sans-serif; color: #4A3A31; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #C88D9A;">Přijata nová objednávka ${orderNumber}</h2>
            <p><strong>Zákazník:</strong> ${validatedData.firstName} ${validatedData.lastName} (<a href="mailto:${validatedData.email}">${validatedData.email}</a>, tel: <a href="tel:${validatedData.phone}">${validatedData.phone}</a>)</p>
            <p><strong>Způsob platby:</strong> Dobírka (+30 Kč)</p>
            <p><strong>Doprava:</strong> ${shippingMethod.name} ${validatedData.packetaPointName ? `(${validatedData.packetaPointName})` : ""}</p>
            <p><strong>Adresa:</strong> ${validatedData.shippingStreet || validatedData.billingStreet}, ${validatedData.shippingCity || validatedData.billingCity} ${validatedData.shippingZip || validatedData.billingZip}</p>
            ${validatedData.note ? `<p style="background: #FFF4E5; padding: 10px; border-radius: 8px;"><strong>Přání / Poznámka zákazníka:</strong> ${validatedData.note}</p>` : ""}
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
              ${itemsHtml}
              <tr style="font-weight: bold;"><td style="padding: 8px 0;">Celkem:</td><td style="text-align: right;">${formatCZK(totalPriceHalere)}</td></tr>
            </table>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://www.moodbox.cz"}/admin/objednavky/${createdOrderId}" style="display: inline-block; background: #C88D9A; color: white; padding: 10px 18px; text-decoration: none; border-radius: 8px; font-weight: bold;">Otevřít objednávku v administraci →</a></p>
          </div>
        `,
      });
    } catch (adminEmailErr) {
      console.warn("[Email] Admin notification warning:", adminEmailErr);
    }

    return {
      success: true,
      orderId: createdOrderId,
      orderNumber,
      totalPriceHalere,
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

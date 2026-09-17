import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { formatCZK } from "@/lib/format";
import { BRAND } from "@/lib/constants";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !signature) {
    console.warn(
      "[Stripe Webhook] Missing secret or signature. Bypassing in dev mode."
    );
    return NextResponse.json({ received: true });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`[Stripe Webhook Error]: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle relevant events
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata?.orderId;
      const orderNumber = paymentIntent.metadata?.orderNumber;

      if (orderId) {
        try {
          await db.order.update({
            where: { id: orderId },
            data: {
              status: "PAID",
              paymentStatus: "PAID",
              paidAt: new Date(),
              statusHistory: {
                create: {
                  fromStatus: "PENDING",
                  toStatus: "PAID",
                  note: `Platba kartou Stripe potvrzena (${paymentIntent.id})`,
                  source: "stripe_webhook",
                },
              },
            },
          });

          // Send confirmation email
          if (paymentIntent.receipt_email) {
            await sendEmail({
              to: paymentIntent.receipt_email,
              subject: `Platba přijata – Objednávka ${orderNumber || orderId} | MoodBox Bloom`,
              html: `
                <div style="font-family: sans-serif; color: #4A3A31; max-width: 600px; margin: 0 auto;">
                  <h1 style="color: #C88D9A;">Platba byla úspěšně přijata!</h1>
                  <p>Vaše platba ve výši <strong>${formatCZK(paymentIntent.amount)}</strong> byla potvrzena.</p>
                  <p>Objednávka č. <strong>${orderNumber || orderId}</strong> je nyní v přípravě.</p>
                  <hr style="border: 1px solid #E8D9CE; margin: 20px 0;" />
                  <p style="font-size: 12px; color: #7D6B62;">MoodBox Bloom – Originální sladké kytice</p>
                </div>
              `,
            });
          }

          // Send admin notification to Kateřina
          try {
            await sendEmail({
              to: BRAND.email,
              subject: `💳 Zaplaceno: Objednávka ${orderNumber || orderId} (${formatCZK(paymentIntent.amount)} - Karta)`,
              html: `
                <div style="font-family: sans-serif; color: #4A3A31; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #C88D9A;">Platba kartou přijata!</h2>
                  <p>Objednávka č. <strong>${orderNumber || orderId}</strong> byla úspěšně uhrazena přes Stripe.</p>
                  <p><strong>Částka:</strong> ${formatCZK(paymentIntent.amount)}</p>
                  <p><strong>Zákazník:</strong> ${paymentIntent.metadata?.customerName || "N/A"} (${paymentIntent.receipt_email || ""})</p>
                  <p style="margin-top: 20px;"><a href="${process.env.NEXT_PUBLIC_APP_URL || "https://www.moodbox.cz"}/admin/objednavky/${orderId}" style="display: inline-block; background: #C88D9A; color: white; padding: 10px 18px; text-decoration: none; border-radius: 8px; font-weight: bold;">Zobrazit objednávku v administraci →</a></p>
                </div>
              `,
            });
          } catch (adminErr) {
            console.warn("[Stripe Webhook] Admin notification email warning:", adminErr);
          }
        } catch (dbErr) {
          console.error("[Stripe Webhook DB Error]:", dbErr);
        }
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata?.orderId;

      if (orderId) {
        try {
          await db.order.update({
            where: { id: orderId },
            data: {
              paymentStatus: "FAILED",
              statusHistory: {
                create: {
                  toStatus: "PENDING",
                  note: `Platba kartou selhala: ${paymentIntent.last_payment_error?.message || "Neznámá chyba"}`,
                  source: "stripe_webhook",
                },
              },
            },
          });
        } catch (dbErr) {
          console.error("[Stripe Webhook DB Error]:", dbErr);
        }
      }
      break;
    }

    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

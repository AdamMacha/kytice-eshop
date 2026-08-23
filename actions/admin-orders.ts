"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { createPacketaPacket } from "@/lib/packeta";
import { sendEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/types/order";

export async function updateOrderStatusAction({
  orderId,
  newStatus,
  note,
}: {
  orderId: string;
  newStatus: OrderStatus;
  note?: string;
}) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "Neautorizovaný přístup." };
  }

  try {
    const existingOrder = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return { success: false, error: "Objednávka nebyla nalezena." };
    }

    const updated = await db.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        statusHistory: {
          create: {
            fromStatus: existingOrder.status,
            toStatus: newStatus,
            note: note || `Změna stavu na ${newStatus} administrátorem`,
            source: "admin",
          },
        },
        ...(newStatus === "PAID" ? { paidAt: new Date(), paymentStatus: "PAID" } : {}),
        ...(newStatus === "SHIPPED" ? { shippedAt: new Date() } : {}),
        ...(newStatus === "DELIVERED" ? { deliveredAt: new Date(), paymentStatus: existingOrder.paymentMethod === "COD" ? "COD_COLLECTED" : existingOrder.paymentStatus } : {}),
        ...(newStatus === "CANCELLED" ? { cancelledAt: new Date() } : {}),
      },
    });

    // Optional email notification on shipment
    if (newStatus === "SHIPPED") {
      try {
        await sendEmail({
          to: existingOrder.email,
          subject: `Vaše kytice je na cestě! – Objednávka ${existingOrder.orderNumber} | MoodBox Bloom`,
          html: `
            <div style="font-family: sans-serif; color: #4A3A31; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #C88D9A;">Vaše kytice byla odeslána!</h1>
              <p>Dobrý den ${existingOrder.firstName},</p>
              <p>s radostí vám oznamujeme, že vaše objednávka <strong>${existingOrder.orderNumber}</strong> byla předána k doručení.</p>
              ${
                existingOrder.trackingUrl
                  ? `<p><a href="${existingOrder.trackingUrl}" style="background-color: #C88D9A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 20px; display: inline-block;">Sledovat zásilku</a></p>`
                  : ""
              }
              <hr style="border: 1px solid #E8D9CE; margin: 20px 0;" />
              <p style="font-size: 12px; color: #7D6B62;">MoodBox Bloom – Originální sladké kytice</p>
            </div>
          `,
        });
      } catch (emailErr) {
        console.warn("[Admin] Email error:", emailErr);
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/objednavky");
    revalidatePath(`/admin/objednavky/${orderId}`);
    return { success: true };
  } catch (error: any) {
    console.error("[Admin Order Status Error]:", error);
    return { success: false, error: error.message || "Chyba při ukládání stavu." };
  }
}

export async function createPacketaShipmentForOrderAction(orderId: string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "Neautorizovaný přístup." };
  }

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return { success: false, error: "Objednávka nebyla nalezena." };
    }

    const packetaResponse = await createPacketaPacket({
      number: order.orderNumber,
      name: order.firstName,
      surname: order.lastName,
      email: order.email,
      phone: order.phone,
      addressId: order.packetaPointId ? parseInt(order.packetaPointId, 10) || undefined : undefined,
      street: order.shippingStreet || order.billingStreet,
      city: order.shippingCity || order.billingCity,
      zip: order.shippingZip || order.billingZip,
      value: order.totalPrice / 100,
      weight: 1.0,
      cod: order.paymentMethod === "COD" ? order.totalPrice / 100 : 0,
      eshop: "MoodBox Bloom",
    });

    await db.order.update({
      where: { id: orderId },
      data: {
        status: "SHIPPED",
        shippedAt: new Date(),
        packetaPacketId: packetaResponse.id,
        packetaBarcode: packetaResponse.barcode,
        trackingUrl: packetaResponse.trackingUrl,
        statusHistory: {
          create: {
            fromStatus: order.status,
            toStatus: "SHIPPED",
            note: `Vytvořena zásilka Zásilkovny č. ${packetaResponse.barcode}`,
            source: "admin_packeta",
          },
        },
      },
    });

    revalidatePath("/admin");
    revalidatePath(`/admin/objednavky/${orderId}`);
    return {
      success: true,
      barcode: packetaResponse.barcode,
      trackingUrl: packetaResponse.trackingUrl,
    };
  } catch (error: any) {
    console.error("[Admin Packeta Creation Error]:", error);
    return { success: false, error: error.message || "Chyba při vytváření zásilky." };
  }
}

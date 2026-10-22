import { NextResponse } from "next/server";
import { generateInvoice } from "@/lib/pdf";
import { db } from "@/lib/db";
import { BRAND } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const storeSetting = (await db.storeSetting.findFirst()) || {
    storeName: BRAND.owner,
    address: BRAND.address,
    ico: BRAND.ico,
    email: BRAND.email,
    phone: BRAND.phone,
  };

  const mockOrder = {
    orderNumber: "MB-2026-32518",
    createdAt: new Date(),
    firstName: "Kateřina",
    lastName: "Janovská",
    billingStreet: "Hlavní 28",
    billingCity: "Průhonice",
    billingZip: "252 43",
    billingCountry: "CZ",
    email: "katerina.janovska@nadaniadovednosti.cz",
    phone: "776 208 814",
    paymentMethod: "STRIPE_CARD",
    shippingMethod: "PRAGUE_DELIVERY",
    shippingPrice: 0,
    codFee: 0,
    totalPrice: 1500,
    items: [
      {
        productName: "Blue Dream",
        quantity: 1,
        unitPrice: 1500,
        totalPrice: 1500,
      },
    ],
  };

  const pdfBuffer = await generateInvoice(mockOrder, storeSetting);

  return new NextResponse(pdfBuffer as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="test-faktura.pdf"',
    },
  });
}

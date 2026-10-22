import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { generateInvoice } from "@/lib/pdf";
import { BRAND } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const order = await db.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) {
    return new NextResponse("Objednávka nebyla nalezena", { status: 404 });
  }

  const storeSetting = (await db.storeSetting.findFirst()) || {
    storeName: BRAND.owner,
    address: BRAND.address,
    ico: BRAND.ico,
    email: BRAND.email,
    phone: BRAND.phone,
  };

  const pdfBuffer = await generateInvoice(order, storeSetting);

  return new NextResponse(pdfBuffer as any, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="Faktura_${order.orderNumber}.pdf"`,
    },
  });
}

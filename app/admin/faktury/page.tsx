import React from "react";
import type { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { InvoiceListClient } from "./invoice-list-client";

export const metadata: Metadata = {
  title: "Faktury | Administrace MoodBox Bloom",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  let orders: any[] = [];
  try {
    orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
  } catch {
    orders = [];
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest text-[#A87938] font-bold">
          Administrace
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#4A3A31]">
          Vystavené faktury a daňové doklady
        </h1>
        <p className="text-xs text-[#7D6B62] mt-1">
          Přehled, vyhledávání a okamžité stažení všech vystavených faktur k objednávkám
        </p>
      </div>

      <InvoiceListClient initialOrders={orders} />
    </div>
  );
}

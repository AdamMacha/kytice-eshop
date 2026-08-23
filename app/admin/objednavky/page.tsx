import React from "react";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { OrderFilterClient } from "./order-filter-client";

export default async function AdminOrdersPage() {
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
          Správa objednávek
        </h1>
        <p className="text-xs text-[#7D6B62] mt-1">
          Přehled všech přijatých objednávek, stav plateb a expedice kytic
        </p>
      </div>

      <OrderFilterClient initialOrders={orders} />
    </div>
  );
}

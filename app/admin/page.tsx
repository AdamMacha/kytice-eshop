import React from "react";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatCZK, formatDateTime } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/types/order";
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Eye,
  Truck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  let orders: any[] = [];
  try {
    orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
      take: 20,
    });
  } catch {
    orders = [];
  }

  // Calculate KPIs
  const totalOrders = orders.length;
  const totalRevenueHalere = orders
    .filter((o) => o.status === "PAID" || o.status === "DELIVERED")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const pendingOrders = orders.filter(
    (o) =>
      o.status === "PENDING" ||
      o.status === "AWAITING_PAYMENT" ||
      o.status === "PROCESSING"
  );
  const shippedOrders = orders.filter(
    (o) => o.status === "SHIPPED" || o.status === "DELIVERED"
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#A87938] font-bold">
            Administrace
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#4A3A31]">
            Přehled e-shopu MoodBox Bloom
          </h1>
        </div>
        <Link href="/admin/objednavky">
          <Button variant="primary" size="sm">
            Zobrazit všechny objednávky
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Revenue */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7D6B62] uppercase tracking-wider">
              Tržby celkem
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#4A3A31]">
            {formatCZK(totalRevenueHalere)}
          </p>
          <p className="text-[11px] text-[#A4948B]">Zaplacené a doručené objednávky</p>
        </div>

        {/* Card 2: Total Orders */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7D6B62] uppercase tracking-wider">
              Objednávky celkem
            </span>
            <div className="w-9 h-9 rounded-2xl bg-[#F9ECEF] text-[#C88D9A] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#4A3A31]">
            {totalOrders}
          </p>
          <p className="text-[11px] text-[#A4948B]">Všech vytvořených objednávek</p>
        </div>

        {/* Card 3: Pending/Processing */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7D6B62] uppercase tracking-wider">
              K výrobě a odeslání
            </span>
            <div className="w-9 h-9 rounded-2xl bg-[#FBF6EE] text-[#D4AF7F] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#C88D9A]">
            {pendingOrders.length}
          </p>
          <p className="text-[11px] text-[#A4948B]">Čekající na výrobu či platbu</p>
        </div>

        {/* Card 4: Shipped */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#7D6B62] uppercase tracking-wider">
              Odesláno / Doručeno
            </span>
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#4A3A31]">
            {shippedOrders.length}
          </p>
          <p className="text-[11px] text-[#A4948B]">Vyřízených zásilek</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E8D9CE] shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#4A3A31]">
            Poslední objednávky
          </h3>
          <Link
            href="/admin/objednavky"
            className="text-xs font-semibold text-[#C88D9A] hover:underline"
          >
            Spravovat všechny →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F3E7DF] text-[#A4948B] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-[#4A3A31]">
              Zatím nebyly vytvořeny žádné objednávky
            </p>
            <p className="text-xs text-[#7D6B62]">
              Jakmile zákazník dokončí nákup v pokladně, zobrazí se zde.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F0E4DC] text-[#7D6B62] uppercase tracking-wider">
                  <th className="py-3 px-3">Číslo</th>
                  <th className="py-3 px-3">Datum</th>
                  <th className="py-3 px-3">Zákazník</th>
                  <th className="py-3 px-3">Položky</th>
                  <th className="py-3 px-3">Doprava</th>
                  <th className="py-3 px-3">Částka</th>
                  <th className="py-3 px-3">Stav</th>
                  <th className="py-3 px-3 text-right">Akce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E4DC]">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FDFBF7] transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-[#4A3A31]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-3 text-[#7D6B62]">
                      {formatDateTime(new Date(order.createdAt))}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold block text-[#4A3A31]">
                        {order.firstName} {order.lastName}
                      </span>
                      <span className="text-[11px] text-[#7D6B62]">
                        {order.phone}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      {order.items?.map((item: any) => (
                        <span key={item.id} className="block text-[11px]">
                          {item.quantity}× {item.productName}
                        </span>
                      ))}
                    </td>
                    <td className="py-3.5 px-3 text-[11px]">
                      {order.shippingMethod === "PRAGUE_DELIVERY"
                        ? "Praha (Osobní)"
                        : order.shippingMethod === "PACKETA_PICKUP"
                        ? "Zásilkovna (Výdej)"
                        : "Zásilkovna (Adresa)"}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#4A3A31]">
                      {formatCZK(order.totalPrice)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          ORDER_STATUS_COLORS[
                            order.status as keyof typeof ORDER_STATUS_COLORS
                          ] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {ORDER_STATUS_LABELS[
                          order.status as keyof typeof ORDER_STATUS_LABELS
                        ] || order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link href={`/admin/objednavky/${order.id}`}>
                        <Button variant="outline" size="sm" className="text-xs py-1 px-3">
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Detail
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

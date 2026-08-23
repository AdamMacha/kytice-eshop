import React from "react";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatCZK, formatDateTime } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/types/order";
import { OrderDetailAdminClient } from "./order-detail-admin-client";
import {
  ArrowLeft,
  User,
  MapPin,
  CreditCard,
  Truck,
  MessageSquare,
  Clock,
  Wine,
} from "lucide-react";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const { id } = await params;

  let order: any = null;
  try {
    order = await db.order.findUnique({
      where: { id },
      include: {
        items: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch {
    order = null;
  }

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Back button & Title */}
      <div className="space-y-3">
        <Link
          href="/admin/objednavky"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7D6B62] hover:text-[#C88D9A] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Zpět na přehled všech objednávek</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8D9CE] pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-3xl font-bold text-[#4A3A31]">
                Objednávka {order.orderNumber}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  ORDER_STATUS_COLORS[
                    order.status as keyof typeof ORDER_STATUS_COLORS
                  ] || "bg-gray-100 text-gray-800"
                }`}
              >
                {ORDER_STATUS_LABELS[
                  order.status as keyof typeof ORDER_STATUS_LABELS
                ] || order.status}
              </span>
            </div>
            <p className="text-xs text-[#7D6B62] mt-1">
              Vytvořeno: {formatDateTime(new Date(order.createdAt))}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#7D6B62] uppercase tracking-wider block">
              Celková částka
            </span>
            <span className="text-2xl font-bold text-[#C88D9A]">
              {formatCZK(order.totalPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Admin interactive controls */}
      <OrderDetailAdminClient order={order} />

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Customer & Addresses & Note */}
        <div className="lg:col-span-6 space-y-6">
          {/* Customer info card */}
          <div className="p-6 bg-white rounded-3xl border border-[#E8D9CE] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#4A3A31]">
              <User className="w-4 h-4 text-[#C88D9A]" />
              <span>Zákazník</span>
            </div>
            <div className="space-y-1 text-xs text-[#7D6B62]">
              <p className="font-bold text-sm text-[#4A3A31]">
                {order.firstName} {order.lastName}
              </p>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${order.email}`}
                  className="text-[#C88D9A] underline"
                >
                  {order.email}
                </a>
              </p>
              <p>
                Telefon:{" "}
                <a
                  href={`tel:${order.phone}`}
                  className="text-[#C88D9A] underline"
                >
                  {order.phone}
                </a>
              </p>
              <p className="pt-1 text-[11px] text-emerald-700 font-semibold">
                ✓ Potvrzeno plnoletost 18+ při objednávce
              </p>
            </div>
          </div>

          {/* Delivery & Billing Address */}
          <div className="p-6 bg-white rounded-3xl border border-[#E8D9CE] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#4A3A31]">
              <MapPin className="w-4 h-4 text-[#D4AF7F]" />
              <span>Adresy a doručení</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#7D6B62]">
              <div>
                <p className="font-bold text-[#4A3A31] mb-1">
                  Fakturační adresa:
                </p>
                <p>{order.billingStreet}</p>
                <p>
                  {order.billingZip} {order.billingCity}
                </p>
                <p>{order.billingCountry}</p>
              </div>

              <div>
                <p className="font-bold text-[#4A3A31] mb-1">
                  Způsob dopravy:
                </p>
                <p className="font-semibold text-[#4A3A31]">
                  {order.shippingMethod === "PRAGUE_DELIVERY"
                    ? "Doručení po Praze (Osobní)"
                    : order.shippingMethod === "PACKETA_PICKUP"
                    ? "Zásilkovna – Výdejní místo"
                    : "Zásilkovna – Doručení na adresu"}
                </p>
                {order.packetaPointName && (
                  <p className="text-[11px] text-[#C88D9A] mt-1">
                    Výdejní místo: {order.packetaPointName}
                  </p>
                )}
                {order.shippingStreet && (
                  <p className="text-[11px] text-[#7D6B62] mt-1">
                    Doručovací adresa: {order.shippingStreet},{" "}
                    {order.shippingZip} {order.shippingCity}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Customer customization note */}
          {order.note && (
            <div className="p-6 bg-[#FBF6EE] rounded-3xl border border-[#E6C89C] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#A87938]">
                <MessageSquare className="w-4 h-4" />
                <span>Poznámka od zákazníka (přání na míru):</span>
              </div>
              <p className="text-xs text-[#4A3A31] italic font-medium leading-relaxed">
                &bdquo;{order.note}&ldquo;
              </p>
            </div>
          )}
        </div>

        {/* Right Col: Ordered items & Payment & History */}
        <div className="lg:col-span-6 space-y-6">
          {/* Ordered items breakdown */}
          <div className="p-6 bg-white rounded-3xl border border-[#E8D9CE] shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[#4A3A31]">
              Položky kytice
            </h3>
            <div className="space-y-3">
              {order.items?.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-[#F0E4DC] text-xs"
                >
                  <div>
                    <span className="font-bold text-[#4A3A31]">
                      {item.productName}
                    </span>
                    <span className="text-[#7D6B62] block text-[11px]">
                      {item.quantity} ks × {formatCZK(item.unitPrice)}
                    </span>
                  </div>
                  <span className="font-bold text-[#4A3A31]">
                    {formatCZK(item.totalPrice)}
                  </span>
                </div>
              ))}

              <div className="space-y-1.5 pt-2 text-xs text-[#7D6B62]">
                <div className="flex justify-between">
                  <span>Mezisoučet:</span>
                  <span>{formatCZK(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Doprava:</span>
                  <span>{formatCZK(order.shippingPrice)}</span>
                </div>
                {order.codFee > 0 && (
                  <div className="flex justify-between text-[#C88D9A]">
                    <span>Dobírka:</span>
                    <span>{formatCZK(order.codFee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-[#4A3A31] pt-2 border-t border-[#E8D9CE]">
                  <span>Celkem:</span>
                  <span className="text-[#C88D9A]">
                    {formatCZK(order.totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status audit history */}
          <div className="p-6 bg-white rounded-3xl border border-[#E8D9CE] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#4A3A31]">
              <Clock className="w-4 h-4 text-[#A87938]" />
              <span>Historie změn stavu</span>
            </div>

            <div className="space-y-3">
              {order.statusHistory?.length === 0 ? (
                <p className="text-xs text-[#7D6B62]">
                  Žádná zaznamenaná historie.
                </p>
              ) : (
                order.statusHistory?.map((log: any) => (
                  <div
                    key={log.id}
                    className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E8D9CE]/60 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#4A3A31]">
                        {log.toStatus}
                      </span>
                      <span className="text-[10px] text-[#A4948B]">
                        {formatDateTime(new Date(log.createdAt))}
                      </span>
                    </div>
                    {log.note && (
                      <p className="text-[#7D6B62] text-[11px]">{log.note}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

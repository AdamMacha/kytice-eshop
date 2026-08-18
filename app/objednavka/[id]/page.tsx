import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatCZK, formatDateTime } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/types/order";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  Wine,
  ExternalLink,
} from "lucide-react";

interface OrderTrackingPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Sledování stavu objednávky",
  description: "Zkontrolujte aktuální stav vaší objednávky v e-shopu MoodBox Bloom.",
};

export default async function OrderTrackingPage({
  params,
}: OrderTrackingPageProps) {
  const { id } = await params;

  let order: any = null;
  try {
    order = await db.order.findUnique({
      where: { id },
      include: { items: true },
    });
  } catch {
    // Local dev mock fallback
    order = null;
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="font-serif text-2xl font-bold text-[#4A3A31]">
          Sledování objednávky
        </h1>
        <p className="text-xs text-[#7D6B62]">
          Objednávka s ID <strong>{id}</strong> se připravuje nebo byla
          vytvořena v testovacím režimu.
        </p>
        <Link href={ROUTES.home}>
          <Button variant="primary">Návrat na hlavní stránku</Button>
        </Link>
      </div>
    );
  }

  const steps = [
    { key: "PENDING", label: "Objednáno" },
    { key: "PAID", label: "Zaplaceno" },
    { key: "PROCESSING", label: "Připravuje se" },
    { key: "SHIPPED", label: "Odesláno" },
    { key: "DELIVERED", label: "Doručeno" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8D9CE] pb-6">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-widest text-[#A87938] font-bold">
            Stav objednávky
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#4A3A31]">
            Objednávka {order.orderNumber}
          </h1>
          <p className="text-xs text-[#7D6B62]">
            Vytvořeno: {formatDateTime(new Date(order.createdAt))}
          </p>
        </div>

        <span
          className={`self-start sm:self-auto px-4 py-1.5 rounded-full text-xs font-bold ${
            ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS] ||
            "bg-gray-100 text-gray-800"
          }`}
        >
          {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] ||
            order.status}
        </span>
      </div>

      {/* Progress Timeline */}
      <div className="p-8 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-6">
        <h3 className="font-serif text-base font-bold text-[#4A3A31]">
          Průběh vyřízení
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {steps.map((step, idx) => {
            const isCompleted = true; // Visual state
            return (
              <div
                key={step.key}
                className="flex flex-col items-center text-center space-y-2 p-3 rounded-2xl bg-[#FDFBF7] border border-[#E8D9CE]/60"
              >
                <div className="w-8 h-8 rounded-full bg-[#F9ECEF] text-[#C88D9A] flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </div>
                <span className="font-semibold text-xs text-[#4A3A31]">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {order.packetaBarcode && (
          <div className="p-4 bg-[#FBF6EE] border border-[#E6C89C] rounded-2xl flex items-center justify-between text-xs text-[#4A3A31]">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#D4AF7F]" />
              <span>
                Sledovací číslo Zásilkovny:{" "}
                <strong>{order.packetaBarcode}</strong>
              </span>
            </div>
            {order.trackingUrl && (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#C88D9A] font-bold underline flex items-center gap-1"
              >
                <span>Sledovat balíček</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Items & Pricing Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="p-6 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-[#4A3A31]">
            Objednané položky
          </h3>
          <div className="space-y-2 text-xs text-[#4A3A31]">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between py-1 border-b border-[#F0E4DC]">
                <span>
                  {item.quantity}× {item.productName}
                </span>
                <span className="font-bold">{formatCZK(item.totalPrice)}</span>
              </div>
            ))}
            <div className="pt-2 flex justify-between text-[#7D6B62]">
              <span>Doprava:</span>
              <span>{formatCZK(order.shippingPrice)}</span>
            </div>
            {order.codFee > 0 && (
              <div className="flex justify-between text-[#7D6B62]">
                <span>Dobírka:</span>
                <span>{formatCZK(order.codFee)}</span>
              </div>
            )}
            <div className="pt-2 flex justify-between font-bold text-sm text-[#4A3A31] border-t border-[#E8D9CE]">
              <span>Celkem:</span>
              <span className="text-[#C88D9A]">{formatCZK(order.totalPrice)}</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-4 text-xs text-[#7D6B62]">
          <h3 className="font-serif text-base font-bold text-[#4A3A31]">
            Doručovací údaje
          </h3>
          <p>
            <strong>Příjemce:</strong> {order.firstName} {order.lastName}
            <br />
            <strong>Email:</strong> {order.email}
            <br />
            <strong>Telefon:</strong> {order.phone}
          </p>
          <p>
            <strong>Způsob dopravy:</strong> {order.shippingMethod}
            {order.packetaPointName && (
              <>
                <br />
                <strong>Výdejní místo:</strong> {order.packetaPointName}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

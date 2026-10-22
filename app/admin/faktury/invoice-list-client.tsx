"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatCZK, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  CreditCard,
  Truck,
  ExternalLink,
  Receipt,
  FileCheck,
} from "lucide-react";

interface InvoiceListClientProps {
  initialOrders: any[];
}

export function InvoiceListClient({ initialOrders }: InvoiceListClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");

  const totalInvoices = initialOrders.length;
  const totalAmount = initialOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const paidOrders = initialOrders.filter(
    (o) => o.paymentStatus === "PAID" || o.status === "PAID" || o.status === "DELIVERED"
  );
  const paidAmount = paidOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const pendingOrders = initialOrders.filter(
    (o) =>
      o.paymentStatus !== "PAID" &&
      o.status !== "PAID" &&
      o.status !== "DELIVERED" &&
      o.status !== "CANCELLED" &&
      o.status !== "REFUNDED"
  );
  const pendingAmount = pendingOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const filterTabs = [
    { key: "ALL", label: "Všechny doklady", count: initialOrders.length },
    { key: "PAID", label: "Uhrazené", count: paidOrders.length },
    { key: "PENDING", label: "Čeká na úhradu", count: pendingOrders.length },
    {
      key: "CARD",
      label: "Platba kartou",
      count: initialOrders.filter((o) => o.paymentMethod === "STRIPE_CARD").length,
    },
    {
      key: "COD",
      label: "Dobírka",
      count: initialOrders.filter((o) => o.paymentMethod === "COD").length,
    },
  ];

  const filteredOrders = initialOrders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      order.orderNumber.toLowerCase().includes(term) ||
      order.firstName.toLowerCase().includes(term) ||
      order.lastName.toLowerCase().includes(term) ||
      order.email.toLowerCase().includes(term) ||
      order.phone.includes(term) ||
      (order.billingCity && order.billingCity.toLowerCase().includes(term));

    if (!matchSearch) return false;

    if (selectedFilter === "ALL") return true;
    if (selectedFilter === "PAID") {
      return (
        order.paymentStatus === "PAID" ||
        order.status === "PAID" ||
        order.status === "DELIVERED"
      );
    }
    if (selectedFilter === "PENDING") {
      return (
        order.paymentStatus !== "PAID" &&
        order.status !== "PAID" &&
        order.status !== "DELIVERED" &&
        order.status !== "CANCELLED" &&
        order.status !== "REFUNDED"
      );
    }
    if (selectedFilter === "CARD") return order.paymentMethod === "STRIPE_CARD";
    if (selectedFilter === "COD") return order.paymentMethod === "COD";

    return true;
  });

  return (
    <div className="space-y-8">
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#7D6B62] uppercase tracking-wider">
            <span>Celkem faktur</span>
            <Receipt className="w-4 h-4 text-[#C88D9A]" />
          </div>
          <div className="text-2xl font-bold text-[#4A3A31] font-serif">
            {totalInvoices} ks
          </div>
          <p className="text-[11px] text-[#A4948B]">Všechny vygenerované doklady</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#7D6B62] uppercase tracking-wider">
            <span>Celková fakturovaná částka</span>
            <FileCheck className="w-4 h-4 text-[#A87938]" />
          </div>
          <div className="text-2xl font-bold text-[#C88D9A] font-serif">
            {formatCZK(totalAmount)}
          </div>
          <p className="text-[11px] text-[#A4948B]">Objem všech objednávek</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#7D6B62] uppercase tracking-wider">
            <span>Uhrazeno</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-800 font-serif">
            {formatCZK(paidAmount)}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">
            {paidOrders.length} zaplacených faktur
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-[#7D6B62] uppercase tracking-wider">
            <span>Čeká na úhradu</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-800 font-serif">
            {formatCZK(pendingAmount)}
          </div>
          <p className="text-[11px] text-amber-700 font-medium">
            {pendingOrders.length} čeká na zaplacení či dobírku
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E8D9CE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A4948B]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Hledat číslo faktury, odběratele, email..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FDFBF7] border border-[#E8D9CE] rounded-2xl text-xs text-[#4A3A31] placeholder-[#A4948B] focus:ring-2 focus:ring-[#C88D9A] focus:border-transparent outline-none transition"
            />
          </div>

          <div className="text-xs text-[#7D6B62] self-end sm:self-center font-medium">
            Nalezeno dokladů:{" "}
            <span className="font-bold text-[#4A3A31]">{filteredOrders.length}</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 border-t border-[#F0E4DC] pt-3 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = selectedFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedFilter(tab.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-[#C88D9A] text-white shadow-xs"
                    : "bg-[#F7F4F0] text-[#7D6B62] hover:bg-[#F3E7DF]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-white text-[#7D6B62]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-3xl border border-[#E8D9CE] shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Receipt className="w-10 h-10 text-[#C88D9A] mx-auto opacity-50" />
            <p className="font-serif text-base font-bold text-[#4A3A31]">
              Žádné faktury nebyly nalezeny
            </p>
            <p className="text-xs text-[#7D6B62] max-w-sm mx-auto">
              Zkuste změnit vyhledávaný výraz nebo zvolte jiný filtr.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] text-[#7D6B62] uppercase tracking-wider text-[11px] font-bold border-b border-[#E8D9CE]">
                  <th className="py-4 px-6">Číslo dokladu</th>
                  <th className="py-4 px-6">Datum vystavení</th>
                  <th className="py-4 px-6">Odběratel</th>
                  <th className="py-4 px-6">Úhrada</th>
                  <th className="py-4 px-6">Stav</th>
                  <th className="py-4 px-6 text-right">Částka</th>
                  <th className="py-4 px-6 text-right">Akce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E4DC] text-[#4A3A31]">
                {filteredOrders.map((order) => {
                  const isPaid =
                    order.paymentStatus === "PAID" ||
                    order.status === "PAID" ||
                    order.status === "DELIVERED";

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#FCFAF7] transition group"
                    >
                      {/* Číslo faktury */}
                      <td className="py-4 px-6 font-bold">
                        <Link
                          href={`/admin/objednavky/${order.id}`}
                          className="text-[#C88D9A] hover:underline flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#A87938]" />
                          <span>{order.orderNumber}</span>
                        </Link>
                      </td>

                      {/* Datum */}
                      <td className="py-4 px-6 text-[#7D6B62]">
                        {formatDate(new Date(order.createdAt))}
                      </td>

                      {/* Odběratel */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#4A3A31]">
                          {order.firstName} {order.lastName}
                        </div>
                        <div className="text-[11px] text-[#A4948B]">
                          {order.billingCity ? `${order.billingCity} • ` : ""}
                          {order.email}
                        </div>
                      </td>

                      {/* Způsob platby */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 font-medium">
                          {order.paymentMethod === "STRIPE_CARD" ? (
                            <>
                              <CreditCard className="w-3.5 h-3.5 text-[#C88D9A]" />
                              <span>Karta</span>
                            </>
                          ) : (
                            <>
                              <Truck className="w-3.5 h-3.5 text-[#A87938]" />
                              <span>Dobírka</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Stav platby */}
                      <td className="py-4 px-6">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Uhrazeno
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" />
                            Čeká na úhradu
                          </span>
                        )}
                      </td>

                      {/* Částka */}
                      <td className="py-4 px-6 text-right font-serif font-bold text-sm text-[#4A3A31]">
                        {formatCZK(order.totalPrice)}
                      </td>

                      {/* Tlačítka akcí */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/api/admin/orders/${order.id}/invoice`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F9ECEF] hover:bg-[#F3D5DC] text-[#C88D9A] hover:text-[#B36879] font-bold text-xs transition shadow-2xs"
                            title="Otevřít fakturu v PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </a>

                          <Link
                            href={`/admin/objednavky/${order.id}`}
                            className="p-1.5 rounded-xl border border-[#E8D9CE] text-[#7D6B62] hover:bg-white hover:text-[#4A3A31] transition shadow-2xs"
                            title="Přejít do detailu objednávky"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

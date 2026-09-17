"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatCZK, formatDateTime } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from "@/types/order";
import {
  updateOrderStatusAction,
  deleteOrderAction,
  deleteOrdersAction,
} from "@/actions/admin-orders";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Search,
  Check,
  Phone,
  Mail,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function OrderFilterClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isBatchDeleting, setIsBatchDeleting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const filterTabs = [
    { key: "ALL", label: "Všechny", count: orders.length },
    {
      key: "PENDING_PROCESSING",
      label: "K výrobě",
      count: orders.filter(
        (o) =>
          o.status === "PENDING" ||
          o.status === "AWAITING_PAYMENT" ||
          o.status === "PROCESSING" ||
          o.status === "PAID"
      ).length,
    },
    {
      key: "SHIPPED",
      label: "Odesláno",
      count: orders.filter((o) => o.status === "SHIPPED").length,
    },
    {
      key: "DELIVERED",
      label: "Doručeno",
      count: orders.filter((o) => o.status === "DELIVERED").length,
    },
    {
      key: "COD",
      label: "Dobírka",
      count: orders.filter((o) => o.paymentMethod === "COD").length,
    },
  ];

  const filteredOrders = orders.filter((order) => {
    // Search matching
    const matchSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm);

    if (!matchSearch) return false;

    // Tab filter
    if (selectedFilter === "ALL") return true;
    if (selectedFilter === "PENDING_PROCESSING") {
      return (
        order.status === "PENDING" ||
        order.status === "AWAITING_PAYMENT" ||
        order.status === "PROCESSING" ||
        order.status === "PAID"
      );
    }
    if (selectedFilter === "SHIPPED") return order.status === "SHIPPED";
    if (selectedFilter === "DELIVERED") return order.status === "DELIVERED";
    if (selectedFilter === "COD") return order.paymentMethod === "COD";

    return true;
  });

  const isAllSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((o) => selectedOrderIds.includes(o.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const filteredSet = new Set(filteredOrders.map((o) => o.id));
      setSelectedOrderIds((prev) => prev.filter((id) => !filteredSet.has(id)));
    } else {
      const newIds = new Set([
        ...selectedOrderIds,
        ...filteredOrders.map((o) => o.id),
      ]);
      setSelectedOrderIds(Array.from(newIds));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSingle = async (orderId: string, orderNumber: string) => {
    if (
      !window.confirm(
        `Opravdu chcete trvale smazat objednávku č. ${orderNumber}?\n\nTato akce je nevratná a smaže veškerou historii i položky objednávky.`
      )
    ) {
      return;
    }

    setDeletingId(orderId);
    setFeedbackMessage(null);
    const res = await deleteOrderAction(orderId);
    if (res.success) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setSelectedOrderIds((prev) => prev.filter((id) => id !== orderId));
      setFeedbackMessage({
        type: "success",
        text: `Objednávka č. ${orderNumber} byla trvale smazána.`,
      });
    } else {
      setFeedbackMessage({
        type: "error",
        text: res.error || "Nepodařilo se smazat objednávku.",
      });
    }
    setDeletingId(null);
  };

  const handleBatchDelete = async () => {
    if (
      !window.confirm(
        `Opravdu chcete trvale smazat ${selectedOrderIds.length} vybraných objednávek?\n\nTato akce je nevratná.`
      )
    ) {
      return;
    }

    setIsBatchDeleting(true);
    setFeedbackMessage(null);
    const res = await deleteOrdersAction(selectedOrderIds);
    if (res.success) {
      const deletedSet = new Set(selectedOrderIds);
      setOrders((prev) => prev.filter((o) => !deletedSet.has(o.id)));
      setSelectedOrderIds([]);
      setFeedbackMessage({
        type: "success",
        text: `Úspěšně smazáno ${res.count || selectedOrderIds.length} vybraných objednávek.`,
      });
    } else {
      setFeedbackMessage({
        type: "error",
        text: res.error || "Nepodařilo se smazat vybrané objednávky.",
      });
    }
    setIsBatchDeleting(false);
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    const res = await updateOrderStatusAction({ orderId, newStatus });
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    }
    setUpdatingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium flex items-center justify-between gap-2 animate-fade-in ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-[11px] underline opacity-70 hover:opacity-100 cursor-pointer"
          >
            Zavřít
          </button>
        </div>
      )}

      {/* Batch Action Toolbar */}
      {selectedOrderIds.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#FFF5F5] border border-[#FCDAD7] rounded-2xl shadow-xs animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8B261D]">
            <Check className="w-4 h-4 text-red-600 shrink-0" />
            <span>
              Vybráno <strong>{selectedOrderIds.length}</strong> {selectedOrderIds.length === 1 ? "objednávka" : selectedOrderIds.length < 5 ? "objednávky" : "objednávek"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedOrderIds([])}
              className="text-xs text-[#7D6B62] hover:text-[#4A3A31] px-3 py-1.5 rounded-xl hover:bg-white/60 transition cursor-pointer"
            >
              Zrušit výběr
            </button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isBatchDeleting}
              onClick={handleBatchDelete}
              className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Smazat vybrané ({selectedOrderIds.length})
            </Button>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A4948B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Hledat podle čísla, jména, emailu či telefonu..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8D9CE] rounded-xl text-xs text-[#4A3A31] focus:outline-none focus:ring-2 focus:ring-[#C88D9A]/30 focus:border-[#C88D9A]"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#E8D9CE] shadow-xs">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === tab.key
                  ? "bg-[#C88D9A] text-white shadow-xs"
                  : "text-[#7D6B62] hover:bg-[#F9ECEF]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedFilter === tab.key
                    ? "bg-white/30 text-white"
                    : "bg-[#F3E7DF] text-[#4A3A31]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#E8D9CE] shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 space-y-2 text-[#7D6B62]">
            <p className="font-semibold text-sm">Žádné odpovídající objednávky</p>
            <p className="text-xs">Zkuste upravit vyhledávací dotaz nebo filtr.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#F0E4DC] bg-[#FDFBF7] text-[#7D6B62] uppercase tracking-wider">
                  <th className="py-3.5 px-3 text-center w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      aria-label="Vybrat všechny zobrazené objednávky"
                      className="w-4 h-4 rounded text-[#C88D9A] focus:ring-[#C88D9A] accent-[#C88D9A] cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-3">Objednávka</th>
                  <th className="py-3.5 px-4">Zákazník</th>
                  <th className="py-3.5 px-4">Kytice</th>
                  <th className="py-3.5 px-4">Doprava & Platba</th>
                  <th className="py-3.5 px-4">Částka</th>
                  <th className="py-3.5 px-4">Rychlá změna stavu</th>
                  <th className="py-3.5 px-4 text-right">Akce</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E4DC]">
                {filteredOrders.map((order) => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  const isDeletingThis = deletingId === order.id;

                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-[#FDFBF7]/60 transition ${
                        isSelected ? "bg-[#FFF9F6]" : ""
                      } ${isDeletingThis ? "opacity-40" : ""}`}
                    >
                      {/* Checkbox */}
                      <td className="py-4 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOrder(order.id)}
                          aria-label={`Vybrat objednávku ${order.orderNumber}`}
                          className="w-4 h-4 rounded text-[#C88D9A] focus:ring-[#C88D9A] accent-[#C88D9A] cursor-pointer"
                        />
                      </td>

                      {/* Order Number & Date */}
                      <td className="py-4 px-3">
                        <Link
                          href={`/admin/objednavky/${order.id}`}
                          className="font-mono font-bold text-[#4A3A31] hover:text-[#C88D9A] underline block"
                        >
                          {order.orderNumber}
                        </Link>
                        <span className="text-[11px] text-[#A4948B]">
                          {formatDateTime(new Date(order.createdAt))}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-[#4A3A31]">
                          {order.firstName} {order.lastName}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-[#7D6B62] pt-0.5">
                          <a
                            href={`tel:${order.phone}`}
                            className="hover:text-[#C88D9A] flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3 text-[#A87938]" />
                            {order.phone}
                          </a>
                          <a
                            href={`mailto:${order.email}`}
                            className="hover:text-[#C88D9A] flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3 text-[#A87938]" />
                            Email
                          </a>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          {order.items?.map((item: any) => (
                            <span
                              key={item.id}
                              className="block text-[11px] font-medium text-[#4A3A31]"
                            >
                              <strong>{item.quantity}×</strong> {item.productName}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Shipping & Payment */}
                      <td className="py-4 px-4">
                        <p className="font-semibold text-[#4A3A31]">
                          {order.shippingMethod === "PRAGUE_DELIVERY"
                            ? "Praha (Osobní)"
                            : order.shippingMethod === "PACKETA_PICKUP"
                            ? "Zásilkovna (Výdej)"
                            : "Zásilkovna (Adresa)"}
                        </p>
                        <span className="text-[11px] text-[#7D6B62]">
                          {order.paymentMethod === "STRIPE_CARD"
                            ? "Karta online"
                            : "Dobírka (+30 Kč)"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-4 font-bold text-sm text-[#4A3A31]">
                        {formatCZK(order.totalPrice)}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-4 px-4">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id || isDeletingThis}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderStatus
                            )
                          }
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border border-[#E8D9CE] focus:outline-none focus:ring-2 focus:ring-[#C88D9A] cursor-pointer ${
                            ORDER_STATUS_COLORS[
                              order.status as keyof typeof ORDER_STATUS_COLORS
                            ] || "bg-white text-gray-800"
                          }`}
                        >
                          <option value="PENDING">Čeká na platbu</option>
                          <option value="AWAITING_PAYMENT">Čeká na dobírku</option>
                          <option value="PAID">Zaplaceno</option>
                          <option value="PROCESSING">Připravuje se (výroba)</option>
                          <option value="SHIPPED">Odesláno</option>
                          <option value="DELIVERED">Doručeno</option>
                          <option value="CANCELLED">Zrušeno</option>
                          <option value="REFUNDED">Vráceno</option>
                        </select>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/admin/objednavky/${order.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs py-1 px-2.5"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Detail
                            </Button>
                          </Link>

                          {/* Delete button */}
                          <button
                            type="button"
                            disabled={isDeletingThis}
                            onClick={() =>
                              handleDeleteSingle(order.id, order.orderNumber)
                            }
                            className="p-1.5 rounded-xl text-[#A4948B] hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition cursor-pointer disabled:opacity-50"
                            title={`Smazat objednávku ${order.orderNumber}`}
                            aria-label={`Smazat objednávku ${order.orderNumber}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

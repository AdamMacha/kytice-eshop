"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCZK, formatDateTime } from "@/lib/format";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from "@/types/order";
import {
  updateOrderStatusAction,
  createPacketaShipmentForOrderAction,
  deleteOrderAction,
} from "@/actions/admin-orders";
import { Button } from "@/components/ui/button";
import {
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Trash2,
} from "lucide-react";

export function OrderDetailAdminClient({ order }: { order: any }) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [internalNote, setInternalNote] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isCreatingPacketa, setIsCreatingPacketa] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleUpdateStatus = async () => {
    setIsUpdatingStatus(true);
    setFeedbackMessage(null);
    const res = await updateOrderStatusAction({
      orderId: order.id,
      newStatus: status,
      note: internalNote.trim() || undefined,
    });
    if (res.success) {
      setFeedbackMessage({
        type: "success",
        text: `Stav byl úspěšně změněn na "${ORDER_STATUS_LABELS[status]}".`,
      });
      setInternalNote("");
    } else {
      setFeedbackMessage({
        type: "error",
        text: res.error || "Nepodařilo se změnit stav.",
      });
    }
    setIsUpdatingStatus(false);
  };

  const handleCreatePacketaShipment = async () => {
    setIsCreatingPacketa(true);
    setFeedbackMessage(null);
    const res = await createPacketaShipmentForOrderAction(order.id);
    if (res.success) {
      setStatus("SHIPPED");
      setFeedbackMessage({
        type: "success",
        text: `Zásilka Zásilkovny č. ${res.barcode} byla vytvořena!`,
      });
    } else {
      setFeedbackMessage({
        type: "error",
        text: res.error || "Chyba při komunikaci se Zásilkovnou.",
      });
    }
    setIsCreatingPacketa(false);
  };

  const handleDeleteOrder = async () => {
    if (
      !window.confirm(
        `Opravdu chcete trvale smazat objednávku č. ${order.orderNumber}?\n\nTato akce je nevratná a smaže veškeré údaje, historii i položky objednávky.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setFeedbackMessage(null);
    const res = await deleteOrderAction(order.id);
    if (res.success) {
      router.push("/admin/objednavky");
    } else {
      setFeedbackMessage({
        type: "error",
        text: res.error || "Nepodařilo se smazat objednávku.",
      });
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium flex items-center gap-2 animate-fade-in ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {feedbackMessage.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          )}
          <span>{feedbackMessage.text}</span>
        </div>
      )}

      {/* Action Box: Change Status & Packeta */}
      <div className="p-6 bg-white rounded-3xl border border-[#E8D9CE] shadow-xs space-y-6">
        <h3 className="font-serif text-lg font-bold text-[#4A3A31]">
          Správa a expedice objednávky
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          {/* Status Select */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3A31]">
              Změnit stav objednávky
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-[#E8D9CE] rounded-xl text-xs font-bold text-[#4A3A31] focus:ring-2 focus:ring-[#C88D9A]"
            >
              <option value="PENDING">PENDING – Čeká na platbu</option>
              <option value="AWAITING_PAYMENT">
                AWAITING_PAYMENT – Čeká na platbu při převzetí (dobírka)
              </option>
              <option value="PAID">PAID – Zaplaceno</option>
              <option value="PROCESSING">
                PROCESSING – V přípravě (ruční výroba kytice)
              </option>
              <option value="SHIPPED">SHIPPED – Odesláno</option>
              <option value="DELIVERED">DELIVERED – Doručeno</option>
              <option value="CANCELLED">CANCELLED – Zrušeno</option>
              <option value="REFUNDED">REFUNDED – Vráceno</option>
            </select>
          </div>

          {/* Internal Note */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A3A31]">
              Interní poznámka ke změně stavu (volitelné)
            </label>
            <input
              type="text"
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="např. kytice předána kurýrovi v 14:00..."
              className="w-full px-4 py-2.5 bg-[#FDFBF7] border border-[#E8D9CE] rounded-xl text-xs text-[#4A3A31] focus:ring-2 focus:ring-[#C88D9A]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F0E4DC]">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleUpdateStatus}
              isLoading={isUpdatingStatus}
              className="font-semibold"
            >
              Uložit nový stav
            </Button>

            {/* Packeta Shipment Action */}
            {!order.packetaBarcode ? (
              <Button
                variant="gold"
                size="sm"
                onClick={handleCreatePacketaShipment}
                isLoading={isCreatingPacketa}
                className="font-semibold"
              >
                <Truck className="w-4 h-4 mr-1.5" />
                Vytvořit zásilku v Zásilkovně
              </Button>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FBF6EE] border border-[#E6C89C] text-xs font-bold text-[#A87938]">
                <Truck className="w-4 h-4" />
                <span>Číslo zásilky: {order.packetaBarcode}</span>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#C88D9A] underline ml-1"
                  >
                    Sledovat
                  </a>
                )}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
            >
              <Printer className="w-3.5 h-3.5 mr-1" />
              Tisk objednávky
            </Button>
          </div>

          {/* Danger Zone: Delete order */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={isDeleting}
            onClick={handleDeleteOrder}
            className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 font-semibold cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Smazat objednávku
          </Button>
        </div>
      </div>
    </div>
  );
}

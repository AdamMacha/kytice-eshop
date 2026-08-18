"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import type { PacketaPickupPoint } from "@/types/packeta";
import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle, Search } from "lucide-react";

declare global {
  interface Window {
    Packeta?: {
      Widget: {
        pick: (
          apiKey: string,
          callback: (point: PacketaPickupPoint | null) => void,
          options?: Record<string, unknown>
        ) => void;
      };
    };
  }
}

interface PacketaWidgetProps {
  selectedPoint?: {
    id: string;
    name: string;
  };
  onSelectPoint: (point: { id: string; name: string }) => void;
  error?: string;
}

export function PacketaWidget({
  selectedPoint,
  onSelectPoint,
  error,
}: PacketaWidgetProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [isManualOpen, setIsManualOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Packeta) {
      setIsScriptLoaded(true);
    }
  }, []);

  const openPacketaWidget = () => {
    const apiKey =
      process.env.NEXT_PUBLIC_PACKETA_API_KEY || "test_api_key_packeta";

    if (window.Packeta) {
      window.Packeta.Widget.pick(
        apiKey,
        (point) => {
          if (point) {
            onSelectPoint({
              id: String(point.id),
              name: `${point.name}, ${point.street || ""}, ${point.city || ""} (${point.zip || ""})`.replace(
                /, ,/g,
                ","
              ),
            });
          }
        },
        {
          country: "cz",
          language: "cs",
          appIdentity: "MoodBox Bloom E-shop",
        }
      );
    } else {
      // Fallback if widget script fails to load
      setIsManualOpen(true);
    }
  };

  const handleManualSave = () => {
    if (manualInput.trim().length > 3) {
      onSelectPoint({
        id: `MANUAL-${Date.now().toString().slice(-4)}`,
        name: manualInput.trim(),
      });
      setIsManualOpen(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Packeta Widget v6 Script */}
      <Script
        src="https://widget.packeta.com/v6/www/js/library.js"
        strategy="lazyOnload"
        onLoad={() => setIsScriptLoaded(true)}
      />

      {/* Trigger & Selection Box */}
      <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E8D9CE] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#4A3A31]">
            <MapPin className="w-4 h-4 text-[#C88D9A]" />
            <span>Výdejní místo Zásilkovny / Z-BOX:</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openPacketaWidget}
            className="text-xs"
          >
            <Search className="w-3.5 h-3.5 mr-1" />
            {selectedPoint ? "Změnit výdejní místo" : "Vybrat na mapě"}
          </Button>
        </div>

        {/* Selected point presentation */}
        {selectedPoint?.name ? (
          <div className="p-3 bg-[#F9ECEF] border border-[#EBC3CC] rounded-xl flex items-start gap-2.5 text-xs text-[#4A3A31] animate-fade-in">
            <CheckCircle className="w-4 h-4 text-[#C88D9A] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-[#C88D9A]">Vybrané místo:</span>
              <p className="font-medium">{selectedPoint.name}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#7D6B62] italic">
            Klikněte na tlačítko a vyberte si nejbližší pobočku Zásilkovny nebo
            Z-BOX na interaktivní mapě.
          </p>
        )}

        {/* Error message */}
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

        {/* Manual Fallback Modal / Input */}
        {isManualOpen && (
          <div className="pt-3 border-t border-[#E8D9CE] space-y-2 animate-fade-in">
            <label className="block text-[11px] font-semibold text-[#4A3A31]">
              Nebo zadejte název / adresu výdejního místa ručně:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="např. Z-BOX Praha 4, Chodovská 123"
                className="flex-1 px-3 py-2 text-xs bg-white border border-[#E8D9CE] rounded-lg text-[#4A3A31]"
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleManualSave}
              >
                Uložit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

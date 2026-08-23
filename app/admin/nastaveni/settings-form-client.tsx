"use client";

import React, { useState } from "react";
import { updateStoreSettingsAction } from "@/actions/admin-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Save, Sparkles, Store, Truck, Phone } from "lucide-react";

export function SettingsFormClient({ settings }: { settings: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const res = await updateStoreSettingsAction(formData);
    if (res.success) {
      setFeedback("Nastavení obchodu bylo úspěšně uloženo.");
      setTimeout(() => setFeedback(null), 3000);
    }
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Box 1: Kontaktní a fakturační údaje */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E8D9CE] shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-sm font-bold text-[#4A3A31]">
          <Phone className="w-4 h-4 text-[#C88D9A]" />
          <span>Kontaktní údaje a provozovatel</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Telefon pro zákazníky"
            name="phone"
            defaultValue={settings.phone || "776 208 814"}
            required
          />
          <Input
            label="Email obchodu"
            name="email"
            type="email"
            defaultValue={settings.email || "moodboxcz@gmail.cz"}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Fakturační adresa"
            name="address"
            defaultValue={settings.address || "Hlavní 28, Průhonice 25243"}
            required
          />
          <Input
            label="IČO"
            name="ico"
            defaultValue={settings.ico || "23965878"}
            required
          />
        </div>
      </div>

      {/* Box 2: Ceny dopravy a poplatky */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E8D9CE] shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-sm font-bold text-[#4A3A31]">
          <Truck className="w-4 h-4 text-[#D4AF7F]" />
          <span>Poplatky za dopravu a platbu (Kč)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Zásilkovna (Výdejní místo)"
            name="packetaPickupPrice"
            type="number"
            defaultValue={settings.packetaPickupPrice || 89}
            required
          />
          <Input
            label="Zásilkovna (Na adresu)"
            name="packetaAddressPrice"
            type="number"
            defaultValue={settings.packetaAddressPrice || 129}
            required
          />
          <Input
            label="Příplatek za dobírku (Kč)"
            name="codFee"
            type="number"
            defaultValue={settings.codFee || 30}
            required
          />
        </div>
      </div>

      {/* Box 3: Horní oznamovací lišta */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E8D9CE] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#4A3A31]">
          <Sparkles className="w-4 h-4 text-[#C88D9A]" />
          <span>Text horní oznamovací lišty na webu</span>
        </div>
        <Input
          label="Oznamovací text"
          name="announcement"
          defaultValue={
            settings.announcement ||
            "Doprava zdarma po Praze | Ručně tvořené sladké kytice s alkoholem"
          }
          placeholder="např. Doprava po Praze zdarma..."
        />
      </div>

      <Button
        type="submit"
        variant="gold"
        size="lg"
        isLoading={isSaving}
        className="font-bold shadow-lg"
      >
        <Save className="w-4 h-4 mr-2" />
        Uložit veškeré nastavení
      </Button>
    </form>
  );
}

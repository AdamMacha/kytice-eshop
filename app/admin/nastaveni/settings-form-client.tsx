"use client";

import React, { useState } from "react";
import Image from "next/image";
import { updateStoreSettingsAction } from "@/actions/admin-settings";
import { uploadProductImageAction } from "@/actions/admin-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  Save,
  Sparkles,
  Store,
  Truck,
  Phone,
  ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";

export function SettingsFormClient({ settings }: { settings: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [heroImage, setHeroImage] = useState<string>(
    settings.heroImage || "/products/pink-edition.png"
  );
  const [aboutImage, setAboutImage] = useState<string>(
    settings.aboutImage || "/products/pink-edition.png"
  );
  const [uploadingHero, setUploadingHero] = useState<boolean>(false);
  const [uploadingAbout, setUploadingAbout] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: "hero" | "about"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    if (target === "hero") setUploadingHero(true);
    else setUploadingAbout(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await uploadProductImageAction(formData);
      if (res.success && res.url) {
        if (target === "hero") setHeroImage(res.url);
        else setAboutImage(res.url);
      } else {
        setUploadError(res.error || "Nahrávání fotky selhalo.");
      }
    } catch (err: any) {
      setUploadError(err.message || "Chyba při nahrávání.");
    } finally {
      if (target === "hero") setUploadingHero(false);
      else setUploadingAbout(false);
    }
  };

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
            defaultValue={settings.email || "moodboxcz@gmail.com"}
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

      {/* Box 4: Hlavní fotografie webu */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E8D9CE] shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-sm font-bold text-[#4A3A31]">
          <ImageIcon className="w-4 h-4 text-[#C88D9A]" />
          <span>Fotografie webu (Homepage & O nás)</span>
        </div>
        <p className="text-xs text-[#7D6B62]">
          Zde můžete změnit hlavní reprezentativní fotografii kytice na úvodní stránce a fotografii v představení na stránce O nás. Fotku můžete nahrát přímo ze zařízení, nebo zadat její URL.
        </p>

        {uploadError && (
          <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hero Image */}
          <div className="p-5 rounded-2xl bg-[#FCFAF7] border border-[#E8D9CE] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#4A3A31]">Fotka na Homepage</h4>
                <p className="text-[11px] text-[#7D6B62]">Hlavní kytice na úvodní stránce</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F3E7DF] text-[#A87938] font-semibold">
                Úvod (Hero)
              </span>
            </div>

            <div className="relative aspect-4/5 w-full max-w-[200px] mx-auto rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt="Homepage Hero náhled"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  Žádný obrázek
                </div>
              )}
              {uploadingHero && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-xs gap-1 backdrop-blur-xs">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Nahrávám...</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#4A3A31] block">
                Nahrát novou fotku
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageFileChange(e, "hero")}
                disabled={uploadingHero}
                className="text-xs w-full text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#F9ECEF] file:text-[#C88D9A] hover:file:bg-[#F3E7DF] file:cursor-pointer cursor-pointer"
              />
              <div className="pt-1">
                <label className="text-[11px] text-[#7D6B62] block mb-1">nebo URL adresa obrázku:</label>
                <input
                  type="text"
                  name="heroImage"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="w-full p-2 border rounded-xl text-xs bg-white"
                  placeholder="/products/pink-edition.png nebo URL"
                />
              </div>
            </div>
          </div>

          {/* About Image */}
          <div className="p-5 rounded-2xl bg-[#FCFAF7] border border-[#E8D9CE] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#4A3A31]">Fotka na stránce O nás</h4>
                <p className="text-[11px] text-[#7D6B62]">Představení příběhu a ruční tvorby</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F3E7DF] text-[#A87938] font-semibold">
                Stránka /o-nas
              </span>
            </div>

            <div className="relative aspect-4/5 w-full max-w-[200px] mx-auto rounded-2xl overflow-hidden border-2 border-white shadow-md bg-white">
              {aboutImage ? (
                <Image
                  src={aboutImage}
                  alt="O nás náhled"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                  Žádný obrázek
                </div>
              )}
              {uploadingAbout && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-xs gap-1 backdrop-blur-xs">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Nahrávám...</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#4A3A31] block">
                Nahrát novou fotku
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageFileChange(e, "about")}
                disabled={uploadingAbout}
                className="text-xs w-full text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#F9ECEF] file:text-[#C88D9A] hover:file:bg-[#F3E7DF] file:cursor-pointer cursor-pointer"
              />
              <div className="pt-1">
                <label className="text-[11px] text-[#7D6B62] block mb-1">nebo URL adresa obrázku:</label>
                <input
                  type="text"
                  name="aboutImage"
                  value={aboutImage}
                  onChange={(e) => setAboutImage(e.target.value)}
                  className="w-full p-2 border rounded-xl text-xs bg-white"
                  placeholder="/products/pink-edition.png nebo URL"
                />
              </div>
            </div>
          </div>
        </div>
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

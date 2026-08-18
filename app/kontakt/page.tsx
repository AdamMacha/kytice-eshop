import React from "react";
import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import { ContactForm } from "./contact-form";
import { MapPin, Phone, Mail, Clock, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Máte dotaz nebo přání na úpravu kytice na míru? Kontaktujte Kateřinu z MoodBox Bloom.",
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-[#E8D9CE] text-xs font-semibold text-[#A87938]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Jsme tu pro vás</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#4A3A31]">
          Kontaktujte nás
        </h1>
        <p className="text-sm text-[#7D6B62]">
          Rádi vám pomůžeme s výběrem té pravé kytice nebo připravíme dárkový box
          přesně podle vašeho přání.
        </p>
      </div>

      {/* Grid: Contact Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Details Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-white border border-[#E8D9CE] shadow-xs space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#4A3A31]">
              Kontaktní údaje
            </h3>

            <div className="space-y-4 text-sm text-[#7D6B62]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F9ECEF] flex items-center justify-center text-[#C88D9A] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#4A3A31]">Telefon</p>
                  <a
                    href={`tel:${BRAND.phone}`}
                    className="text-xs text-[#C88D9A] hover:underline"
                  >
                    {BRAND.phoneFormatted}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FBF6EE] flex items-center justify-center text-[#D4AF7F] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#4A3A31]">Email</p>
                  <a
                    href={`mailto:${BRAND.email}`}
                    className="text-xs text-[#C88D9A] hover:underline"
                  >
                    {BRAND.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F9ECEF] flex items-center justify-center text-[#C88D9A] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#4A3A31]">
                    Fakturační adresa & Sídlo
                  </p>
                  <p className="text-xs text-[#7D6B62]">
                    {BRAND.owner}
                    <br />
                    {BRAND.address}
                    <br />
                    IČO: {BRAND.ico}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FBF6EE] flex items-center justify-center text-[#D4AF7F] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-[#4A3A31]">Doba dodání</p>
                  <p className="text-xs text-[#7D6B62]">
                    Obvykle 3–10 pracovních dní od potvrzení objednávky.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Contact Form */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

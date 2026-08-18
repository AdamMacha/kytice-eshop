import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES, BRAND } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  Heart,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Objednávka potvrzena",
  description: "Děkujeme za vaši objednávku v e-shopu MoodBox Bloom.",
};

function ConfirmationContent({
  searchParams,
}: {
  searchParams: { orderId?: string; orderNumber?: string };
}) {
  const orderNumber = searchParams.orderNumber || "MB-2026-00001";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center space-y-10">
      {/* Success Badge */}
      <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg animate-fade-in">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      {/* Main Title & Order Number */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F9ECEF] border border-[#EBC3CC] text-xs font-bold text-[#C88D9A]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Objednávka byla úspěšně přijata</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3A31]">
          Děkujeme za váš nákup!
        </h1>
        <p className="text-base text-[#7D6B62]">
          Číslo vaší objednávky:{" "}
          <strong className="text-[#4A3A31] font-mono text-lg">
            {orderNumber}
          </strong>
        </p>
      </div>

      {/* What happens next box */}
      <div className="p-8 rounded-3xl bg-white border border-[#E8D9CE] shadow-sm text-left space-y-6">
        <h3 className="font-serif text-lg font-bold text-[#4A3A31]">
          Co bude následovat?
        </h3>

        <div className="space-y-4 text-xs text-[#7D6B62]">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#F9ECEF] text-[#C88D9A] flex items-center justify-center font-bold shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="font-bold text-[#4A3A31]">
                Potvrzení jsme odeslali na váš email
              </p>
              <p>
                Během několika minut vám dorazí shrnutí objednávky s rekapitulací
                položek a doručovací adresy.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#FBF6EE] text-[#D4AF7F] flex items-center justify-center font-bold shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="font-bold text-[#4A3A31]">
                Kytici ručně připravíme
              </p>
              <p>
                Vaši sladkou kytici s alkoholem a čokoládami ručně uvážeme a
                dárkově zabalíme (obvykle 3–10 pracovních dní).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#F9ECEF] text-[#C88D9A] flex items-center justify-center font-bold shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="font-bold text-[#4A3A31]">Doručení k vám</p>
              <p>
                Jakmile bude kytice předána dopravci nebo připravena k osobnímu
                doručení po Praze, budeme vás informovat s číslem zásilky.
              </p>
            </div>
          </div>
        </div>

        {/* Contact info for immediate changes */}
        <div className="pt-4 border-t border-[#F0E4DC] flex flex-col sm:flex-row items-center justify-between text-xs text-[#7D6B62] gap-3">
          <span>Potřebujete v objednávce cokoliv změnit?</span>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${BRAND.phone}`}
              className="text-[#C88D9A] font-semibold hover:underline flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              {BRAND.phoneFormatted}
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              className="text-[#C88D9A] font-semibold hover:underline flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              {BRAND.email}
            </a>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link href={ROUTES.home}>
          <Button variant="primary" size="lg" className="font-semibold">
            Návrat na hlavní stránku
          </Button>
        </Link>
        <Link href={ROUTES.products}>
          <Button variant="outline" size="lg">
            Prohlédnout další kytice
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; orderNumber?: string }>;
}) {
  const params = await searchParams;

  return (
    <Suspense fallback={<div className="p-20 text-center">Načítání...</div>}>
      <ConfirmationContent searchParams={params} />
    </Suspense>
  );
}

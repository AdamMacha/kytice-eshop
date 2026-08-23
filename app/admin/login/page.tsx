import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { loginAdminAction } from "@/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Přihlášení do administrace | MoodBox Bloom",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-[#F3E7DF] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-[#E8D9CE] space-y-8 text-center animate-fade-in">
        {/* Logo */}
        <div className="w-16 h-16 relative mx-auto">
          <Image
            src="/logo.png"
            alt="MoodBox Logo"
            fill
            className="object-contain"
          />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F9ECEF] text-[#C88D9A] text-xs font-bold border border-[#EBC3CC]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Správa obchodu</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A3A31]">
            MoodBox Bloom Admin
          </h1>
          <p className="text-xs text-[#7D6B62]">
            Zadejte administrátorské heslo pro přístup k objednávkám a nastavení
          </p>
        </div>

        {params.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
            {params.error}
          </div>
        )}

        <form action={loginAdminAction} className="space-y-4 text-left">
          <Input
            label="Administrátorské heslo"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoFocus
          />

          <Button
            type="submit"
            variant="gold"
            size="lg"
            className="w-full font-bold shadow-lg mt-2"
          >
            <Lock className="w-4 h-4 mr-2" />
            Vstoupit do administrace
          </Button>
        </form>

        <p className="text-[11px] text-[#A4948B]">
          Výchozí testovací heslo: <code className="bg-[#F3E7DF] px-1.5 py-0.5 rounded font-mono">moodbox2026</code>
        </p>
      </div>
    </div>
  );
}

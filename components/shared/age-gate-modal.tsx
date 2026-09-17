"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AGE_VERIFIED_KEY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export function AgeGateModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDenied, setIsDenied] = useState(false);

  useEffect(() => {
    try {
      const verified = localStorage.getItem(AGE_VERIFIED_KEY);
      if (!verified) {
        queueMicrotask(() => setIsOpen(true));
      }
    } catch {
      queueMicrotask(() => setIsOpen(true));
    }
  }, []);

  const handleConfirm = () => {
    try {
      localStorage.setItem(AGE_VERIFIED_KEY, "true");
    } catch (err) {
      console.error(err);
    }
    setIsOpen(false);
  };

  const handleDeny = () => {
    setIsDenied(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FDFBF7] rounded-3xl p-8 text-center shadow-2xl border border-[#E8D9CE] space-y-6">
        {/* Logo */}
        <div className="mx-auto w-16 h-16 relative">
          <Image
            src="/logo.png"
            alt="MoodBox Logo"
            fill
            className="object-contain"
          />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4E5] text-[#B76E00] text-xs font-bold border border-[#FFE0B2]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Ověření věku 18+</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#4A3A31]">
            Vítejte v MoodBox Bloom
          </h2>
        </div>

        {!isDenied ? (
          <>
            <p className="text-xs text-[#7D6B62] leading-relaxed">
              Tento e-shop nabízí sladké kytice a dárkové boxy, které obsahují{" "}
              <strong className="text-[#4A3A31]">alkoholické nápoje</strong> (šumivá vína, rum, likéry).
              <br />
              V souladu se zákonem č. 65/2017 Sb. je prodej povolen pouze osobám starším 18 let.
            </p>

            <div className="pt-2 space-y-2.5">
              <Button
                variant="gold"
                size="lg"
                onClick={handleConfirm}
                className="w-full font-bold shadow-lg"
              >
                Ano, je mi 18 let a více
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeny}
                className="w-full text-[#7D6B62] hover:text-[#4A3A31]"
              >
                Je mi méně než 18 let
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4 py-4 animate-fade-in">
            <p className="text-sm font-semibold text-red-600">
              Omlouváme se, vstup na tyto stránky není povolen osobám mladším 18 let.
            </p>
            <p className="text-xs text-[#7D6B62]">
              Děkujeme za pochopení a dodržování platné legislativy.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

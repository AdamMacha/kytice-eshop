"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const COOKIE_CONSENT_KEY = "moodbox_cookie_consent";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(false);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "all");
    } catch (err) {
      console.error(err);
    }
    setIsVisible(false);
  };

  const handleEssential = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "essential");
    } catch (err) {
      console.error(err);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-fade-in">
      <div className="p-5 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#E8D9CE] space-y-3">
        <div className="flex items-center gap-2 text-[#4A3A31]">
          <Cookie className="w-5 h-5 text-[#D4AF7F]" />
          <h4 className="font-serif font-bold text-sm">Informace o cookies</h4>
        </div>
        <p className="text-xs text-[#7D6B62] leading-relaxed">
          Tento web používá nezbytné cookies k zajištění správného fungování
          košíku a procesu objednávky. Více informací naleznete v{" "}
          <Link
            href={ROUTES.privacy}
            className="text-[#C88D9A] underline hover:text-[#B67886]"
          >
            Zásadách ochrany osobních údajů
          </Link>
          .
        </p>
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={handleEssential}>
            Pouze nezbytné
          </Button>
          <Button variant="primary" size="sm" onClick={handleAccept}>
            Přijmout vše
          </Button>
        </div>
      </div>
    </div>
  );
}

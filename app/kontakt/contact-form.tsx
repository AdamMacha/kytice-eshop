"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "@/schemas/contact";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Send } from "lucide-react";

export function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate sending email / contact form action
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-8 rounded-3xl bg-white border border-[#E8D9CE] shadow-sm space-y-5"
    >
      <h3 className="font-serif text-xl font-bold text-[#4A3A31]">
        Napište nám zprávu
      </h3>

      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs animate-fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Děkujeme za vaši zprávu! Ozveme se vám co nejdříve na zadaný email.
          </span>
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Vaše jméno"
          placeholder="např. Kateřina Nováková"
          error={errors.name?.message}
          {...register("name")}
          required
        />

        <Input
          label="Váš email"
          type="email"
          placeholder="např. katerina@email.cz"
          error={errors.email?.message}
          {...register("email")}
          required
        />

        <div className="space-y-1.5">
          <label
            htmlFor="message"
            className="block text-xs font-semibold uppercase tracking-wider text-[#4A3A31]"
          >
            Zpráva či přání na míru <span className="text-[#C88D9A]">*</span>
          </label>
          <textarea
            id="message"
            rows={4}
            placeholder="Popište vaši představu o kytici nebo se na cokoliv zeptejte..."
            className="w-full px-4 py-3 bg-white/90 border border-[#E8D9CE] rounded-xl text-sm text-[#4A3A31] placeholder-[#A4948B] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C88D9A]/30 focus:border-[#C88D9A]"
            {...register("message")}
          />
          {errors.message && (
            <p className="text-xs text-red-500 mt-1">
              {errors.message.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isSubmitting}
        className="w-full font-semibold"
      >
        <Send className="w-4 h-4 mr-2" />
        Odeslat zprávu
      </Button>
    </form>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutFormSchema, type CheckoutFormData } from "@/schemas/checkout";
import { shippingMethods, COD_FEE, COD_FEE_HALERE } from "@/data/shipping";
import { formatCZK } from "@/lib/format";
import { ROUTES } from "@/lib/constants";
import { createOrder } from "@/actions/create-order";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PacketaWidget } from "@/components/checkout/packeta-widget";
import { StripePayment } from "@/components/checkout/stripe-payment";
import {
  ShieldAlert,
  Lock,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalHalere, clearCart } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stripeData, setStripeData] = useState<{
    clientSecret: string;
    orderId: string;
    orderNumber: string;
    totalPriceHalere?: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      shippingMethod: "PRAGUE_DELIVERY",
      paymentMethod: "STRIPE_CARD",
      ageVerified: false as unknown as true,
      termsAccepted: false as unknown as true,
      privacyAccepted: false as unknown as true,
      items: items.map((item) => ({
        productSlug: item.product.slug,
        quantity: item.quantity,
      })),
    },
  });

  const selectedShipping = watch("shippingMethod");
  const selectedPayment = watch("paymentMethod");
  const packetaPointId = watch("packetaPointId");
  const packetaPointName = watch("packetaPointName");

  // Dynamic price calculation
  const currentShippingMethod = shippingMethods.find(
    (m) => m.id === selectedShipping
  );
  const shippingPriceHalere = currentShippingMethod?.priceHalere || 0;
  const codFeeHalere = selectedPayment === "COD" ? COD_FEE_HALERE : 0;
  const grandTotalHalere = subtotalHalere + shippingPriceHalere + codFeeHalere;

  // Empty cart guard
  if (items.length === 0 && !stripeData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="font-serif text-2xl font-bold text-[#4A3A31]">
          Váš košík je prázdný
        </h1>
        <p className="text-xs text-[#7D6B62]">
          Před přechodem do pokladny si prosím vyberte některou z kytic.
        </p>
        <Link href={ROUTES.products}>
          <Button variant="primary">Prohlédnout kytice</Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Sync latest items
    data.items = items.map((item) => ({
      productSlug: item.product.slug,
      quantity: item.quantity,
    }));

    try {
      const result = await createOrder(data);

      if (!result.success) {
        setSubmitError(result.error || "Při odesílání objednávky došlo k chybě.");
        setIsSubmitting(false);
        return;
      }

      // If COD, order is confirmed! Clear cart and redirect
      if (result.isCod && result.orderId) {
        clearCart();
        router.push(
          `${ROUTES.orderConfirmation}?orderId=${result.orderId}&orderNumber=${result.orderNumber}`
        );
        return;
      }

      // If Stripe, open Stripe Payment Element
      if (result.clientSecret && result.orderId && result.orderNumber) {
        setStripeData({
          clientSecret: result.clientSecret,
          orderId: result.orderId,
          orderNumber: result.orderNumber,
          totalPriceHalere: result.totalPriceHalere || grandTotalHalere,
        });
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setSubmitError(err.message || "Nepodařilo se vytvořit objednávku.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Checkout Title */}
      <div className="text-center sm:text-left space-y-2 border-b border-[#E8D9CE] pb-6">
        <span className="text-xs uppercase tracking-widest text-[#A87938] font-bold">
          Bezpečná pokladna
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#4A3A31]">
          Dokončení vaší objednávky
        </h1>
      </div>

      {stripeData ? (
        /* Stripe Payment Step */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
          {/* Left Col: Payment Card & Instructions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-[#A87938] font-bold">
                  Krok 2 ze 2
                </span>
                <span className="text-xs text-[#A4948B]">•</span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Objednávka č. {stripeData.orderNumber}
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#4A3A31]">
                Zabezpečená platba kartou
              </h2>
              <p className="text-xs sm:text-sm text-[#7D6B62]">
                Vaše objednávka byla úspěšně zaevidována. Pro její dokončení a zahájení ruční vazby kytice zadejte platební údaje karty níže.
              </p>
            </div>

            <StripePayment
              clientSecret={stripeData.clientSecret}
              orderId={stripeData.orderId}
              orderNumber={stripeData.orderNumber}
              totalDisplay={formatCZK(stripeData.totalPriceHalere || grandTotalHalere)}
              onCancel={() => setStripeData(null)}
            />
          </div>

          {/* Right Col: Order Summary & Reassurance */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8D9CE] shadow-sm space-y-6 sticky top-28">
              <div className="flex items-center justify-between pb-3 border-b border-[#F0E4DC]">
                <h3 className="font-serif text-xl font-bold text-[#4A3A31]">
                  Rekapitulace objednávky
                </h3>
                <span className="text-xs font-mono font-bold text-[#A87938]">
                  #{stripeData.orderNumber}
                </span>
              </div>

              {/* Items preview */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.product.slug}
                    className="flex items-center justify-between text-xs text-[#4A3A31] gap-3 p-2.5 rounded-xl bg-[#FDFBF7] border border-[#F0E4DC]"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-6 h-6 rounded-full bg-[#F9ECEF] text-[#C88D9A] flex items-center justify-center font-bold text-[11px] shrink-0">
                        {item.quantity}×
                      </div>
                      <span className="truncate font-medium">{item.product.name}</span>
                    </div>
                    <span className="font-bold whitespace-nowrap text-[#4A3A31]">
                      {formatCZK(item.product.priceHalere * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculation breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-[#F0E4DC] text-xs text-[#7D6B62]">
                <div className="flex justify-between">
                  <span>Mezisoučet položek:</span>
                  <span className="font-semibold text-[#4A3A31]">
                    {formatCZK(subtotalHalere)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Doprava ({currentShippingMethod?.name || "Zvolená doprava"}):</span>
                  <span className="font-semibold text-[#4A3A31]">
                    {shippingPriceHalere === 0
                      ? "Zdarma"
                      : formatCZK(shippingPriceHalere)}
                  </span>
                </div>

                <div className="pt-4 border-t-2 border-[#F0E4DC] flex justify-between items-baseline">
                  <div>
                    <span className="font-serif font-bold text-base text-[#4A3A31] block">
                      Celkem k úhradě:
                    </span>
                    <span className="text-[10px] text-[#A4948B] block">
                      Včetně DPH a dopravy
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-[#C88D9A]">
                    {formatCZK(stripeData.totalPriceHalere || grandTotalHalere)}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="p-4 rounded-2xl bg-[#FFF9F6] border border-[#EBC3CC] space-y-2 text-xs text-[#7D6B62]">
                <div className="flex items-center gap-2 text-[#4A3A31] font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Garance bezpečného nákupu</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Platba probíhá šifrovaným spojením přímo přes platební bránu Stripe. Údaje o kartě jsou chráněny 256-bit SSL šifrováním a 3D Secure ověřením.
                </p>
              </div>

              {/* Back to details button */}
              <button
                type="button"
                onClick={() => setStripeData(null)}
                className="w-full text-center text-xs text-[#7D6B62] hover:text-[#4A3A31] py-2 transition hover:underline cursor-pointer"
              >
                ← Upravit doručovací adresu nebo způsob dopravy
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Main Checkout Form */
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Col: Steps 1 - 4 */}
            <div className="lg:col-span-8 space-y-8">
              {/* Error Banner */}
              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600 font-medium animate-fade-in">
                  {submitError}
                </div>
              )}

              {/* Step 1: Kontaktní údaje */}
              <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E8D9CE] shadow-xs space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C88D9A] text-white flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#4A3A31]">
                    Kontaktní a fakturační údaje
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Jméno"
                    placeholder="Kateřina"
                    error={errors.firstName?.message}
                    {...register("firstName")}
                    required
                  />
                  <Input
                    label="Příjmení"
                    placeholder="Nováková"
                    error={errors.lastName?.message}
                    {...register("lastName")}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Email pro potvrzení"
                    type="email"
                    placeholder="katerina@email.cz"
                    error={errors.email?.message}
                    {...register("email")}
                    required
                  />
                  <Input
                    label="Telefonní číslo (pro kurýra)"
                    placeholder="776 208 814 nebo +420..."
                    error={errors.phone?.message}
                    {...register("phone")}
                    required
                  />
                </div>

                <div className="space-y-4 pt-2 border-t border-[#F0E4DC]">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#A87938]">
                    Fakturační adresa
                  </p>
                  <Input
                    label="Ulice a číslo popisné"
                    placeholder="Hlavní 28"
                    error={errors.billingStreet?.message}
                    {...register("billingStreet")}
                    required
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Město"
                      placeholder="Praha / Průhonice"
                      error={errors.billingCity?.message}
                      {...register("billingCity")}
                      required
                    />
                    <Input
                      label="PSČ"
                      placeholder="110 00"
                      error={errors.billingZip?.message}
                      {...register("billingZip")}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Způsob dopravy */}
              <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E8D9CE] shadow-xs space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C88D9A] text-white flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#4A3A31]">
                    Způsob dopravy
                  </h3>
                </div>

                <div className="space-y-3">
                  {shippingMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedShipping === method.id
                          ? "border-[#C88D9A] bg-[#F9ECEF]/60 shadow-xs"
                          : "border-[#E8D9CE] hover:bg-[#FDFBF7]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          value={method.id}
                          className="mt-1 text-[#C88D9A] focus:ring-[#C88D9A] accent-[#C88D9A]"
                          {...register("shippingMethod")}
                        />
                        <div className="space-y-0.5">
                          <span className="font-bold text-sm text-[#4A3A31] block">
                            {method.name}
                          </span>
                          <span className="text-xs text-[#7D6B62] block">
                            {method.description} ({method.estimatedDays})
                          </span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#C88D9A] whitespace-nowrap ml-2">
                        {method.price === 0 ? "Zdarma" : `${method.price} Kč`}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Conditional: Packeta Widget Selector */}
                {selectedShipping === "PACKETA_PICKUP" && (
                  <div className="pt-2 animate-fade-in">
                    <PacketaWidget
                      selectedPoint={
                        packetaPointId
                          ? { id: packetaPointId, name: packetaPointName || "" }
                          : undefined
                      }
                      onSelectPoint={(point) => {
                        setValue("packetaPointId", point.id);
                        setValue("packetaPointName", point.name);
                      }}
                      error={errors.packetaPointId?.message}
                    />
                  </div>
                )}

                {/* Conditional: Shipping Address for Prague & Address Delivery */}
                {(selectedShipping === "PRAGUE_DELIVERY" ||
                  selectedShipping === "PACKETA_ADDRESS") && (
                  <div className="pt-4 border-t border-[#F0E4DC] space-y-4 animate-fade-in">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#A87938]">
                      Adresa doručení
                    </p>
                    <Input
                      label="Doručovací ulice a číslo"
                      placeholder="např. Václavské náměstí 1"
                      error={errors.shippingStreet?.message}
                      {...register("shippingStreet")}
                      required
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Doručovací město"
                        placeholder="např. Praha"
                        error={errors.shippingCity?.message}
                        {...register("shippingCity")}
                        required
                      />
                      <Input
                        label="Doručovací PSČ"
                        placeholder="např. 110 00"
                        error={errors.shippingZip?.message}
                        {...register("shippingZip")}
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Způsob platby */}
              <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E8D9CE] shadow-xs space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C88D9A] text-white flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#4A3A31]">
                    Způsob platby
                  </h3>
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedPayment === "STRIPE_CARD"
                        ? "border-[#C88D9A] bg-[#F9ECEF]/60 shadow-xs"
                        : "border-[#E8D9CE] hover:bg-[#FDFBF7]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value="STRIPE_CARD"
                        className="text-[#C88D9A] focus:ring-[#C88D9A] accent-[#C88D9A]"
                        {...register("paymentMethod")}
                      />
                      <div>
                        <span className="font-bold text-sm text-[#4A3A31] block">
                          Platba kartou online (Stripe)
                        </span>
                        <span className="text-xs text-[#7D6B62]">
                          Okamžitá platba přes zabezpečenou platební bránu
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">
                      Zdarma
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedPayment === "COD"
                        ? "border-[#C88D9A] bg-[#F9ECEF]/60 shadow-xs"
                        : "border-[#E8D9CE] hover:bg-[#FDFBF7]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value="COD"
                        className="text-[#C88D9A] focus:ring-[#C88D9A] accent-[#C88D9A]"
                        {...register("paymentMethod")}
                      />
                      <div>
                        <span className="font-bold text-sm text-[#4A3A31] block">
                          Dobírka při převzetí
                        </span>
                        <span className="text-xs text-[#7D6B62]">
                          Platba v hotovosti nebo kartou kurýrovi / na výdejním
                          místě
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#C88D9A]">
                      +{COD_FEE} Kč
                    </span>
                  </label>
                </div>
              </div>

              {/* Step 4: Poznámka & Zákonné souhlasy */}
              <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E8D9CE] shadow-xs space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#C88D9A] text-white flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#4A3A31]">
                    Poznámka a zákonná potvrzení
                  </h3>
                </div>

                {/* Customization Note */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="note"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#4A3A31]"
                  >
                    Poznámka k objednávce / Přání na míru (volitelné)
                  </label>
                  <textarea
                    id="note"
                    rows={3}
                    placeholder="Uveďte jakékoliv speciální přání ohledně barev, věnování nebo doručení..."
                    className="w-full px-4 py-3 bg-white/90 border border-[#E8D9CE] rounded-xl text-sm text-[#4A3A31] placeholder-[#A4948B] focus:outline-none focus:ring-2 focus:ring-[#C88D9A]/30 focus:border-[#C88D9A]"
                    {...register("note")}
                  />
                </div>

                {/* 18+ Mandatory Age Verification Checkbox */}
                <div className="p-4 rounded-2xl bg-[#FFF4E5] border border-[#FFE0B2] space-y-3">
                  <div className="flex items-center gap-2 text-[#B76E00]">
                    <ShieldAlert className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Zákonné ověření věku 18+ (Zákon č. 65/2017 Sb.)
                    </span>
                  </div>
                  <Checkbox
                    id="ageVerified"
                    label={
                      <span className="font-bold text-[#4A3A31]">
                        Čestně prohlašuji, že je mi 18 let a jsem oprávněn/a
                        zakoupit produkty obsahující alkohol.
                      </span>
                    }
                    error={errors.ageVerified?.message}
                    {...register("ageVerified")}
                  />
                </div>

                {/* Terms and GDPR Checkboxes */}
                <div className="space-y-3 pt-2">
                  <Checkbox
                    id="termsAccepted"
                    label={
                      <span>
                        Souhlasím s{" "}
                        <Link
                          href={ROUTES.terms}
                          target="_blank"
                          className="text-[#C88D9A] underline hover:text-[#B67886]"
                        >
                          obchodními podmínkami
                        </Link>{" "}
                        e-shopu MoodBox Bloom.
                      </span>
                    }
                    error={errors.termsAccepted?.message}
                    {...register("termsAccepted")}
                  />

                  <Checkbox
                    id="privacyAccepted"
                    label={
                      <span>
                        Souhlasím se{" "}
                        <Link
                          href={ROUTES.privacy}
                          target="_blank"
                          className="text-[#C88D9A] underline hover:text-[#B67886]"
                        >
                          zpracováním osobních údajů
                        </Link>{" "}
                        za účelem vyřízení objednávky.
                      </span>
                    }
                    error={errors.privacyAccepted?.message}
                    {...register("privacyAccepted")}
                  />
                </div>
              </div>
            </div>

            {/* Right Col: Sticky Order Summary & Submit Button */}
            <div className="lg:col-span-4">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8D9CE] shadow-sm space-y-6 sticky top-28">
                <h3 className="font-serif text-xl font-bold text-[#4A3A31]">
                  Přehled položek
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item.product.slug}
                      className="flex items-center justify-between text-xs text-[#4A3A31] gap-2"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-semibold text-[#C88D9A]">
                          {item.quantity}×
                        </span>
                        <span className="truncate">{item.product.name}</span>
                      </div>
                      <span className="font-semibold whitespace-nowrap">
                        {formatCZK(item.product.priceHalere * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculation breakdown */}
                <div className="space-y-2.5 pt-4 border-t border-[#F0E4DC] text-xs text-[#7D6B62]">
                  <div className="flex justify-between">
                    <span>Mezisoučet:</span>
                    <span className="font-semibold text-[#4A3A31]">
                      {formatCZK(subtotalHalere)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Doprava:</span>
                    <span className="font-semibold text-[#4A3A31]">
                      {shippingPriceHalere === 0
                        ? "Zdarma"
                        : formatCZK(shippingPriceHalere)}
                    </span>
                  </div>
                  {selectedPayment === "COD" && (
                    <div className="flex justify-between text-[#C88D9A]">
                      <span>Příplatek za dobírku:</span>
                      <span className="font-semibold">{COD_FEE} Kč</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#F0E4DC] flex justify-between items-baseline">
                    <span className="font-serif font-bold text-base text-[#4A3A31]">
                      Celkem k úhradě:
                    </span>
                    <span className="text-2xl font-bold text-[#C88D9A]">
                      {formatCZK(grandTotalHalere)}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#A4948B] text-right">
                    Cena je konečná včetně DPH.
                  </p>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full font-bold shadow-xl text-base py-4 group"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {selectedPayment === "COD"
                    ? "Závazně objednat (na dobírku)"
                    : "Přejít k platbě kartou"}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>

                <div className="pt-2 space-y-2 text-[11px] text-[#A4948B] text-center">
                  <p className="flex items-center justify-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    100% Bezpečný nákup & Ruční výroba
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

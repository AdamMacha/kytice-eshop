"use client";

import React, { useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  ExpressCheckoutElement
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Lock, CreditCard, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function PaymentFormInternal({
  orderId,
  orderNumber,
  totalDisplay,
  onCancel,
}: {
  orderId: string;
  orderNumber: string;
  totalDisplay: string;
  onCancel?: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Mock payment submission for testing
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        router.push(
          `${ROUTES.orderConfirmation}?orderId=${orderId}&orderNumber=${orderNumber}`
        );
      }, 1000);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${ROUTES.orderConfirmation}?orderId=${orderId}&orderNumber=${orderNumber}`,
      },
    });

    if (error) {
      setErrorMessage(
        error.message || "Platba kartou nebyla úspěšná. Zkuste to prosím znovu."
      );
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      {/* Prominent Price & Order Summary Card */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-[#FFF9F6] to-[#F9ECEF] rounded-2xl border border-[#EBC3CC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#A87938] block">
            Konečná částka k úhradě
          </span>
          <span className="text-xs text-[#7D6B62] block">
            Objednávka č. <strong className="text-[#4A3A31] font-mono tracking-wide">{orderNumber}</strong>
          </span>
        </div>
        <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#EBC3CC]/50">
          <span className="font-serif text-3xl sm:text-4xl font-bold text-[#C88D9A] block leading-none">
            {totalDisplay}
          </span>
          <span className="text-[11px] text-[#7D6B62] mt-1 block">
            Včetně DPH a dopravy
          </span>
        </div>
      </div>

      <div className="p-6 bg-white rounded-2xl border border-[#E8D9CE] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0E4DC]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#4A3A31]">
            <CreditCard className="w-4 h-4 text-[#C88D9A]" />
            <span>Karta / Apple Pay / Google Pay</span>
          </div>
          <span className="text-[11px] text-[#7D6B62]">
            Konečná cena: <strong className="text-[#C88D9A]">{totalDisplay}</strong>
          </span>
        </div>

        {stripePromise ? (
          <div className="space-y-4">
            <ExpressCheckoutElement 
              options={{
                paymentMethods: {
                  applePay: "always",
                  googlePay: "always",
                  link: "never",
                },
                buttonType: {
                  applePay: "buy",
                  googlePay: "buy",
                }
              }}
              onConfirm={async (event) => {
                if (!stripe || !elements) return;
                setIsProcessing(true);
                const { error } = await stripe.confirmPayment({
                  elements,
                  confirmParams: {
                    return_url: `${window.location.origin}${ROUTES.orderConfirmation}?orderId=${orderId}&orderNumber=${orderNumber}`,
                  },
                });

                if (error) {
                  setErrorMessage(error.message || "Rychlá platba nebyla úspěšná.");
                  setIsProcessing(false);
                }
              }}
            />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-[#E8D9CE]" />
              </div>
              <div className="relative flex justify-center text-[11px] font-medium uppercase tracking-widest text-[#7D6B62]">
                <span className="bg-white px-4">Nebo zadat kartu ručně</span>
              </div>
            </div>

            <PaymentElement
              options={{
                layout: "tabs",
                wallets: {
                  applePay: "never",
                  googlePay: "never",
                }
              }}
            />
          </div>
        ) : (
          <div className="p-4 bg-[#F9ECEF]/70 border border-[#EBC3CC] rounded-xl text-xs text-[#4A3A31] space-y-2">
            <p className="font-semibold text-[#C88D9A]">
              Integrovaná platební brána Stripe (Testovací režim)
            </p>
            <p className="text-[11px] text-[#7D6B62]">
              Kliknutím na tlačítko níže simulujete úspěšnou platbu ve výši <strong>{totalDisplay}</strong>.
            </p>
          </div>
        )}

        {errorMessage && (
          <p className="text-xs text-red-500 font-medium">{errorMessage}</p>
        )}
      </div>

      <Button
        type="submit"
        variant="gold"
        size="lg"
        isLoading={isProcessing}
        className="w-full font-bold shadow-lg text-base py-4"
      >
        <Lock className="w-4 h-4 mr-2" />
        Zaplatit {totalDisplay}
      </Button>

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full text-center text-xs text-[#7D6B62] hover:text-[#4A3A31] py-1 transition hover:underline cursor-pointer"
        >
          ← Zpět k úpravě doručovacích údajů
        </button>
      )}

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7D6B62]">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Bezpečná platba přes Stripe • 256-bit SSL šifrování</span>
      </div>
    </form>
  );
}

interface StripePaymentProps {
  clientSecret: string;
  orderId: string;
  orderNumber: string;
  totalDisplay: string;
  onCancel?: () => void;
}

export function StripePayment({
  clientSecret,
  orderId,
  orderNumber,
  totalDisplay,
  onCancel,
}: StripePaymentProps) {
  // If no Stripe publishable key is set, render the form in test mode
  if (!stripePromise || !clientSecret.startsWith("pi_")) {
    return (
      <PaymentFormInternal
        orderId={orderId}
        orderNumber={orderNumber}
        totalDisplay={totalDisplay}
        onCancel={onCancel}
      />
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        locale: "cs",
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#C88D9A",
            colorBackground: "#ffffff",
            colorText: "#4A3A31",
            colorDanger: "#ef4444",
            fontFamily: "system-ui, sans-serif",
            borderRadius: "12px",
          },
        },
      }}
    >
      <PaymentFormInternal
        orderId={orderId}
        orderNumber={orderNumber}
        totalDisplay={totalDisplay}
        onCancel={onCancel}
      />
    </Elements>
  );
}

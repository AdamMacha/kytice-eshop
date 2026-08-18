"use client";

import React, { useState } from "react";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Lock, CreditCard, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function PaymentFormInternal({
  orderId,
  orderNumber,
  totalDisplay,
}: {
  orderId: string;
  orderNumber: string;
  totalDisplay: string;
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
      <div className="p-5 bg-white rounded-2xl border border-[#E8D9CE] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#4A3A31]">
          <CreditCard className="w-4 h-4 text-[#C88D9A]" />
          <span>Platební údaje karty</span>
        </div>

        {stripePromise ? (
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        ) : (
          <div className="p-4 bg-[#F9ECEF]/70 border border-[#EBC3CC] rounded-xl text-xs text-[#4A3A31] space-y-2">
            <p className="font-semibold text-[#C88D9A]">
              Integrovaná platební brána Stripe (Testovací režim)
            </p>
            <p className="text-[11px] text-[#7D6B62]">
              Kliknutím na tlačítko níže simulujete úspěšnou platbu kartou.
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
        className="w-full font-bold shadow-lg"
      >
        <Lock className="w-4 h-4 mr-2" />
        Zaplatit {totalDisplay} kartou
      </Button>
    </form>
  );
}

interface StripePaymentProps {
  clientSecret: string;
  orderId: string;
  orderNumber: string;
  totalDisplay: string;
}

export function StripePayment({
  clientSecret,
  orderId,
  orderNumber,
  totalDisplay,
}: StripePaymentProps) {
  // If no Stripe publishable key is set, render the form in test mode
  if (!stripePromise || !clientSecret.startsWith("pi_")) {
    return (
      <PaymentFormInternal
        orderId={orderId}
        orderNumber={orderNumber}
        totalDisplay={totalDisplay}
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
      />
    </Elements>
  );
}

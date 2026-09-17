import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AgeGateModal } from "@/components/shared/age-gate-modal";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { BRAND } from "@/lib/constants";

const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://www.moodbox.cz"
  ),
  title: {
    template: "%s | MoodBox Bloom",
    default: "MoodBox Bloom | Originální sladké kytice a dárkové boxy",
  },
  description:
    "Originální ručně tvořené sladké kytice a dárkové boxy s prémiovou čokoládou a alkoholem. Doprava po Praze zdarma i po celé ČR přes Zásilkovnu.",
  keywords: [
    "čokokytice",
    "sladké kytice",
    "dárkové boxy",
    "dárek pro ženy",
    "kytice z čokolády",
    "kytice s alkoholem",
    "MoodBox Bloom",
    "Praha",
  ],
  authors: [{ name: BRAND.owner }],
  creator: BRAND.name,
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: "https://www.moodbox.cz",
    siteName: BRAND.name,
    title: "MoodBox Bloom | Originální sladké kytice",
    description: BRAND.tagline,
    images: [
      {
        url: "/products/pink-edition.png",
        width: 1200,
        height: 630,
        alt: "MoodBox Bloom Kytice",
      },
    ],
  },
  icons: {
    icon: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#C88D9A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="cs"
      className={`${playfair.variable} ${jakarta.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#EBC3CC] selection:text-[#4A3A31]">
        <CartProvider>
          <AgeGateModal />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsent />
        </CartProvider>
      </body>
    </html>
  );
}

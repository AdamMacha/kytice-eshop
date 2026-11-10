import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AgeGateModal } from "@/components/shared/age-gate-modal";
import { CookieConsent } from "@/components/shared/cookie-consent";
import { BRAND } from "@/lib/constants";
import { getWebSiteSchema, getStoreSchema } from "@/lib/schema";

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

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.moodbox.cz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | MoodBox Bloom",
    default: "MoodBox Bloom | Originální sladké kytice a dárkové boxy",
  },
  description:
    "Originální ručně tvořené sladké kytice a dárkové boxy s prémiovou čokoládou a alkoholem. Osobní rozvoz po Praze zdarma a bezpečné doručení po celé ČR přes Zásilkovnu.",
  keywords: [
    "čokokytice",
    "sladké kytice",
    "kytice z čokolády",
    "čokoládové kytice",
    "dárkové boxy",
    "kytice s alkoholem",
    "kytice s vínem",
    "kytice s proseccem",
    "dárek pro ženy",
    "dárek pro muže",
    "originální dárky",
    "dárek k narozeninám",
    "dárek k výročí",
    "rozvoz kytic Praha",
    "MoodBox Bloom",
    "Praha",
  ],
  authors: [{ name: BRAND.owner, url: siteUrl }],
  creator: BRAND.name,
  publisher: BRAND.name,
  applicationName: "MoodBox Bloom",
  alternates: {
    canonical: "./",
    languages: {
      "cs-CZ": siteUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: siteUrl,
    siteName: BRAND.name,
    title: "MoodBox Bloom | Originální sladké kytice a dárkové boxy",
    description:
      "Ručně tvořené sladké kytice a dárkové boxy s prémiovou čokoládou a alkoholem. Osobní doručení po Praze zdarma i po celé ČR přes Zásilkovnu.",
    images: [
      {
        url: "/products/pink-edition.png",
        width: 1200,
        height: 630,
        alt: "MoodBox Bloom – Sladké kytice s alkoholem a čokoládou",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoodBox Bloom | Originální sladké kytice a dárkové boxy",
    description:
      "Ručně tvořené sladké kytice a dárkové boxy s prémiovou čokoládou a alkoholem. Doprava po Praze zdarma.",
    images: ["/products/pink-edition.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [{ url: "/icon.png", sizes: "180x180", type: "image/png" }],
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
  const structuredData = [getWebSiteSchema(), getStoreSchema()];

  return (
    <html
      lang="cs"
      className={`${playfair.variable} ${jakarta.variable} scroll-smooth`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
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

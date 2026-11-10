import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nákupní košík",
  description: "Obsah vašeho nákupního košíku v e-shopu MoodBox Bloom.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


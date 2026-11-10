import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pokladna a dokončení objednávky",
  description: "Dokončení objednávky a platba v e-shopu MoodBox Bloom.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


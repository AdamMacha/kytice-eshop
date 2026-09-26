import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { ROUTES } from "@/lib/constants";
import { ProductDetailClient } from "./product-detail-client";
import { ProductCard } from "@/components/product/product-card";
import { ChevronRight } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const products = await db.product.findMany({ select: { slug: true } });
    if (products.length > 0) {
      return products.map((product) => ({ slug: product.slug }));
    }
  } catch (err) {
    console.warn("[generateStaticParams] Falling back to static slugs:", err);
  }

  return [
    { slug: "pink-edition" },
    { slug: "red-passion" },
    { slug: "blue-dream" },
    { slug: "magic-bloom" },
    { slug: "golden-elegance" },
  ];
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });

  if (!product) {
    return { title: "Produkt nenalezen" };
  }

  return {
    title: `${product.name} | MoodBox Bloom`,
    description: product.description,
    openGraph: {
      title: `${product.name} - ${product.subtitle} | MoodBox Bloom`,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });

  if (!product) {
    notFound();
  }

  const allProducts = await db.product.findMany({ where: { inStock: true } });
  const relatedProducts = allProducts
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[#7D6B62]">
        <Link href={ROUTES.home} className="hover:text-[#C88D9A] transition">
          Domů
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          href={ROUTES.boxes}
          className="hover:text-[#C88D9A] transition"
        >
          Boxy
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-[#4A3A31]">{product.name}</span>
      </nav>

      {/* Main product view with Client Component for interactive Cart & Quantity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/5 w-full rounded-3xl overflow-hidden bg-[#F3E7DF] border border-[#E8D9CE] shadow-lg">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-6">
          <ProductDetailClient product={product} />
        </div>
      </div>

      {/* Related Products */}
      <div className="pt-12 border-t border-[#E8D9CE] space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#A87938] font-bold">
              Další z nabídky
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#4A3A31]">
              Mohlo by se vám také líbit
            </h2>
          </div>
          <Link
            href={ROUTES.boxes}
            className="text-xs font-semibold text-[#C88D9A] hover:underline flex items-center gap-1"
          >
            <span>Všechny boxy</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((relProduct) => (
            <ProductCard key={relProduct.slug} product={relProduct} />
          ))}
        </div>
      </div>
    </div>
  );
}

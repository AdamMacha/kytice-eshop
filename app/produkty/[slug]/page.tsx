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
import { getProductSchema, getBreadcrumbSchema } from "@/lib/schema";
import type { Product } from "@/types/product";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });

  if (!product) {
    return { title: "Produkt nenalezen" };
  }

  const categoryName =
    product.category === "MINI_BOUQUET"
      ? "Kytice mini"
      : product.category === "BOX"
      ? "Dárkový box"
      : "Sladká kytice";

  const metaDescription = `${product.name} – ${product.subtitle}. Originální ${categoryName.toLowerCase()} z prémiové čokolády a vybraného alkoholu. ${product.description}`;

  return {
    title: `${product.name} – ${product.subtitle}`,
    description: metaDescription,
    alternates: {
      canonical: `/produkty/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} – ${product.subtitle} | MoodBox Bloom`,
      description: metaDescription,
      url: `/produkty/${product.slug}`,
      type: "website",
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: `${product.name} – sladká kytice s čokoládou a alkoholem`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} – ${product.subtitle} | MoodBox Bloom`,
      description: metaDescription,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const productData = await db.product.findUnique({ where: { slug } });

  if (!productData) {
    notFound();
  }

  const product = productData as unknown as Product;

  const allProductsData = await db.product.findMany({ where: { inStock: true } });
  const allProducts = allProductsData as unknown as Product[];
  const relatedProducts = allProducts
    .filter((p) => p.slug !== product.slug)
    .slice(0, 3);

  const categoryName =
    product.category === "MINI_BOUQUET"
      ? "Kytice mini"
      : product.category === "BOX"
      ? "Boxy"
      : "Sladké kytice";

  const categoryUrl =
    product.category === "MINI_BOUQUET"
      ? ROUTES.mini
      : product.category === "BOX"
      ? ROUTES.boxes
      : ROUTES.products;

  const productSchema = getProductSchema(product);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Domů", url: "/" },
    { name: categoryName, url: categoryUrl },
    { name: product.name, url: `/produkty/${product.slug}` },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Schema.org Product & BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([productSchema, breadcrumbSchema]),
        }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Drobečková navigace" className="flex items-center gap-2 text-xs text-[#7D6B62]">
        <Link href={ROUTES.home} className="hover:text-[#C88D9A] transition">
          Domů
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={categoryUrl} className="hover:text-[#C88D9A] transition">
          {categoryName}
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
              alt={`${product.name} – ručně vázaná sladká kytice s alkoholem a čokoládou`}
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
            href={categoryUrl}
            className="text-xs font-semibold text-[#C88D9A] hover:underline flex items-center gap-1"
          >
            <span>Všechny {categoryName.toLowerCase()}</span>
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

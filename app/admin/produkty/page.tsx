import React from "react";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { products } from "@/data/products";
import { db } from "@/lib/db";
import { ProductManagerClient } from "./product-manager-client";

export default async function AdminProductsPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  // Merge static catalog with any database overrides
  let dbProducts: any[] = [];
  try {
    dbProducts = await db.product.findMany();
  } catch {
    dbProducts = [];
  }

  const mergedProducts = products.map((staticP) => {
    const dbP = dbProducts.find((p) => p.slug === staticP.slug);
    if (dbP) {
      return {
        ...staticP,
        price: dbP.price,
        priceHalere: dbP.priceHalere,
        inStock: dbP.inStock,
      };
    }
    return staticP;
  });

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest text-[#A87938] font-bold">
          Administrace
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#4A3A31]">
          Kytice, Ceník & Dostupnost
        </h1>
        <p className="text-xs text-[#7D6B62] mt-1">
          Zapínejte a vypínejte dostupnost jednotlivých edic kytic a upravujte
          jejich prodejní ceny.
        </p>
      </div>

      <ProductManagerClient initialProducts={mergedProducts} />
    </div>
  );
}

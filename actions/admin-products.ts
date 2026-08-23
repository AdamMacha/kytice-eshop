"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleProductStockAction(slug: string, inStock: boolean) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "Neautorizovaný přístup." };
  }

  try {
    // Upsert in database
    await db.product.upsert({
      where: { slug },
      update: { inStock },
      create: {
        slug,
        name: slug,
        subtitle: "",
        description: "",
        price: 999,
        priceHalere: 99900,
        image: `/products/${slug}.png`,
        alcoholDetails: "",
        inStock,
      },
    });

    revalidatePath("/");
    revalidatePath("/produkty");
    revalidatePath(`/produkty/${slug}`);
    revalidatePath("/admin/produkty");
    return { success: true };
  } catch (error: any) {
    console.error("[Admin Product Stock Error]:", error);
    return { success: false, error: error.message || "Chyba při změně dostupnosti." };
  }
}

export async function updateProductPriceAction(slug: string, priceCZK: number) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "Neautorizovaný přístup." };
  }

  try {
    await db.product.upsert({
      where: { slug },
      update: {
        price: priceCZK,
        priceHalere: priceCZK * 100,
      },
      create: {
        slug,
        name: slug,
        subtitle: "",
        description: "",
        price: priceCZK,
        priceHalere: priceCZK * 100,
        image: `/products/${slug}.png`,
        alcoholDetails: "",
        inStock: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/produkty");
    revalidatePath(`/produkty/${slug}`);
    revalidatePath("/admin/produkty");
    return { success: true };
  } catch (error: any) {
    console.error("[Admin Product Price Error]:", error);
    return { success: false, error: error.message || "Chyba při změně ceny." };
  }
}

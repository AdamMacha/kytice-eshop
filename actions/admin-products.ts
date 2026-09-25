"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

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

export async function upsertProductAction(data: any) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "Neautorizovaný přístup." };
  }

  try {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    
    await db.product.upsert({
      where: { slug },
      update: {
        name: data.name,
        subtitle: data.subtitle,
        description: data.description,
        price: data.price,
        priceHalere: data.price * 100,
        image: data.image,
        containsAlcohol: data.containsAlcohol,
        alcoholDetails: data.alcoholDetails,
        color: data.color,
        inStock: data.inStock,
      },
      create: {
        slug,
        name: data.name,
        subtitle: data.subtitle,
        description: data.description,
        price: data.price,
        priceHalere: data.price * 100,
        image: data.image,
        containsAlcohol: data.containsAlcohol,
        alcoholDetails: data.alcoholDetails,
        color: data.color,
        inStock: data.inStock,
      },
    });

    revalidatePath("/");
    revalidatePath("/produkty");
    revalidatePath(`/produkty/${slug}`);
    revalidatePath("/admin/produkty");
    return { success: true, slug };
  } catch (error: any) {
    console.error("[Admin Upsert Product Error]:", error);
    return { success: false, error: error.message || "Chyba při ukládání produktu." };
  }
}

export async function uploadProductImageAction(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "Neautorizovaný přístup." };
  }

  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, error: "Nebyl nahrán žádný soubor." };

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".png";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
    
    const uploadDir = path.join(process.cwd(), "public/products");
    await fs.mkdir(uploadDir, { recursive: true });
    
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    return { success: true, url: `/products/${filename}` };
  } catch (error: any) {
    console.error("[Admin Upload Image Error]:", error);
    return { success: false, error: error.message || "Chyba při nahrávání obrázku." };
  }
}

"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
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
        category: data.category || "BOUQUET",
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
        category: data.category || "BOUQUET",
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
    if (!file || !file.size) {
      return { success: false, error: "Nebyl nahrán žádný soubor." };
    }

    if (file.size > 8 * 1024 * 1024) {
      return { success: false, error: "Velikost obrázku nesmí překročit 8 MB." };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let mimeType = file.type;
    if (!mimeType || !mimeType.startsWith("image/")) {
      const ext = path.extname(file.name).toLowerCase();
      if (ext === ".webp") mimeType = "image/webp";
      else if (ext === ".png") mimeType = "image/png";
      else if (ext === ".gif") mimeType = "image/gif";
      else if (ext === ".svg") mimeType = "image/svg+xml";
      else mimeType = "image/jpeg";
    }

    const saved = await db.uploadedImage.create({
      data: {
        filename: file.name,
        mimeType,
        data: buffer,
      },
    });

    return { success: true, url: `/api/images/${saved.id}` };
  } catch (error: any) {
    console.error("[Admin Upload Image Error]:", error);
    return { success: false, error: error.message || "Chyba při ukládání obrázku do databáze." };
  }
}

"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateStoreSettingsAction(formData: FormData) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "Neautorizovaný přístup." };
  }

  try {
    const phone = (formData.get("phone") as string) || "776 208 814";
    const email = (formData.get("email") as string) || "moodboxcz@gmail.cz";
    const address = (formData.get("address") as string) || "Hlavní 28, Průhonice 25243";
    const announcement = (formData.get("announcement") as string) || "";
    const packetaPickupPrice = parseInt((formData.get("packetaPickupPrice") as string) || "89", 10);
    const packetaAddressPrice = parseInt((formData.get("packetaAddressPrice") as string) || "129", 10);
    const codFee = parseInt((formData.get("codFee") as string) || "30", 10);

    await db.storeSetting.upsert({
      where: { id: "default" },
      update: {
        phone,
        email,
        address,
        announcement,
        packetaPickupPrice,
        packetaAddressPrice,
        codFee,
      },
      create: {
        id: "default",
        phone,
        email,
        address,
        announcement,
        packetaPickupPrice,
        packetaAddressPrice,
        codFee,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/nastaveni");
    return { success: true };
  } catch (error: any) {
    console.error("[Admin Store Settings Error]:", error);
    return { success: false, error: error.message || "Chyba při ukládání nastavení." };
  }
}

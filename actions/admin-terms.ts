"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateTermsAction(content: string) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return { success: false, error: "Neautorizovaný přístup." };
  }

  try {
    await db.storeSetting.upsert({
      where: { id: "default" },
      update: {
        termsAndConditions: content,
      },
      create: {
        id: "default",
        termsAndConditions: content,
      },
    });

    revalidatePath("/obchodni-podminky");
    revalidatePath("/admin/obchodni-podminky");
    return { success: true };
  } catch (error: any) {
    console.error("[Admin Update Terms Error]:", error);
    return {
      success: false,
      error: error.message || "Chyba při ukládání obchodních podmínek.",
    };
  }
}

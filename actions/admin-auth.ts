"use server";

import {
  verifyAdminPassword,
  setAdminSession,
  clearAdminSession,
} from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export async function loginAdminAction(formData: FormData): Promise<void> {
  const password = formData.get("password") as string;

  if (!password || !verifyAdminPassword(password)) {
    redirect("/admin/login?error=Nespr%C3%A1vn%C3%A9+administr%C3%A1torsk%C3%A9+heslo.");
  }

  await setAdminSession();
  redirect("/admin");
}

export async function logoutAdminAction(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}

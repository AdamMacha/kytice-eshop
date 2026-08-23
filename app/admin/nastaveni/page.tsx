import React from "react";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { SettingsFormClient } from "./settings-form-client";

export default async function AdminSettingsPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  let settings: any = {};
  try {
    settings =
      (await db.storeSetting.findUnique({
        where: { id: "default" },
      })) || {};
  } catch {
    settings = {};
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest text-[#A87938] font-bold">
          Administrace
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#4A3A31]">
          Nastavení obchodu MoodBox
        </h1>
        <p className="text-xs text-[#7D6B62] mt-1">
          Upravujte kontaktní údaje, ceny poštovného a texty pro zákazníky
        </p>
      </div>

      <SettingsFormClient settings={settings} />
    </div>
  );
}

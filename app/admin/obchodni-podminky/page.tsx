import React from "react";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DEFAULT_TERMS_MARKDOWN } from "@/data/default-terms";
import { TermsEditorClient } from "./terms-editor-client";

export default async function AdminTermsPage() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const storeSetting = await db.storeSetting.findUnique({
    where: { id: "default" },
  });

  const initialContent =
    storeSetting?.termsAndConditions?.trim() || DEFAULT_TERMS_MARKDOWN;

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs uppercase tracking-widest text-[#A87938] font-bold">
          Administrace
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#4A3A31]">
          Editace obchodních podmínek
        </h1>
        <p className="text-xs text-[#7D6B62] mt-1">
          Zde můžete editovat celé znění obchodních podmínek pro váš e-shop (/obchodni-podminky)
        </p>
      </div>

      <TermsEditorClient initialContent={initialContent} />
    </div>
  );
}

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { logoutAdminAction } from "@/actions/admin-auth";
import {
  LayoutDashboard,
  ShoppingBag,
  Flower2,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Administrace | MoodBox Bloom",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAdminAuthenticated();

  // If not authenticated, render without admin sidebar (login page will handle itself)
  if (!isAuth) {
    return <>{children}</>;
  }

  const navItems = [
    { href: "/admin", label: "Přehled", icon: LayoutDashboard },
    { href: "/admin/objednavky", label: "Objednávky", icon: ShoppingBag },
    { href: "/admin/produkty", label: "Kytice & Ceník", icon: Flower2 },
    { href: "/admin/nastaveni", label: "Nastavení obchodu", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4F0] flex flex-col md:flex-row text-[#4A3A31]">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-[#E8D9CE] flex flex-col justify-between p-6 shadow-xs shrink-0">
        <div className="space-y-8">
          {/* Logo & Shop name */}
          <div className="flex items-center gap-3 pb-6 border-b border-[#F0E4DC]">
            <div className="relative w-9 h-9">
              <Image
                src="/logo.png"
                alt="MoodBox Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base leading-tight">
                MoodBox Admin
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#C88D9A]">
                Správa e-shopu
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#4A3A31] hover:bg-[#F9ECEF] hover:text-[#C88D9A] transition"
                >
                  <Icon className="w-4 h-4 text-[#A87938]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-3 pt-6 border-t border-[#F0E4DC]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-2 rounded-xl text-xs font-medium text-[#7D6B62] hover:bg-[#F3E7DF] transition"
          >
            <span>Přejít na e-shop</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Odhlásit se</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

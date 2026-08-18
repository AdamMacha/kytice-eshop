import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "gold" | "alcohol" | "success" | "muted";
}

export function Badge({
  className,
  variant = "primary",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    primary: "bg-[#F9ECEF] text-[#C88D9A] border border-[#EBC3CC]",
    gold: "bg-[#FBF6EE] text-[#A87938] border border-[#E6C89C]",
    alcohol: "bg-[#FFF4E5] text-[#B76E00] border border-[#FFE0B2] font-semibold",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    muted: "bg-[#EFE8E1] text-[#7D6B62] border border-[#E0D4C8]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

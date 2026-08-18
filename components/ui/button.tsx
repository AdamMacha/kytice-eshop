import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "gold" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]";

    const variantStyles = {
      primary:
        "bg-[#C88D9A] text-white hover:bg-[#B67886] focus:ring-[#C88D9A] shadow-md shadow-[#C88D9A]/20 hover:shadow-lg hover:shadow-[#C88D9A]/30",
      secondary:
        "bg-[#EBC3CC] text-[#4A3A31] hover:bg-[#DEAFB9] focus:ring-[#EBC3CC]",
      gold:
        "bg-gradient-to-r from-[#D4AF7F] to-[#C39967] text-white hover:from-[#C89F6B] hover:to-[#B68A57] focus:ring-[#D4AF7F] shadow-md shadow-[#D4AF7F]/25 hover:shadow-lg hover:shadow-[#D4AF7F]/35",
      outline:
        "border border-[#C88D9A] text-[#4A3A31] hover:bg-[#C88D9A]/10 focus:ring-[#C88D9A]",
      ghost:
        "text-[#4A3A31] hover:bg-[#EBC3CC]/30 focus:ring-[#EBC3CC]",
    };

    const sizeStyles = {
      sm: "text-xs px-4 py-2 gap-1.5",
      md: "text-sm px-6 py-3 gap-2",
      lg: "text-base px-8 py-4 gap-2.5 font-semibold",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

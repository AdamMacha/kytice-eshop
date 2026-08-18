import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-[#4A3A31]"
          >
            {label}
            {props.required && <span className="text-[#C88D9A] ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-white/90 border border-[#E8D9CE] rounded-xl text-sm text-[#4A3A31] placeholder-[#A4948B] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#C88D9A]/30 focus:border-[#C88D9A] disabled:bg-gray-100 disabled:cursor-not-allowed",
            error && "border-red-400 focus:ring-red-200 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-xs text-[#7D6B62] mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

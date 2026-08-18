import React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className="space-y-1">
        <label
          htmlFor={inputId}
          className="flex items-start gap-3 cursor-pointer select-none group"
        >
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            className={cn(
              "mt-0.5 h-4 w-4 rounded border-[#E8D9CE] text-[#C88D9A] focus:ring-[#C88D9A] focus:ring-offset-0 cursor-pointer accent-[#C88D9A]",
              className
            )}
            {...props}
          />
          <span className="text-xs leading-relaxed text-[#4A3A31] group-hover:text-[#2E221B]">
            {label}
          </span>
        </label>
        {error && <p className="text-xs text-red-500 ml-7">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

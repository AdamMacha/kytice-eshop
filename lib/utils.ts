import { type ClassValue, clsx } from "clsx";

/**
 * Merge class names with clsx (Tailwind-friendly).
 * Lightweight alternative — no twMerge needed for this project size.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Generate a unique order number.
 * Format: MB-YYYY-XXXXX where X is random.
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  const prefix = process.env.ORDER_NUMBER_PREFIX || "MB";
  return `${prefix}-${year}-${random}`;
}

/**
 * Sleep for a given number of milliseconds.
 * Useful for simulating delays in development.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safely parse JSON from a string, returning null on failure.
 */
export function safeJsonParse<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + "…";
}

/**
 * Format a price in haléře to CZK display string.
 * @example formatCZK(99900) => "999 Kč"
 * @example formatCZK(8900) => "89 Kč"
 * @example formatCZK(0) => "Zdarma"
 */
export function formatCZK(halere: number): string {
  if (halere === 0) return "Zdarma";

  const czk = halere / 100;

  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
    maximumFractionDigits: czk % 1 === 0 ? 0 : 2,
  }).format(czk);
}

/**
 * Format a CZK whole number to display string.
 * @example formatCZKFromWhole(999) => "999 Kč"
 */
export function formatCZKFromWhole(czk: number): string {
  if (czk === 0) return "Zdarma";

  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(czk);
}

/**
 * Format a Czech phone number for display.
 * @example formatPhone("776208814") => "+420 776 208 814"
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const digits = cleaned.startsWith("420")
    ? cleaned.slice(3)
    : cleaned;

  if (digits.length !== 9) return phone;

  return `+420 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

/**
 * Format a date for Czech locale display.
 * @example formatDate(new Date()) => "18. 8. 2026"
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Format a date with time for Czech locale.
 * @example formatDateTime(new Date()) => "18. 8. 2026, 14:30"
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Format an order number from a sequential ID.
 * @example formatOrderNumber(1) => "MB-2026-00001"
 */
export function formatOrderNumber(
  sequentialId: number,
  prefix: string = "MB"
): string {
  const year = new Date().getFullYear();
  const padded = String(sequentialId).padStart(5, "0");
  return `${prefix}-${year}-${padded}`;
}

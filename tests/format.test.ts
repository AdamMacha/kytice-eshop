import { describe, it, expect } from "vitest";
import { formatCZK, formatCZKFromWhole, formatPhone } from "@/lib/format";

describe("Formatting Utilities", () => {
  it("formats prices in haléře correctly into CZK", () => {
    expect(formatCZK(0)).toBe("Zdarma");
    expect(formatCZK(99900)).toContain("999");
    expect(formatCZK(8900)).toContain("89");
    expect(formatCZK(12900)).toContain("129");
  });

  it("formats whole CZK prices correctly", () => {
    expect(formatCZKFromWhole(0)).toBe("Zdarma");
    expect(formatCZKFromWhole(999)).toContain("999");
  });

  it("formats Czech phone numbers correctly", () => {
    expect(formatPhone("776208814")).toBe("+420 776 208 814");
    expect(formatPhone("+420776208814")).toBe("+420 776 208 814");
  });
});

import { describe, it, expect } from "vitest";
import { products, getProductBySlug } from "@/data/products";

describe("Product Catalog Integrity", () => {
  it("contains all 5 bouquets specified in requirements", () => {
    expect(products.length).toBe(5);
  });

  it("ensures each product has a valid price, image, and 18+ alcohol notice", () => {
    products.forEach((product) => {
      expect(product.price).toBe(999);
      expect(product.priceHalere).toBe(99900);
      expect(product.image).toBeDefined();
      expect(product.containsAlcohol).toBe(true);
      expect(product.alcoholDetails.length).toBeGreaterThan(0);
    });
  });

  it("can find each product by its slug", () => {
    expect(getProductBySlug("pink-edition")?.name).toBe("Pink Edition");
    expect(getProductBySlug("red-passion")?.name).toBe("Red Passion");
    expect(getProductBySlug("blue-dream")?.name).toBe("Blue Dream");
    expect(getProductBySlug("magic-bloom")?.name).toBe("Magic Bloom");
    expect(getProductBySlug("golden-elegance")?.name).toBe("Golden Elegance");
  });
});

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.moodbox.cz";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/pokladna/", "/objednavka/potvrzeni"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

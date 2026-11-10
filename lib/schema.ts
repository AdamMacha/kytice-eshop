import { BRAND } from "@/lib/constants";
import type { Product } from "@/types/product";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.moodbox.cz";

/**
 * WebSite schema for search box and brand recognition
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: BRAND.name,
    description: BRAND.tagline,
    inLanguage: "cs-CZ",
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: BRAND.name,
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
    },
  };
}

/**
 * OnlineStore & LocalBusiness schema
 */
export function getStoreSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["OnlineStore", "Florist", "LocalBusiness"],
    "@id": `${BASE_URL}/#store`,
    name: BRAND.name,
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    image: `${BASE_URL}/products/pink-edition.png`,
    description:
      "Ručně tvořené sladké kytice a dárkové boxy s prémiovou čokoládou a alkoholem. Osobní doručení po Praze zdarma i po celé ČR přes Zásilkovnu.",
    telephone: BRAND.phoneFormatted,
    email: BRAND.email,
    priceRange: "$$",
    currenciesAccepted: "CZK",
    paymentAccepted: "Credit Card, Cash, Cash on delivery",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Hlavní 28",
      addressLocality: "Průhonice",
      postalCode: "25243",
      addressCountry: "CZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 50.0028,
      longitude: 14.5617,
    },
    areaServed: [
      {
        "@type": "City",
        name: "Praha",
      },
      {
        "@type": "Country",
        name: "Česká republika",
      },
    ],
    founder: {
      "@type": "Person",
      name: BRAND.owner,
    },
    sameAs: [
      "https://www.instagram.com/moodbox.bloom",
    ],
  };
}

/**
 * Product JSON-LD schema
 */
export function getProductSchema(product: Product) {
  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${BASE_URL}${product.image}`;

  const categoryName =
    product.category === "MINI_BOUQUET"
      ? "Kytice mini"
      : product.category === "BOX"
      ? "Dárkové boxy"
      : "Sladké kytice";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${BASE_URL}/produkty/${product.slug}#product`,
    name: product.name,
    image: [imageUrl],
    description: product.description,
    sku: product.slug,
    category: categoryName,
    brand: {
      "@type": "Brand",
      name: BRAND.name,
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/produkty/${product.slug}`,
      priceCurrency: "CZK",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: BRAND.name,
        url: BASE_URL,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "CZK",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "CZ",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          businessDays: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
            ],
          },
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "CZ",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnCustomerResponsibility",
      },
    },
  };
}

/**
 * BreadcrumbList schema
 */
export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * ItemList schema for catalog listing pages
 */
export function getItemListSchema(
  items: { name: string; slug: string; image?: string; price?: number }[],
  listName: string,
  catalogUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    url: catalogUrl.startsWith("http") ? catalogUrl : `${BASE_URL}${catalogUrl}`,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${BASE_URL}/produkty/${item.slug}`,
      ...(item.image
        ? {
            image: item.image.startsWith("http")
              ? item.image
              : `${BASE_URL}${item.image}`,
          }
        : {}),
    })),
  };
}

/**
 * FAQPage schema
 */
export function getFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}


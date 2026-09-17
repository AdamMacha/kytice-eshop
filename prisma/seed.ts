import { PrismaClient } from "@prisma/client";
import { products } from "../data/products";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed default store settings if not exists
  await prisma.storeSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "MoodBox Bloom",
      phone: "776 208 814",
      email: "moodboxcz@gmail.com",
      address: "Hlavní 28, Průhonice 25243",
      ico: "23965878",
      pragueShippingPrice: 0,
      packetaPickupPrice: 89,
      packetaAddressPrice: 129,
      codFee: 30,
      announcement: "Doprava zdarma po Praze | Ručně tvořené sladké kytice s alkoholem",
    },
  });

  // Seed products
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        subtitle: product.subtitle,
        description: product.description,
        price: product.price,
        priceHalere: product.priceHalere,
        image: product.image,
        containsAlcohol: product.containsAlcohol,
        alcoholDetails: product.alcoholDetails,
        color: product.color,
        inStock: product.inStock,
      },
      create: {
        slug: product.slug,
        name: product.name,
        subtitle: product.subtitle,
        description: product.description,
        price: product.price,
        priceHalere: product.priceHalere,
        image: product.image,
        containsAlcohol: product.containsAlcohol,
        alcoholDetails: product.alcoholDetails,
        color: product.color,
        inStock: product.inStock,
      },
    });
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

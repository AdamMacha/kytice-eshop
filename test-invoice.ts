import { generateInvoice } from "./lib/pdf";
import { sendEmail } from "./lib/email";

async function run() {
  const mockOrder = {
    orderNumber: "MB-2026-TEST",
    createdAt: new Date(),
    firstName: "Test",
    lastName: "Zákazník",
    billingStreet: "Testovací 123",
    billingCity: "Praha",
    billingZip: "11000",
    billingCountry: "CZ",
    email: "spartak123@email.cz",
    phone: "123456789",
    paymentMethod: "STRIPE_CARD",
    shippingMethod: "PRAGUE_DELIVERY",
    shippingPrice: 0,
    codFee: 0,
    totalPrice: 199800,
    items: [
      {
        productName: "Pink Edition Kytice",
        quantity: 2,
        unitPrice: 99900,
        totalPrice: 199800,
      }
    ]
  };

  const storeSettings = {
    storeName: "MoodBox Bloom",
    address: "Hlavní 28, Průhonice 25243",
    ico: "23965878",
    email: "moodboxcz@gmail.com",
    phone: "776 208 814"
  };

  console.log("Generating invoice PDF...");
  const invoiceBuffer = await generateInvoice(mockOrder, storeSettings);

  const fs = await import("fs");
  fs.writeFileSync("test-faktura.pdf", invoiceBuffer);
  console.log("Faktura uložena jako test-faktura.pdf!");
}

run().catch(console.error);

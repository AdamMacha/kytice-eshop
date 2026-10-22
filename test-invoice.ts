import { generateInvoice } from "./lib/pdf";
import { sendEmail } from "./lib/email";

async function run() {
  const mockOrder = {
    orderNumber: "MB-2026-32518",
    createdAt: new Date(),
    firstName: "Kateřina",
    lastName: "Janovská",
    billingStreet: "Hlavní 28",
    billingCity: "Průhonice",
    billingZip: "252 43",
    billingCountry: "CZ",
    email: "katerina.janovska@nadaniadovednosti.cz",
    phone: "776 208 814",
    paymentMethod: "STRIPE_CARD",
    shippingMethod: "PRAGUE_DELIVERY",
    shippingPrice: 0,
    codFee: 0,
    totalPrice: 1500,
    items: [
      {
        productName: "Blue Dream",
        quantity: 1,
        unitPrice: 1500,
        totalPrice: 1500,
      }
    ]
  };

  const storeSettings = {
    storeName: "Kateřina Janovská",
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

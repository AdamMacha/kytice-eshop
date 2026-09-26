import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { formatCZKFromWhole } from "./format";

export async function generateInvoice(order: any, store: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const buffers: Buffer[] = [];
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // Load fonts
      const fontRegular = path.join(process.cwd(), "public/fonts/Roboto-Regular.ttf");
      const fontBold = path.join(process.cwd(), "public/fonts/Roboto-Bold.ttf");

      if (fs.existsSync(fontRegular) && fs.existsSync(fontBold)) {
        doc.font(fontRegular);
      }

      const drawText = (text: string, x: number, y: number, options: any = {}) => {
        if (options.bold && fs.existsSync(fontBold)) doc.font(fontBold);
        else if (fs.existsSync(fontRegular)) doc.font(fontRegular);
        doc.text(text, x, y, options);
      };

      const invoiceDate = new Date(order.createdAt).toLocaleDateString("cs-CZ");
      
      // Header
      drawText("FAKTURA - DAŇOVÝ DOKLAD", 50, 50, { bold: true, size: 20 });
      drawText(`Číslo: ${order.orderNumber}`, 50, 75, { size: 12 });

      doc.moveTo(50, 95).lineTo(545, 95).strokeColor("#E8D9CE").stroke();

      // Supplier & Customer columns
      const topY = 110;

      // Supplier
      drawText("Dodavatel:", 50, topY, { bold: true, size: 10, color: "#7D6B62" });
      doc.fillColor("#4A3A31");
      drawText(store.storeName, 50, topY + 15, { bold: true, size: 12 });
      drawText(store.address, 50, topY + 30, { size: 10 });
      drawText(`IČO: ${store.ico}`, 50, topY + 45, { size: 10 });
      drawText(`Email: ${store.email}`, 50, topY + 60, { size: 10 });
      drawText(`Tel: ${store.phone}`, 50, topY + 75, { size: 10 });

      // Customer
      drawText("Odběratel:", 300, topY, { bold: true, size: 10, color: "#7D6B62" });
      doc.fillColor("#4A3A31");
      drawText(`${order.firstName} ${order.lastName}`, 300, topY + 15, { bold: true, size: 12 });
      drawText(`${order.billingStreet}`, 300, topY + 30, { size: 10 });
      drawText(`${order.billingZip} ${order.billingCity}`, 300, topY + 45, { size: 10 });
      drawText(order.billingCountry, 300, topY + 60, { size: 10 });
      drawText(`Email: ${order.email}`, 300, topY + 75, { size: 10 });
      drawText(`Tel: ${order.phone}`, 300, topY + 90, { size: 10 });

      // Dates
      const dateY = 220;
      drawText("Datum vystavení:", 50, dateY, { size: 10, color: "#7D6B62" });
      doc.fillColor("#4A3A31");
      drawText(invoiceDate, 150, dateY, { size: 10, bold: true });

      drawText("Datum splatnosti:", 50, dateY + 15, { size: 10, color: "#7D6B62" });
      doc.fillColor("#4A3A31");
      drawText(invoiceDate, 150, dateY + 15, { size: 10, bold: true });

      drawText("Způsob úhrady:", 300, dateY, { size: 10, color: "#7D6B62" });
      doc.fillColor("#4A3A31");
      drawText(order.paymentMethod === "STRIPE_CARD" ? "Platební karta" : "Dobírka", 400, dateY, { size: 10, bold: true });

      // Items Table Header
      const tableTop = 270;
      doc.moveTo(50, tableTop).lineTo(545, tableTop).strokeColor("#E8D9CE").stroke();
      
      drawText("Položka", 50, tableTop + 10, { bold: true, size: 10, color: "#7D6B62" });
      drawText("Množství", 350, tableTop + 10, { bold: true, size: 10 });
      drawText("Cena za ks", 420, tableTop + 10, { bold: true, size: 10 });
      drawText("Celkem", 500, tableTop + 10, { bold: true, size: 10 });

      doc.moveTo(50, tableTop + 25).lineTo(545, tableTop + 25).strokeColor("#E8D9CE").stroke();

      // Items
      let y = tableTop + 35;
      doc.fillColor("#4A3A31");
      order.items.forEach((item: any) => {
        drawText(item.productName, 50, y, { size: 10 });
        drawText(item.quantity.toString(), 350, y, { size: 10 });
        drawText(formatCZKFromWhole(item.unitPrice), 420, y, { size: 10 });
        drawText(formatCZKFromWhole(item.totalPrice), 500, y, { size: 10 });
        y += 20;
      });

      // Shipping
      if (order.shippingPrice > 0 || order.shippingMethod !== "PRAGUE_DELIVERY") {
        let shippingName = "Doprava";
        if (order.shippingMethod === "PACKETA_PICKUP") shippingName = "Zásilkovna - výdejní místo";
        if (order.shippingMethod === "PACKETA_ADDRESS") shippingName = "Zásilkovna - doručení na adresu";
        if (order.shippingMethod === "PRAGUE_DELIVERY") shippingName = "Osobní doručení po Praze";

        drawText(shippingName, 50, y, { size: 10 });
        drawText("1", 350, y, { size: 10 });
        drawText(formatCZKFromWhole(order.shippingPrice), 420, y, { size: 10 });
        drawText(formatCZKFromWhole(order.shippingPrice), 500, y, { size: 10 });
        y += 20;
      }

      // COD Fee
      if (order.codFee > 0) {
        drawText("Poplatek za dobírku", 50, y, { size: 10 });
        drawText("1", 350, y, { size: 10 });
        drawText(formatCZKFromWhole(order.codFee), 420, y, { size: 10 });
        drawText(formatCZKFromWhole(order.codFee), 500, y, { size: 10 });
        y += 20;
      }

      doc.moveTo(50, y + 10).lineTo(545, y + 10).strokeColor("#E8D9CE").stroke();

      // Total
      y += 30;
      drawText("Celkem k úhradě:", 350, y, { bold: true, size: 14, color: "#4A3A31" });
      drawText(formatCZKFromWhole(order.totalPrice), 460, y, { bold: true, size: 14, color: "#C88D9A" });

      // Footer
      const pageHeight = doc.page.height;
      doc.moveTo(50, pageHeight - 70).lineTo(545, pageHeight - 70).strokeColor("#E8D9CE").stroke();
      drawText("Děkujeme za váš nákup!", 50, pageHeight - 55, { size: 10, color: "#7D6B62", align: "center", width: 495 });
      drawText("Nejsme plátci DPH.", 50, pageHeight - 40, { size: 9, color: "#7D6B62", align: "center", width: 495 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

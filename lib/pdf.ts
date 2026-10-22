import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { formatInvoicePrice, formatPhone } from "./format";
import { BRAND } from "./constants";

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
        if (options.bold && fs.existsSync(fontBold)) {
          doc.font(fontBold);
        } else if (fs.existsSync(fontRegular)) {
          doc.font(fontRegular);
        }
        if (options.size) {
          doc.fontSize(options.size);
        }
        if (options.color) {
          doc.fillColor(options.color);
        }
        const { bold, size, color, ...restOptions } = options;
        doc.text(text, x, y, restOptions);
      };

      const drawBlock = (
        startX: number,
        startY: number,
        blockWidth: number,
        lines: Array<{ text?: string | null; bold?: boolean; size?: number; color?: string }>
      ) => {
        let currY = startY;
        for (const item of lines) {
          if (!item || !item.text) continue;
          const size = item.size || 9.5;
          const isBold = !!item.bold;
          if (isBold && fs.existsSync(fontBold)) doc.font(fontBold);
          else if (fs.existsSync(fontRegular)) doc.font(fontRegular);
          doc.fontSize(size);
          doc.fillColor(item.color || "#4A3A31");

          doc.text(item.text, startX, currY, {
            width: blockWidth,
            lineBreak: true,
          });
          const height = doc.heightOfString(item.text, { width: blockWidth });
          currY += height + 3.5;
        }
        return currY;
      };

      const invoiceDate = new Date(order.createdAt).toLocaleDateString("cs-CZ");

      // Header
      drawText("FAKTURA – DAŇOVÝ DOKLAD", 50, 50, { bold: true, size: 18, color: "#4A3A31" });
      drawText(`Číslo dokladu: ${order.orderNumber}`, 50, 74, { size: 11, color: "#7D6B62" });

      doc.moveTo(50, 95).lineTo(545, 95).strokeColor("#E8D9CE").stroke();

      // Supplier name: must be Kateřina's name as requested ("u dodavatele musí být moje jméno ne moodbox")
      const supplierName =
        store?.storeName && store.storeName !== "MoodBox Bloom"
          ? store.storeName
          : (BRAND.owner || "Kateřina Janovská");

      const supplierLines = [
        { text: "Dodavatel:", bold: true, size: 10, color: "#7D6B62" },
        { text: supplierName, bold: true, size: 12, color: "#4A3A31" },
        { text: store?.address || BRAND.address, size: 9.5, color: "#4A3A31" },
        { text: `IČO: ${store?.ico || BRAND.ico}`, size: 9.5, color: "#4A3A31" },
        { text: `Email: ${store?.email || BRAND.email}`, size: 9.5, color: "#4A3A31" },
        { text: `Tel: ${formatPhone(store?.phone || BRAND.phone)}`, size: 9.5, color: "#4A3A31" },
      ];

      const customerCityZip = [order.billingZip, order.billingCity].filter(Boolean).join(" ");
      const customerCountry =
        !order.billingCountry || order.billingCountry === "CZ"
          ? "Česká republika"
          : order.billingCountry;

      const customerLines = [
        { text: "Odběratel:", bold: true, size: 10, color: "#7D6B62" },
        { text: `${order.firstName} ${order.lastName}`, bold: true, size: 12, color: "#4A3A31" },
        { text: order.billingStreet, size: 9.5, color: "#4A3A31" },
        { text: customerCityZip, size: 9.5, color: "#4A3A31" },
        { text: customerCountry, size: 9.5, color: "#4A3A31" },
        { text: `Email: ${order.email}`, size: 9.5, color: "#4A3A31" },
        { text: `Tel: ${formatPhone(order.phone)}`, size: 9.5, color: "#4A3A31" },
      ];

      const topY = 110;
      const supplierBottomY = drawBlock(50, topY, 230, supplierLines);
      const customerBottomY = drawBlock(300, topY, 245, customerLines);

      // Dates section
      const dateY = Math.max(supplierBottomY, customerBottomY) + 12;
      doc.moveTo(50, dateY - 6).lineTo(545, dateY - 6).strokeColor("#F3E7DF").stroke();

      drawText("Datum vystavení:", 50, dateY, { size: 9.5, color: "#7D6B62" });
      drawText(invoiceDate, 150, dateY, { size: 9.5, bold: true, color: "#4A3A31" });

      drawText("Datum splatnosti:", 50, dateY + 16, { size: 9.5, color: "#7D6B62" });
      drawText(invoiceDate, 150, dateY + 16, { size: 9.5, bold: true, color: "#4A3A31" });

      drawText("Způsob úhrady:", 300, dateY, { size: 9.5, color: "#7D6B62" });
      drawText(
        order.paymentMethod === "STRIPE_CARD" ? "Online platební karta" : "Dobírka",
        400,
        dateY,
        { size: 9.5, bold: true, color: "#4A3A31" }
      );

      // Items Table Header
      const tableTop = dateY + 45;
      doc.moveTo(50, tableTop).lineTo(545, tableTop).strokeColor("#E8D9CE").stroke();

      drawText("Položka", 50, tableTop + 8, { bold: true, size: 9.5, color: "#7D6B62" });
      drawText("Množství", 325, tableTop + 8, { bold: true, size: 9.5, color: "#7D6B62", align: "center", width: 45 });
      drawText("Cena za ks", 375, tableTop + 8, { bold: true, size: 9.5, color: "#7D6B62", align: "right", width: 75 });
      drawText("Celkem", 455, tableTop + 8, { bold: true, size: 9.5, color: "#7D6B62", align: "right", width: 90 });

      doc.moveTo(50, tableTop + 24).lineTo(545, tableTop + 24).strokeColor("#E8D9CE").stroke();

      // Items
      let y = tableTop + 34;
      order.items.forEach((item: any) => {
        const itemHeight = Math.max(
          doc.heightOfString(item.productName, { width: 270 }),
          14
        );
        drawText(item.productName, 50, y, { size: 9.5, color: "#4A3A31", width: 270 });
        drawText(item.quantity.toString(), 325, y, { size: 9.5, color: "#4A3A31", align: "center", width: 45 });
        drawText(formatInvoicePrice(item.unitPrice), 375, y, { size: 9.5, color: "#4A3A31", align: "right", width: 75 });
        drawText(formatInvoicePrice(item.totalPrice), 455, y, { size: 9.5, color: "#4A3A31", align: "right", width: 90 });
        y += itemHeight + 6;
      });

      // Shipping
      if (order.shippingMethod) {
        let shippingName = "Doprava";
        if (order.shippingMethod === "PACKETA_PICKUP") {
          shippingName = `Zásilkovna – výdejní místo${order.packetaPointName ? ` (${order.packetaPointName})` : ""}`;
        } else if (order.shippingMethod === "PACKETA_ADDRESS") {
          shippingName = "Zásilkovna – doručení na adresu";
        } else if (order.shippingMethod === "PRAGUE_DELIVERY") {
          shippingName = "Osobní doručení po Praze";
        }

        const shipHeight = Math.max(doc.heightOfString(shippingName, { width: 270 }), 14);
        drawText(shippingName, 50, y, { size: 9.5, color: "#4A3A31", width: 270 });
        drawText("1", 325, y, { size: 9.5, color: "#4A3A31", align: "center", width: 45 });
        drawText(formatInvoicePrice(order.shippingPrice), 375, y, { size: 9.5, color: "#4A3A31", align: "right", width: 75 });
        drawText(formatInvoicePrice(order.shippingPrice), 455, y, { size: 9.5, color: "#4A3A31", align: "right", width: 90 });
        y += shipHeight + 6;
      }

      // COD Fee
      if (order.codFee > 0) {
        drawText("Příplatek za dobírku", 50, y, { size: 9.5, color: "#4A3A31", width: 270 });
        drawText("1", 325, y, { size: 9.5, color: "#4A3A31", align: "center", width: 45 });
        drawText(formatInvoicePrice(order.codFee), 375, y, { size: 9.5, color: "#4A3A31", align: "right", width: 75 });
        drawText(formatInvoicePrice(order.codFee), 455, y, { size: 9.5, color: "#4A3A31", align: "right", width: 90 });
        y += 20;
      }

      doc.moveTo(50, y + 4).lineTo(545, y + 4).strokeColor("#E8D9CE").stroke();

      // Total
      y += 20;
      drawText("Celkem k úhradě:", 250, y, { bold: true, size: 12, color: "#4A3A31", align: "right", width: 170 });
      drawText(formatInvoicePrice(order.totalPrice), 430, y, { bold: true, size: 14, color: "#C88D9A", align: "right", width: 115 });

      // Footer
      const pageHeight = doc.page.height;
      doc.moveTo(50, pageHeight - 75).lineTo(545, pageHeight - 75).strokeColor("#E8D9CE").stroke();
      drawText("Děkujeme za váš nákup!", 50, pageHeight - 60, { size: 9.5, color: "#7D6B62", align: "center", width: 495 });
      drawText("Fyzická osoba zapsaná v živnostenském rejstříku. Nejsme plátci DPH.", 50, pageHeight - 45, { size: 8.5, color: "#7D6B62", align: "center", width: 495 });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

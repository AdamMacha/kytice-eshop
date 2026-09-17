"use server";

import { contactFormSchema, type ContactFormData } from "@/schemas/contact";
import { sendEmail } from "@/lib/email";
import { BRAND } from "@/lib/constants";

export interface ContactActionResult {
  success: boolean;
  error?: string;
}

export async function submitContactMessage(
  data: ContactFormData
): Promise<ContactActionResult> {
  try {
    const validated = contactFormSchema.parse(data);

    // Send email to store owner
    await sendEmail({
      to: BRAND.email,
      subject: `✉️ Nová zpráva z webu: ${validated.name}`,
      html: `
        <div style="font-family: sans-serif; color: #4A3A31; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E8D9CE; border-radius: 12px;">
          <h2 style="color: #C88D9A; margin-top: 0;">Nová zpráva z kontaktního formuláře</h2>
          <p><strong>Odesílatel:</strong> ${validated.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${validated.email}">${validated.email}</a></p>
          <hr style="border: none; border-top: 1px solid #E8D9CE; margin: 15px 0;" />
          <p><strong>Zpráva / Poptávka na míru:</strong></p>
          <div style="background: #FDFBF7; padding: 15px; border-radius: 8px; font-size: 14px; white-space: pre-wrap; line-height: 1.6;">${validated.message}</div>
        </div>
      `,
    });

    // Send auto-reply to customer
    try {
      await sendEmail({
        to: validated.email,
        subject: `Děkujeme za vaši zprávu | MoodBox Bloom`,
        html: `
          <div style="font-family: sans-serif; color: #4A3A31; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E8D9CE; border-radius: 12px;">
            <h2 style="color: #C88D9A; margin-top: 0;">Dobrý den, ${validated.name},</h2>
            <p>děkujeme za vaši zprávu! Byla v pořádku doručena a ozvu se vám co nejdříve.</p>
            <hr style="border: none; border-top: 1px solid #E8D9CE; margin: 15px 0;" />
            <p style="font-size: 12px; color: #7D6B62;">MoodBox Bloom – Kateřina Janovská<br />Tel: ${BRAND.phoneFormatted}<br />Email: ${BRAND.email}</p>
          </div>
        `,
      });
    } catch {
      // Auto-reply failure is non-fatal
    }

    return { success: true };
  } catch (err: any) {
    console.error("[Contact Action Error]:", err);
    return {
      success: false,
      error:
        err?.errors?.[0]?.message ||
        err?.message ||
        "Zprávu se nepodařilo odeslat. Zkuste to prosím znovu.",
    };
  }
}

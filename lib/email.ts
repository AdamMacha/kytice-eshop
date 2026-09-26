import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn(
    "RESEND_API_KEY is not set — emails will not be sent"
  );
}

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const EMAIL_FROM =
  process.env.EMAIL_FROM || "MoodBox Bloom <objednavky@moodbox.cz>";

/**
 * Send an email using Resend.
 * Gracefully logs a warning in development if API key is not set.
 */
export async function sendEmail({
  to,
  subject,
  html,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: { filename: string; content: Buffer }[];
}) {
  if (!resend) {
    console.warn(
      `[Email] Would send to ${to}: "${subject}" (RESEND_API_KEY not set)`
    );
    return null;
  }

  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    html,
    attachments,
  });

  if (error) {
    console.error("[Email] Failed to send:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return data;
}

import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "moodbox_admin_token";
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_SECRET_TOKEN =
  process.env.ADMIN_SECRET_TOKEN || "moodbox_bloom_secret_admin_session_token_2026";

/**
 * Check if the current request has a valid admin session cookie.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return token === ADMIN_SECRET_TOKEN;
}

/**
 * Verify admin password.
 */
export function verifyAdminPassword(password: string): boolean {
  return password === DEFAULT_ADMIN_PASSWORD;
}

/**
 * Set the admin session cookie.
 */
export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, ADMIN_SECRET_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear the admin session cookie.
 */
export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}

import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Content Security Policy
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://widget.packeta.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://widget.packeta.com;
    img-src 'self' data: blob: https://*.stripe.com https://widget.packeta.com https://*.zasilkovna.cz;
    font-src 'self' https://fonts.gstatic.com data:;
    frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://widget.packeta.com;
    connect-src 'self' https://api.stripe.com https://widget.packeta.com https://www.zasilkovna.cz;
    base-uri 'self';
    form-action 'self';
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const response = NextResponse.next();

  // Security Headers
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|products/|logo.png).*)",
  ],
};

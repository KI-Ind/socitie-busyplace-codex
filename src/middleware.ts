import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { randomBytes } from 'crypto';

export function middleware(request: NextRequest) {
  // Don't apply CSP to service worker
  if (request.nextUrl.pathname === '/sw.js') {
    return NextResponse.next();
  }

  const nonce = randomBytes(16).toString('base64');
  const response = NextResponse.next();
  const headers = response.headers;
  headers.set('X-Nonce', nonce);

  // Content Security Policy
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' https://cdnjs.cloudflare.com blob: https://api.mapbox.com`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.mapbox.com",
      "img-src 'self' data: https: blob: https://*.mapbox.com https://api.mapbox.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.societe.busyplace.fr https://*.mapbox.com https://api.mapbox.com https://events.mapbox.com",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "child-src blob:",
      "frame-ancestors 'none'"
    ].join('; ')
  );

  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff');

  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY');

  // XSS Protection
  headers.set('X-XSS-Protection', '1; mode=block');

  // HSTS (uncomment in production)
  // headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Referrer Policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(self)'
  );

  return response;
}

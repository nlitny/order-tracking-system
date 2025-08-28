// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { v4 as uuidv4 } from "uuid";

const PUBLIC_PATHS = ["/auth", "/"];

const isPublicPath = (path: string) => {
  return PUBLIC_PATHS.some(
    (publicPath) =>
      path === publicPath ||
      path.startsWith(`${publicPath}/`) ||
      path.startsWith("/api/") ||
      path.startsWith("/_next/static/") ||
      path.startsWith("/_next/image/") ||
      path.match(
        /\.(jpg|jpeg|png|gif|svg|webp|ico|bmp|tiff|css|js|woff|woff2|ttf|eot)$/i
      )
  );
};

const generateCSPHeader = (nonce: string, request: NextRequest) => {
  const isDev = process.env.NODE_ENV === "development";
  const apiDomain =
    process.env.NEXT_PUBLIC_API_URL_API || "http://localhost:3001";

  if (isDev) {
    return `
      default-src 'self' 'unsafe-inline' 'unsafe-eval' *;
      script-src 'self' 'unsafe-inline' 'unsafe-eval' * https://js.stripe.com;
      style-src 'self' 'unsafe-inline' *;
      img-src 'self' data: blob: https: *;
      font-src 'self' https: data: *;
      connect-src 'self' * ${apiDomain} https://api.stripe.com https://js.stripe.com;
      frame-src 'self' * https://js.stripe.com https://hooks.stripe.com;
      media-src 'self' https: data: blob: *;
      object-src 'none';
    `
      .replace(/\s+/g, " ")
      .trim();
  }
  return `
      default-src 'self' 'unsafe-inline' 'unsafe-eval' *;
      script-src 'self' 'unsafe-inline' 'unsafe-eval' * https://js.stripe.com;
      style-src 'self' 'unsafe-inline' *;
      img-src 'self' data: blob: https: *;
      font-src 'self' https: data: *;
      connect-src 'self' * ${apiDomain} https://api.stripe.com https://js.stripe.com;
      frame-src 'self' * https://js.stripe.com https://hooks.stripe.com;
      media-src 'self' https: data: blob: *;
      object-src 'none';
    `
    .replace(/\s+/g, " ")
    .trim();
};
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/assets/") ||
    pathname === "/favicon.ico" ||
    pathname.match(
      /\.(jpg|jpeg|png|gif|svg|webp|ico|bmp|tiff|css|js|woff|woff2|ttf|eot)$/i
    )
  ) {
    return NextResponse.next();
  }

  const nonce = Buffer.from(uuidv4()).toString("base64");
  const cspHeader = generateCSPHeader(nonce, request);

  if (isPublicPath(pathname)) {
    const response = NextResponse.next();
    response.headers.set("Content-Security-Policy", cspHeader);
    response.headers.set("x-nonce", nonce);
    return response;
  }

  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("callbackUrl", encodeURI(request.url));
      const response = NextResponse.redirect(loginUrl);
      response.headers.set("Content-Security-Policy", cspHeader);
      return response;
    }

    const userRoles = (token.roles as String) || [];

    if (token.error === "InvalidRefreshToken") {
      const response = NextResponse.redirect(new URL("/auth", request.url));
      response.headers.set("Content-Security-Policy", cspHeader);
      return response;
    }

    const response = NextResponse.next();
    response.headers.set("Content-Security-Policy", cspHeader);
    response.headers.set("x-nonce", nonce);

    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "origin-when-cross-origin");

    return response;
  } catch (error) {
    const response = NextResponse.redirect(new URL("/auth", request.url));
    response.headers.set("Content-Security-Policy", cspHeader);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

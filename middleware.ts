import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "eo_admin_token";

/**
 * Fast-path only: bounces requests with no session cookie at all straight
 * to /login. It does not verify the token or check role — that happens
 * server-side in requireAdmin() (lib/auth/session.ts), which actually asks
 * the backend. This just rules out "not logged in at all" before that
 * (slower, network-bound) check runs.
 */
export function middleware(request: NextRequest) {
  const hasToken = !!request.cookies.get(SESSION_COOKIE)?.value;

  if (!hasToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/products/:path*",
    "/inventory/:path*",
    "/orders/:path*",
    "/delivery/:path*",
    "/laundry/:path*",
    "/payments/:path*",
    "/customers/:path*",
    "/analytics/:path*",
    "/notifications/:path*",
    "/settings/:path*",
  ],
};

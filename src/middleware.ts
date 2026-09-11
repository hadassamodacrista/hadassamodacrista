import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublic =
    pathname === "/admin/login" || pathname === "/api/admin/login";

  if (isPublic) return NextResponse.next();

  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const valid = secret ? await verifySessionToken(token, secret) : false;

  if (!valid) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

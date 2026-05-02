import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ACCESS_COOKIE = "access_token";

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Alias without hyphen (e.g. /logwork/debt -> /log-work/debt).
  if (pathname === "/logwork" || pathname.startsWith("/logwork/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/logwork(?=\/|$)/, "/log-work");
    return NextResponse.redirect(url);
  }

  // Protect LogWork routes.
  if (pathname.startsWith("/log-work")) {
    const token = req.cookies.get(ACCESS_COOKIE)?.value;
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", `${pathname}${search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Already logged in -> avoid staying on /login
  if (pathname === "/login") {
    const token = req.cookies.get(ACCESS_COOKIE)?.value;
    if (token) {
      const next = req.nextUrl.searchParams.get("next") ?? "/log-work/checkin";
      const url = req.nextUrl.clone();
      url.pathname = next;
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/log-work/:path*", "/logwork", "/logwork/:path*", "/login"],
};


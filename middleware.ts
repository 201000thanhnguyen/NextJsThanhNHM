import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { verifyAccessToken } from "@/lib/auth/verify-access-token"
import { canAccessAdminPanel } from "@/lib/auth/roles"
import { postLoginDestination } from "@/lib/auth/post-login-destination"

const ACCESS_COOKIE = "access_token"

/** `/log-work/*` and `/logwork/*` → `/admin/log-work/*` (no duplicate pages). */
function legacyLogWorkToAdmin(pathname: string) {
  const normalized = pathname.replace(/^\/logwork(?=\/|$)/, "/log-work")
  let p = normalized.replace(/^\/log-work/, "/admin/log-work")
  p = p.replace("/checkin/overview", "/overview")
  p = p.replace(/^\/admin\/log-work\/debt(?=\/|$)/, "/admin/log-work/debt-management")
  if (
    p === "/admin/log-work/quote" ||
    (p.startsWith("/admin/log-work/quote/") &&
      !p.startsWith("/admin/log-work/quote-management"))
  ) {
    p = p.replace("/admin/log-work/quote", "/admin/log-work/quote-management")
  }
  return p
}

/** Flat `/admin/*` URLs from the previous migration → nested `/admin/log-work/*`. */
function redirectFlatAdminLogWork(pathname: string) {
  const exact: Record<string, string> = {
    "/admin/checkin": "/admin/log-work/checkin",
    "/admin/overview": "/admin/log-work/overview",
    "/admin/checkin/attendance": "/admin/log-work/attendance",
    "/admin/checkin/shifts": "/admin/log-work/shifts",
    "/admin/checkin/bonus": "/admin/log-work/bonus",
    "/admin/debt": "/admin/log-work/debt-management",
    "/admin/quote": "/admin/log-work/quote-management",
  }
  if (exact[pathname]) return exact[pathname]
  if (pathname.startsWith("/admin/debt/")) {
    return pathname.replace("/admin/debt/", "/admin/log-work/debt-management/")
  }
  return null
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  if (pathname === "/logwork" || pathname.startsWith("/logwork/")) {
    const url = req.nextUrl.clone()
    url.pathname = legacyLogWorkToAdmin(pathname)
    url.search = search
    return NextResponse.redirect(url, 308)
  }

  if (pathname.startsWith("/log-work")) {
    const url = req.nextUrl.clone()
    url.pathname = legacyLogWorkToAdmin(pathname)
    url.search = search
    return NextResponse.redirect(url, 308)
  }

  const flatRedirect = redirectFlatAdminLogWork(pathname)
  if (flatRedirect) {
    const url = req.nextUrl.clone()
    url.pathname = flatRedirect
    url.search = search
    return NextResponse.redirect(url, 308)
  }

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get(ACCESS_COOKIE)?.value
    if (!token) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = "/login"
      loginUrl.searchParams.set("next", `${pathname}${search}`)
      return NextResponse.redirect(loginUrl)
    }
    try {
      const session = await verifyAccessToken(token)
      if (!canAccessAdminPanel(session.role)) {
        const url = req.nextUrl.clone()
        url.pathname = "/"
        url.searchParams.set("error", "forbidden")
        return NextResponse.redirect(url)
      }
    } catch {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = "/login"
      loginUrl.searchParams.set("next", `${pathname}${search}`)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (pathname === "/login") {
    const token = req.cookies.get(ACCESS_COOKIE)?.value
    if (token) {
      try {
        const session = await verifyAccessToken(token)
        const nextParam = req.nextUrl.searchParams.get("next")
        const dest = postLoginDestination(session.role, nextParam)
        const url = req.nextUrl.clone()
        url.pathname = dest
        url.search = ""
        return NextResponse.redirect(url)
      } catch {
        /* allow login */
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/log-work/:path*",
    "/logwork",
    "/logwork/:path*",
    "/login",
  ],
}

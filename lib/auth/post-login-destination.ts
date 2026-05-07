import type { AdminRole } from "@/lib/auth/types"
import { canAccessAdminPanel } from "@/lib/auth/roles"

/**
 * Where to send the browser after a successful login (or when already authed on /login).
 * Admins default to `/admin/dashboard` unless `next` is already an admin path.
 * Users never land on `/admin/*` from this helper.
 */
export function postLoginDestination(
  role: AdminRole,
  nextParam: string | null
): string {
  const next =
    nextParam && nextParam.startsWith("/")
      ? nextParam
      : nextParam
        ? `/${nextParam}`
        : null

  if (canAccessAdminPanel(role)) {
    if (next?.startsWith("/admin")) {
      return next
    }
    return "/admin/dashboard"
  }

  if (next && !next.startsWith("/admin")) {
    return next
  }

  return "/"
}

export function parseRole(value: unknown): AdminRole | null {
  if (value === "SUPER_ADMIN" || value === "ADMIN" || value === "USER") {
    return value
  }
  return null
}

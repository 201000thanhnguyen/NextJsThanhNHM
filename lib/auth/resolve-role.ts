import type { AdminRole } from "@/lib/auth/types"

/**
 * Mirrors Nest `resolveRoleForUsername` for tokens issued before `role` was added to JWT,
 * or if the claim is missing/corrupt.
 */
export function resolveRoleFromUsername(username: string): AdminRole {
  const u = username.trim().toLowerCase()
  if (u === "admin") return "SUPER_ADMIN"
  if (u === "manager") return "ADMIN"
  return "USER"
}

import type { AdminRole } from "@/lib/auth/types"

export function canAccessAdminPanel(role: AdminRole): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN"
}

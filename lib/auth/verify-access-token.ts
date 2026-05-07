import { jwtVerify } from "jose"

import { getJwtSecretBytes } from "@/lib/auth/jwt-secret"
import { resolveRoleFromUsername } from "@/lib/auth/resolve-role"
import type { AdminRole, AdminSession } from "@/lib/auth/types"

export async function verifyAccessToken(token: string): Promise<AdminSession> {
  const { payload } = await jwtVerify(token, getJwtSecretBytes(), {
    algorithms: ["HS256"],
  })

  const username =
    typeof payload.username === "string" ? payload.username : null
  if (!username) {
    throw new Error("Invalid token: missing username")
  }

  const raw = payload.role
  let role: AdminRole
  if (raw === "SUPER_ADMIN" || raw === "ADMIN" || raw === "USER") {
    role = raw
  } else {
    role = resolveRoleFromUsername(username)
  }

  return {
    username,
    role,
    sub: String(payload.sub ?? ""),
  }
}

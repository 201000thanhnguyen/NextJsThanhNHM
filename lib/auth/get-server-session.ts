import { cookies } from "next/headers"

import { verifyAccessToken } from "@/lib/auth/verify-access-token"
import type { AdminSession } from "@/lib/auth/types"

const ACCESS_COOKIE = "access_token"

export async function getServerSession(): Promise<AdminSession | null> {
  const store = await cookies()
  const token = store.get(ACCESS_COOKIE)?.value
  if (!token) return null
  try {
    return await verifyAccessToken(token)
  } catch {
    return null
  }
}

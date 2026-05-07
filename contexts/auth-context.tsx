"use client"

import * as React from "react"

import type { AdminRole } from "@/lib/auth/types"
import { clearAdminClientSession } from "@/lib/auth/clear-client-session"
import { parseRole } from "@/lib/auth/post-login-destination"

export type AuthUser = {
  username: string
  role: AdminRole
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  refresh: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

async function fetchMe(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" })
  if (!res.ok) return null
  const data = (await res.json()) as {
    user?: { username?: string; role?: unknown }
  }
  const username = data.user?.username
  const role = parseRole(data.user?.role)
  if (typeof username !== "string" || !role) return null
  return { username, role }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null)
  const [loading, setLoading] = React.useState(true)

  const refresh = React.useCallback(async () => {
    setLoading(true)
    try {
      setUser(await fetchMe())
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void refresh()
  }, [refresh])

  const signOut = React.useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" })
    } finally {
      clearAdminClientSession()
      setUser(null)
      setLoading(false)
    }
  }, [])

  const value = React.useMemo(
    () => ({
      user,
      loading,
      refresh,
      signOut,
    }),
    [user, loading, refresh, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}

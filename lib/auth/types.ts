export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "USER"

export type AdminSession = {
  username: string
  role: AdminRole
  sub: string
}

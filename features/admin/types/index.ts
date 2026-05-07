import type { AdminRole } from "@/lib/auth/types"

export type { AdminRole }

export type UserStatus = "active" | "inactive" | "pending"

export interface DashboardUser {
  id: string
  fullName: string
  username: string
  email: string
  role: AdminRole
  department: string
  createdAt: string
  status: UserStatus
  avatarUrl: string | null
  initials: string
}

export interface WorkLogActivityPoint {
  label: string
  logs: number
}

export interface ProjectSlice {
  name: string
  value: number
  color: string
}

export interface DashboardStats {
  totalUsers: number
  totalWorkLogs: number
  todayCheckIns: number
  openTasks: number
}

export interface QuickStat {
  id: string
  label: string
  value: string
  hint: string
  trend?: "up" | "down" | "flat"
}

import type {
  DashboardStats,
  DashboardUser,
  ProjectSlice,
  QuickStat,
  WorkLogActivityPoint,
} from "@/features/admin/types"

export const mockDashboardStats: DashboardStats = {
  totalUsers: 1842,
  totalWorkLogs: 48291,
  todayCheckIns: 312,
  openTasks: 89,
}

export const mockWorkLogActivity: WorkLogActivityPoint[] = [
  { label: "Mon", logs: 420 },
  { label: "Tue", logs: 510 },
  { label: "Wed", logs: 380 },
  { label: "Thu", logs: 590 },
  { label: "Fri", logs: 640 },
  { label: "Sat", logs: 210 },
  { label: "Sun", logs: 180 },
]

export const mockProjectDistribution: ProjectSlice[] = [
  { name: "Platform", value: 32, color: "#404040" },
  { name: "Mobile", value: 24, color: "#737373" },
  { name: "Internal tools", value: 18, color: "#a3a3a3" },
  { name: "Client A", value: 15, color: "#d4d4d4" },
  { name: "Other", value: 11, color: "#e5e5e5" },
]

export const mockRecentUsers: DashboardUser[] = [
  {
    id: "1",
    fullName: "Alex Rivera",
    username: "arivera",
    email: "alex.rivera@company.io",
    role: "SUPER_ADMIN",
    department: "Engineering",
    createdAt: "2025-11-02",
    status: "active",
    avatarUrl: null,
    initials: "AR",
  },
  {
    id: "2",
    fullName: "Jordan Lee",
    username: "jlee",
    email: "jordan.lee@company.io",
    role: "ADMIN",
    department: "Operations",
    createdAt: "2025-12-18",
    status: "active",
    avatarUrl: null,
    initials: "JL",
  },
  {
    id: "3",
    fullName: "Sam Patel",
    username: "spatel",
    email: "sam.patel@company.io",
    role: "USER",
    department: "Product",
    createdAt: "2026-01-05",
    status: "pending",
    avatarUrl: null,
    initials: "SP",
  },
  {
    id: "4",
    fullName: "Taylor Morgan",
    username: "tmorgan",
    email: "taylor.morgan@company.io",
    role: "USER",
    department: "Design",
    createdAt: "2026-02-22",
    status: "inactive",
    avatarUrl: null,
    initials: "TM",
  },
  {
    id: "5",
    fullName: "Casey Nguyen",
    username: "cnguyen",
    email: "casey.nguyen@company.io",
    role: "ADMIN",
    department: "Engineering",
    createdAt: "2026-03-11",
    status: "active",
    avatarUrl: null,
    initials: "CN",
  },
]

export const mockQuickStats: QuickStat[] = [
  {
    id: "1",
    label: "Avg. hours / user",
    value: "6.4h",
    hint: "Last 30 days",
    trend: "up",
  },
  {
    id: "2",
    label: "Late check-ins",
    value: "12",
    hint: "This week",
    trend: "down",
  },
  {
    id: "3",
    label: "Departments active",
    value: "14",
    hint: "With ≥1 log",
    trend: "flat",
  },
  {
    id: "4",
    label: "SLA breaches",
    value: "3",
    hint: "Open incidents",
    trend: "down",
  },
]

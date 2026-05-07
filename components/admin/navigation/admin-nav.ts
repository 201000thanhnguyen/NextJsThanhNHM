import type { LucideIcon } from "lucide-react"
import {
  CalendarClock,
  FileSpreadsheet,
  Gift,
  Landmark,
  LayoutDashboard,
  LineChart,
  Timer,
  UserCheck,
} from "lucide-react"

export const ADMIN_DASHBOARD_HREF = "/admin/dashboard"

export const ADMIN_LOG_WORK_PREFIX = "/admin/log-work"

export type DashboardNavItem = {
  href: string
  label: string
  icon: LucideIcon
}

export const dashboardNavItem: DashboardNavItem = {
  href: ADMIN_DASHBOARD_HREF,
  label: "Dashboard",
  icon: LayoutDashboard,
}

export type LogWorkNavChild = {
  href: string
  label: string
  icon: LucideIcon
}

/** Child routes under `/admin/log-work/*` (single LogWork group in sidebar). */
export const logWorkNavChildren: LogWorkNavChild[] = [
  { href: `${ADMIN_LOG_WORK_PREFIX}/checkin`, label: "Check-in", icon: CalendarClock },
  { href: `${ADMIN_LOG_WORK_PREFIX}/overview`, label: "Overview", icon: LineChart },
  { href: `${ADMIN_LOG_WORK_PREFIX}/attendance`, label: "Attendance", icon: UserCheck },
  { href: `${ADMIN_LOG_WORK_PREFIX}/shifts`, label: "Shifts", icon: Timer },
  { href: `${ADMIN_LOG_WORK_PREFIX}/bonus`, label: "Bonus", icon: Gift },
  {
    href: `${ADMIN_LOG_WORK_PREFIX}/debt-management`,
    label: "Debt management",
    icon: Landmark,
  },
  {
    href: `${ADMIN_LOG_WORK_PREFIX}/quote-management`,
    label: "Quote management",
    icon: FileSpreadsheet,
  },
]

export function isDashboardActive(pathname: string | null): boolean {
  if (!pathname) return false
  return pathname === ADMIN_DASHBOARD_HREF || pathname === "/admin"
}

export function isLogWorkSectionPath(pathname: string | null): boolean {
  if (!pathname) return false
  return (
    pathname === ADMIN_LOG_WORK_PREFIX ||
    pathname.startsWith(`${ADMIN_LOG_WORK_PREFIX}/`)
  )
}

export function isLogWorkChildActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

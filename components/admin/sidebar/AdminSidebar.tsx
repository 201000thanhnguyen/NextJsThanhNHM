"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { BarChart3 } from "lucide-react"

import { LogWorkNavGroup } from "@/components/admin/sidebar/LogWorkNavGroup"
import { cn } from "@/lib/utils"
import {
  dashboardNavItem,
  isDashboardActive,
} from "@/components/admin/navigation/admin-nav"

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const IconDash = dashboardNavItem.icon
  const dashActive = isDashboardActive(pathname)

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950 text-zinc-300">
      <div className="flex h-14 items-center gap-2.5 border-b border-zinc-800/80 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-zinc-100 shadow-sm">
          <BarChart3 className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-zinc-50">
            WorkLog Admin
          </p>
          <p className="truncate text-xs text-zinc-500">Management console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Main">
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Link
            href={dashboardNavItem.href}
            onClick={() => onNavigate?.()}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
              dashActive
                ? "bg-zinc-800/90 text-zinc-50 shadow-sm"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
            )}
            aria-current={dashActive ? "page" : undefined}
          >
            <IconDash
              className={cn(
                "h-4 w-4 shrink-0",
                dashActive ? "text-zinc-100" : "text-zinc-500"
              )}
              aria-hidden
            />
            <span className="truncate">{dashboardNavItem.label}</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.04, duration: 0.2 }}
        >
          <LogWorkNavGroup onNavigate={onNavigate} />
        </motion.div>
      </nav>

      <div className="border-t border-zinc-800/80 p-4">
        <p className="text-xs leading-relaxed text-zinc-600">
          Authenticated workspace · v1.0
        </p>
      </div>
    </aside>
  )
}

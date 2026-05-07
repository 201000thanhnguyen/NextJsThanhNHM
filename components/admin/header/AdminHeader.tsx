"use client"

import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DateRangePicker } from "@/components/admin/header/DateRangePicker"
import { AdminUserMenu } from "@/components/admin/header/AdminUserMenu"
import type { AdminRole } from "@/lib/auth/types"
import { cn } from "@/lib/utils"

export function AdminHeader({
  userName,
  userRole,
  avatarUrl,
  initials,
  className,
}: {
  userName: string
  userRole: AdminRole
  avatarUrl?: string | null
  initials: string
  className?: string
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-neutral-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6",
        className
      )}
    >
      <div className="min-w-0 flex-1" />

      <div className="flex items-center gap-2 sm:gap-3">
        <DateRangePicker className="hidden min-w-[200px] md:flex lg:min-w-[240px]" />

        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-neutral-900 ring-2 ring-white" />
        </Button>

        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        <AdminUserMenu
          userName={userName}
          userRole={userRole}
          initials={initials}
          avatarUrl={avatarUrl}
        />
      </div>
    </header>
  )
}

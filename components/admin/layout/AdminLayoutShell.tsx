"use client"

import * as React from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AdminSidebar } from "@/components/admin/sidebar/AdminSidebar"
import { AdminHeader } from "@/components/admin/header/AdminHeader"
import { cn } from "@/lib/utils"
import type { AdminRole } from "@/lib/auth/types"

export function AdminLayoutShell({
  children,
  userName,
  userRole,
  initials,
}: {
  children: React.ReactNode
  userName: string
  userRole: AdminRole
  initials: string
}) {
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false)

  return (
    <div className="admin-shell flex min-h-screen bg-neutral-50 font-sans text-neutral-900 antialiased">
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] md:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 max-w-[85vw] transition-transform duration-200 ease-out md:static md:z-auto md:max-w-none md:translate-x-0",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <AdminSidebar onNavigate={() => setMobileNavOpen(false)} />
      </div>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col md:min-h-0">
        <div className="flex items-center gap-2 border-b border-neutral-200/80 bg-white/90 px-3 py-2 backdrop-blur-md md:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-lg border-neutral-200"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <span className="truncate text-sm font-semibold text-neutral-800">
            WorkLog Admin
          </span>
        </div>

        <AdminHeader
          userName={userName}
          userRole={userRole}
          initials={initials}
        />
        <main className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}

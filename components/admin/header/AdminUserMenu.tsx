"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RoleBadge } from "@/components/admin/badges/RoleBadge"
import { useAuth } from "@/contexts/auth-context"
import type { AdminRole } from "@/lib/auth/types"
import { cn } from "@/lib/utils"

export function AdminUserMenu({
  userName,
  userRole,
  initials,
  avatarUrl,
}: {
  userName: string
  userRole: AdminRole
  initials: string
  avatarUrl?: string | null
}) {
  const router = useRouter()
  const { signOut } = useAuth()
  const [loggingOut, setLoggingOut] = React.useState(false)

  async function handleLogout() {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await signOut()
      router.replace("/")
      router.refresh()
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          disabled={loggingOut}
          className={cn(
            "h-auto gap-2 rounded-lg border border-transparent px-2 py-1.5 text-left transition-colors duration-200",
            "hover:border-neutral-200 hover:bg-neutral-50/90",
            "focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2"
          )}
          aria-label="Account menu"
        >
          <Avatar className="h-8 w-8">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
            <AvatarFallback className="text-[10px] font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-medium text-neutral-900">
              {userName}
            </p>
            <div className="mt-0.5">
              <RoleBadge role={userRole} className="text-[9px]" />
            </div>
          </div>
          <ChevronDown className="hidden h-4 w-4 shrink-0 text-neutral-500 sm:block" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5" sideOffset={6}>
        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-normal text-neutral-500">
          Signed in as <span className="font-medium text-neutral-800">{userName}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-neutral-600" aria-hidden />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled
          className="flex cursor-not-allowed items-center gap-2 rounded-lg opacity-60"
        >
          <Settings className="h-4 w-4 text-neutral-600" aria-hidden />
          Settings
          <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-neutral-400">
            Soon
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-lg text-red-600 transition-colors duration-200",
            "focus:bg-red-50 focus:text-red-700"
          )}
          disabled={loggingOut}
          onSelect={() => {
            void handleLogout()
          }}
        >
          <LogOut className="h-4 w-4" aria-hidden />
          {loggingOut ? "Signing out…" : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

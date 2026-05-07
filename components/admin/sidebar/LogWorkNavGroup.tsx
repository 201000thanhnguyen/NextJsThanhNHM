"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, ChevronDown } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  isLogWorkChildActive,
  isLogWorkSectionPath,
  logWorkNavChildren,
} from "@/components/admin/navigation/admin-nav"
import { ADMIN_SIDEBAR_LOGWORK_KEY } from "@/lib/auth/clear-client-session"
import { cn } from "@/lib/utils"

function readStoredExpanded(): boolean | null {
  if (typeof window === "undefined") return null
  const v = window.localStorage.getItem(ADMIN_SIDEBAR_LOGWORK_KEY)
  if (v === "true") return true
  if (v === "false") return false
  return null
}

export function LogWorkNavGroup({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const inSection = isLogWorkSectionPath(pathname)
  const anyChildActive = logWorkNavChildren.some((c) =>
    isLogWorkChildActive(pathname, c.href)
  )

  const [open, setOpen] = React.useState(false)
  const [hydrated, setHydrated] = React.useState(false)
  const prevInSection = React.useRef(false)

  React.useEffect(() => {
    const stored = readStoredExpanded()
    if (stored !== null) {
      setOpen(stored)
    } else {
      setOpen(inSection)
    }
    setHydrated(true)
    prevInSection.current = inSection
  }, [])

  React.useEffect(() => {
    if (!hydrated) return
    if (inSection && !prevInSection.current) {
      setOpen(true)
    }
    prevInSection.current = inSection
  }, [inSection, hydrated])

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ADMIN_SIDEBAR_LOGWORK_KEY, next ? "true" : "false")
    }
  }

  return (
    <Collapsible open={open} onOpenChange={handleOpenChange} className="group">
      <CollapsibleTrigger
        type="button"
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-600",
          anyChildActive
            ? "bg-zinc-800/90 text-zinc-50 shadow-sm"
            : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
        )}
      >
        <Briefcase
          className={cn(
            "h-4 w-4 shrink-0",
            anyChildActive ? "text-zinc-100" : "text-zinc-500 group-hover:text-zinc-300"
          )}
          aria-hidden
        />
        <span className="min-w-0 flex-1 truncate">LogWork</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 ease-out",
            "group-data-[state=open]:rotate-180",
            anyChildActive && "text-zinc-300"
          )}
          aria-hidden
        />
      </CollapsibleTrigger>

      <CollapsibleContent
        className={cn(
          "overflow-hidden transition-[max-height] duration-300 ease-in-out",
          "data-[state=closed]:max-h-0 data-[state=open]:max-h-[min(100vh,720px)]"
        )}
      >
        <ul
          className="ml-1 space-y-0.5 border-l border-zinc-800/90 py-1 pl-2"
          role="list"
        >
          {logWorkNavChildren.map((item) => {
            const active = isLogWorkChildActive(pathname, item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => onNavigate?.()}
                  className={cn(
                    "flex items-center gap-2.5 rounded-md py-1.5 pl-2 pr-2 text-sm transition-colors duration-200",
                    active
                      ? "bg-zinc-800/80 font-medium text-zinc-50"
                      : "text-zinc-500 hover:bg-zinc-900/80 hover:text-zinc-200"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      active ? "text-zinc-200" : "text-zinc-600"
                    )}
                    aria-hidden
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

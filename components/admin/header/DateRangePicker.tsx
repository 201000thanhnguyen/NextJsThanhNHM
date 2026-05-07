"use client"

import * as React from "react"
import { CalendarRange } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ADMIN_DATE_DISPLAY_LOCALE } from "@/lib/admin/format-display-date"

function formatRange(from: string, to: string) {
  if (!from || !to) return "Select range"
  try {
    const a = new Date(from)
    const b = new Date(to)
    return `${a.toLocaleDateString(ADMIN_DATE_DISPLAY_LOCALE, {
      month: "short",
      day: "numeric",
    })} – ${b.toLocaleDateString(ADMIN_DATE_DISPLAY_LOCALE, {
      month: "short",
      day: "numeric",
      year: "numeric",
    })}`
  } catch {
    return "Select range"
  }
}

export function DateRangePicker({
  className,
  defaultFrom,
  defaultTo,
}: {
  className?: string
  defaultFrom?: string
  defaultTo?: string
}) {
  const [open, setOpen] = React.useState(false)
  const [from, setFrom] = React.useState(defaultFrom ?? "2026-04-01")
  const [to, setTo] = React.useState(defaultTo ?? "2026-05-07")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 justify-start gap-2 rounded-lg border-neutral-200 bg-white px-3 text-left text-sm font-normal text-neutral-700 shadow-sm transition-shadow hover:bg-neutral-50 hover:shadow",
            className
          )}
        >
          <CalendarRange className="h-4 w-4 text-neutral-500" aria-hidden />
          <span className="truncate">{formatRange(from, to)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-[280px]" align="end">
        <div className="space-y-3">
          <p className="text-xs font-medium text-neutral-500">Reporting period</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-500" htmlFor="range-from">
                From
              </label>
              <Input
                id="range-from"
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-neutral-500" htmlFor="range-to">
                To
              </label>
              <Input
                id="range-to"
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-lg"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="rounded-lg"
              onClick={() => setOpen(false)}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

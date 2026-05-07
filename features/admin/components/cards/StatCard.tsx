"use client"

import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  className,
}: {
  label: string
  value: string
  icon: LucideIcon
  hint?: string
  className?: string
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={cn("h-full", className)}
    >
      <Card className="h-full overflow-hidden rounded-xl border-neutral-200/90 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
        <CardContent className="flex items-start justify-between gap-4 p-5">
          <div className="min-w-0 space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
              {label}
            </p>
            <p className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              {value}
            </p>
            {hint ? (
              <p className="text-xs text-neutral-500">{hint}</p>
            ) : null}
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-neutral-50 text-neutral-700">
            <Icon className="h-4 w-4" aria-hidden />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

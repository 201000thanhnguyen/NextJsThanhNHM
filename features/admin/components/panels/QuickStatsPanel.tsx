"use client"

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { QuickStat } from "@/features/admin/types"
import { cn } from "@/lib/utils"

function TrendIcon({ trend }: { trend?: QuickStat["trend"] }) {
  if (trend === "up") {
    return <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
  }
  if (trend === "down") {
    return <ArrowDownRight className="h-3.5 w-3.5 text-amber-700" aria-hidden />
  }
  return <Minus className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
}

export function QuickStatsPanel({ items }: { items: QuickStat[] }) {
  return (
    <Card className="rounded-xl border-neutral-200/90 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-neutral-900">
          Quick statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.2 }}
            className="rounded-xl border border-neutral-100 bg-neutral-50/60 p-4 transition-colors hover:border-neutral-200 hover:bg-white"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-neutral-500">{item.label}</p>
              <TrendIcon trend={item.trend} />
            </div>
            <p className="mt-2 text-xl font-semibold tracking-tight text-neutral-900">
              {item.value}
            </p>
            <p className={cn("mt-1 text-xs text-neutral-500")}>{item.hint}</p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}

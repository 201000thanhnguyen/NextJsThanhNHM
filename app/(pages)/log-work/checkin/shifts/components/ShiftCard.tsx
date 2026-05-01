"use client"

import { motion } from "framer-motion"
import { Clock, Pencil, Trash2, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import type { Shift } from "../../types"

type ShiftCardProps = {
  shift: Shift
  onEdit: (shift: Shift) => void
  onDelete: (shift: Shift) => void
}

function formatVnd(amount: number) {
  try {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ"
  } catch {
    return `${amount}đ`
  }
}

export function ShiftCard({ shift, onEdit, onDelete }: ShiftCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18 }}
    >
      <Card
        className={cn(
          "group relative overflow-hidden border-neutral-200/80 bg-white",
          "shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        )}
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="truncate text-base font-semibold text-neutral-900">
                  {shift.name}
                </div>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-600">
                <div className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-neutral-400" />
                  <span className="font-medium text-neutral-700">
                    {shift.startTime} – {shift.endTime}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5">
                  <Wallet className="h-4 w-4 text-neutral-400" />
                  <span className="font-medium text-neutral-700">
                    {formatVnd(shift.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                onClick={() => onEdit(shift)}
                aria-label="Edit shift"
              >
                <Pencil />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-neutral-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                onClick={() => onDelete(shift)}
                aria-label="Delete shift"
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-neutral-200/70 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      </Card>
    </motion.div>
  )
}


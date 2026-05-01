import type { Attendance, Shift } from "./types"
import { AnimatePresence, motion } from "framer-motion"
import { CalendarDays, CheckCircle2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type AttendanceListProps = {
  loading?: boolean
  attendance: Attendance[]
  shifts: Shift[]
  onCheck: (date: string) => void
}

export function AttendanceList({
  loading = false,
  attendance,
  shifts,
  onCheck
}: AttendanceListProps) {
  const getShiftNames = (ids: string[]) =>
    ids
      .map(id => shifts.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join(", ")

  const getTotal = (ids: string[]) =>
    ids.reduce(
      (sum, id) =>
        sum + (shifts.find(s => s.id === id)?.salary || 0),
      0
    )

  const getStatus = (status: Attendance["status"]) => {
    if (status === "working") return { label: "working", variant: "success" as const }
    if (status === "not_checked") return { label: "not_checked", variant: "muted" as const }
    // keep existing logic intact; add nicer display for absent
    return { label: status, variant: "destructive" as const }
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-neutral-900">Danh sách ngày</div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, idx) => (
            <Card key={idx} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </Card>
          ))}
        </div>
      ) : attendance.length === 0 ? (
        <Card className="p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
            <CalendarDays className="h-6 w-6 text-neutral-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-neutral-900">
            No attendance data
          </h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-neutral-600">
            Try adjusting your date range or select a different month.
          </p>
        </Card>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
          transition={{ duration: 0.18 }}
        >
          <AnimatePresence>
            {[...attendance]
              .sort((a, b) => a.date.localeCompare(b.date))
              .map(a => {
                const status = getStatus(a.status)
                const shiftNames = getShiftNames(a.shiftIds)
                const total = a.shiftIds.length > 0 ? getTotal(a.shiftIds) : 0

                return (
                  <motion.div
                    key={a.date}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                  >
                    <Card className="group rounded-xl p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-base font-semibold text-neutral-900">
                            {a.date}
                          </div>
                          <div className="mt-1 text-sm text-neutral-600">
                            {shiftNames || "Chưa chọn ca"}
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <Badge variant={status.variant}>{status.label}</Badge>
                            {a.shiftIds.length > 0 ? (
                              <Badge variant="info">
                                {total.toLocaleString()}đ
                              </Badge>
                            ) : null}
                          </div>

                          {a.note ? (
                            <div className="mt-2 text-xs text-neutral-500">
                              {a.note}
                            </div>
                          ) : null}
                        </div>

                        <div className="shrink-0">
                          <Button
                            variant={a.shiftIds.length > 0 ? "outline" : "default"}
                            onClick={() => onCheck(a.date)}
                          >
                            <CheckCircle2 />
                            Chấm công
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

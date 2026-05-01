"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import type { Shift } from "./types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

type AttendanceModalProps = {
  shifts: Shift[]
  onClose: () => void
  onSave: (ids: string[], note: string) => void
  initialNote?: string
  initialSelectedIds?: string[]
  submitting?: boolean
}

export function AttendanceModal({
  shifts,
  onClose,
  onSave,
  initialNote = "",
  initialSelectedIds = [],
  submitting = false,
}: AttendanceModalProps) {
  const [selected, setSelected] = useState<string[]>(initialSelectedIds)
  const [note, setNote] = useState(initialNote)

  useEffect(() => {
    const valid = new Set(shifts.map(s => s.id))
    setSelected(prev => prev.filter(id => valid.has(id)))
  }, [shifts])

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  return (
    <Dialog open onOpenChange={open => (open ? null : onClose())}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Chấm công</DialogTitle>
          <DialogDescription>Chọn ca làm và ghi chú (nếu có).</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {shifts.length === 0 ? (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
              Chưa có ca nào. Hãy tạo ca trước ở mục Shifts.
            </div>
          ) : (
            <div className="grid gap-2">
              <div className="text-sm font-medium text-neutral-900">Ca làm</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {shifts.map(s => (
                  <label
                    key={s.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(s.id)}
                      onChange={() => toggle(s.id)}
                      className="h-4 w-4"
                    />
                    <span className="truncate">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="attendance-note">Ghi chú</Label>
            <textarea
              id="attendance-note"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ví dụ: nghỉ làm, đi muộn..."
              className="min-h-24 w-full resize-y rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-950 shadow-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 ring-offset-white"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button
            type="button"
            onClick={() => {
              try {
                onSave(selected, note.trim())
              } catch {
                toast.error("Không thể lưu chấm công")
              }
            }}
            disabled={submitting}
          >
            {submitting ? "Đang lưu..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

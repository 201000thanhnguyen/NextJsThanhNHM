"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { Shift, ShiftCreateInput } from "../../types"

type Mode = "create" | "edit"

type ShiftFormModalProps = {
  open: boolean
  mode: Mode
  initial?: Shift | null
  submitting?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: ShiftCreateInput) => void | Promise<void>
}

function formatSalaryInput(value: number) {
  if (!Number.isFinite(value)) return ""
  return String(value)
}

export function ShiftFormModal({
  open,
  mode,
  initial,
  submitting = false,
  onOpenChange,
  onSubmit,
}: ShiftFormModalProps) {
  const [name, setName] = React.useState("")
  const [startTime, setStartTime] = React.useState("")
  const [endTime, setEndTime] = React.useState("")
  const [salary, setSalary] = React.useState<number>(0)
  const [touched, setTouched] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    setName(initial?.name ?? "")
    setStartTime(initial?.startTime ?? "")
    setEndTime(initial?.endTime ?? "")
    setSalary(initial?.salary ?? 0)
    setTouched(false)
  }, [open, initial])

  const title = mode === "create" ? "Create shift" : "Edit shift"
  const description =
    mode === "create"
      ? "Add a new shift and start logging work in seconds."
      : "Update details for this shift. Changes apply immediately."

  const validation = (() => {
    if (!name.trim()) return "Shift name is required."
    if (!startTime) return "Start time is required."
    if (!endTime) return "End time is required."
    if (!Number.isFinite(salary) || salary < 0) return "Salary must be ≥ 0."
    return null
  })()

  async function handleSubmit() {
    setTouched(true)
    if (validation) return
    await onSubmit({
      name: name.trim(),
      startTime,
      endTime,
      salary,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={next => (submitting ? null : onOpenChange(next))}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="shift-name">Shift name</Label>
            <Input
              id="shift-name"
              placeholder="e.g. Morning shift"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={() => setTouched(true)}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="shift-start">Start time</Label>
              <Input
                id="shift-start"
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                onBlur={() => setTouched(true)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shift-end">End time</Label>
              <Input
                id="shift-end"
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                onBlur={() => setTouched(true)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="shift-salary">Salary (VND)</Label>
            <Input
              id="shift-salary"
              inputMode="numeric"
              type="number"
              min={0}
              placeholder="e.g. 200000"
              value={formatSalaryInput(salary)}
              onChange={e => setSalary(Number(e.target.value))}
              onBlur={() => setTouched(true)}
            />
          </div>

          {touched && validation ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {validation}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="button" onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? "Saving..." : mode === "create" ? "Create shift" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


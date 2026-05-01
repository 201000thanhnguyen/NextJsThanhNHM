"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { CalendarDays, Filter, RotateCcw } from "lucide-react"
import { toast } from "sonner"

import { AttendanceList } from "../AttendanceList"
import { AttendanceModal } from "../AttendanceModal"
import { buildMonthAttendance, getCurrentMonthValue } from "../date"
import type { Attendance, Shift } from "../types"
import { apiUrl } from "@/app/lib/api"
import { PageHeader } from "@/app/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

const SHIFTS_API = apiUrl(`/api/shifts`)
const ATTENDANCE_API = apiUrl(`/api/attendance`)

type ApiErrorBody =
  | {
      message?: string | string[]
      error?: string
      statusCode?: number
    }
  | unknown

async function readApiErrorMessage(res: Response): Promise<string> {
  const contentType = res.headers.get("content-type") ?? ""

  try {
    if (contentType.includes("application/json")) {
      const body = (await res.json()) as ApiErrorBody
      if (body && typeof body === "object") {
        const maybe = body as { message?: unknown; error?: unknown }
        if (Array.isArray(maybe.message)) return maybe.message.join(", ")
        if (typeof maybe.message === "string") return maybe.message
        if (typeof maybe.error === "string") return maybe.error
      }
      return JSON.stringify(body)
    }

    const text = await res.text()
    return text || `HTTP ${res.status}`
  } catch {
    return `HTTP ${res.status}`
  }
}

const getTodayDateValue = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

async function fetchShifts(): Promise<Shift[]> {
  const res = await fetch(SHIFTS_API, { method: "GET" })
  if (!res.ok) {
    throw new Error("Khong the tai danh sach ca")
  }

  const data = (await res.json()) as { data?: Shift[] }
  return data.data ?? []
}

async function fetchAttendance(): Promise<Attendance[]> {
  const res = await fetch(ATTENDANCE_API, { method: "GET" })
  if (!res.ok) {
    throw new Error("Khong the tai du lieu cham cong")
  }

  const data = (await res.json()) as { data?: Attendance[] }
  return data.data ?? []
}

async function updateAttendance(
  id: string,
  shiftIds: string[],
  note: string
): Promise<Attendance> {
  const normalizedNote = note.trim()
  if (normalizedNote.length > 255) {
    throw new Error("Ghi chú tối đa 255 ký tự")
  }

  const payload = {
    shiftIds,
    ...(normalizedNote ? { note: normalizedNote } : {})
  }

  console.log("[attendance] PUT payload", { id, ...payload })

  const res = await fetch(`${ATTENDANCE_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const msg = await readApiErrorMessage(res)
    console.error("[attendance] PUT failed", { status: res.status, message: msg })
    throw new Error(msg || "Khong the cap nhat cham cong")
  }

  const data = (await res.json()) as { data: Attendance }
  return data.data
}

async function createAttendance(
  date: string,
  shiftIds: string[],
  note: string
): Promise<Attendance> {
  const normalizedNote = note.trim()
  if (normalizedNote.length > 255) {
    throw new Error("Ghi chú tối đa 255 ký tự")
  }

  const payload = {
    date,
    shiftIds,
    ...(normalizedNote ? { note: normalizedNote } : {})
  }

  console.log("[attendance] POST payload", payload)

  const res = await fetch(ATTENDANCE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const msg = await readApiErrorMessage(res)
    console.error("[attendance] POST failed", { status: res.status, message: msg })
    throw new Error(msg || "Khong the tao cham cong")
  }

  const data = (await res.json()) as { data: Attendance }
  return data.data
}

export default function Page() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [openAttendanceModal, setOpenAttendanceModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [monthValue, setMonthValue] = useState(getCurrentMonthValue())
  const [fromDate, setFromDate] = useState(getTodayDateValue())
  const [toDate, setToDate] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setAttendance(buildMonthAttendance([], monthValue))

      try {
        const [shiftResult, attendanceResult] = await Promise.allSettled([
          fetchShifts(),
          fetchAttendance()
        ])

        if (shiftResult.status === "fulfilled") {
          setShifts(shiftResult.value)
        }

        if (attendanceResult.status === "fulfilled") {
          setAttendance(buildMonthAttendance(attendanceResult.value, monthValue))
        }

        if (shiftResult.status === "rejected" || attendanceResult.status === "rejected") {
          setError("Khong the tai day du du lieu, dang hien thi du lieu tam")
        }
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [monthValue])

  useEffect(() => {
    const refreshShifts = async () => {
      try {
        const latest = await fetchShifts()
        setShifts(latest)
      } catch (e) {
        console.error("[attendance] refetch shifts failed", e)
      }
    }

    const onFocus = () => void refreshShifts()
    const onVisibility = () => {
      if (document.visibilityState === "visible") void refreshShifts()
    }

    window.addEventListener("focus", onFocus)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.removeEventListener("focus", onFocus)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  const openCheck = (date: string) => {
    setSelectedDate(date)
    setOpenAttendanceModal(true)
  }

  const saveAttendance = async (ids: string[], note: string) => {
    if (!selectedDate) return

    console.log("[attendance] selectedShiftIds", ids)
    console.log("[attendance] currentShifts", shifts)

    const valid = new Set(shifts.map(s => s.id))
    const invalidIds = ids.filter(id => !valid.has(id))
    if (invalidIds.length > 0) {
      console.warn("[attendance] invalid shiftIds blocked", invalidIds)
      toast.error("Shift no longer exists, please reselect")
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      const current = attendance.find(a => a.date === selectedDate)

      let updated: Attendance
      if (current?.id) {
        updated = await updateAttendance(current.id, ids, note)
      } else {
        updated = await createAttendance(selectedDate, ids, note)
      }

      setAttendance(prev => prev.map(a => (a.date === selectedDate ? updated : a)))
      setOpenAttendanceModal(false)
      toast.success("Lưu chấm công thành công")
    } catch (e) {
      const message = e instanceof Error ? e.message : "Loi khong xac dinh"
      setError(message)
      toast.error("Không thể lưu chấm công")
    } finally {
      setSubmitting(false)
    }
  }

  const filteredAttendance = attendance.filter(a => {
    if (fromDate && a.date < fromDate) return false
    if (toDate && a.date > toDate) return false
    return true
  })

  const resetRange = () => {
    setFromDate("")
    setToDate("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <PageHeader
            title="Attendance"
            description="Track and manage your daily check-ins"
            icon={<CalendarDays className="h-5 w-5 text-neutral-700" />}
            breadcrumb={
              <>
                <Link href="/log-work/checkin" className="hover:text-neutral-700">
                  Log work
                </Link>{" "}
                <span className="text-neutral-400">/</span>{" "}
                <span className="text-neutral-700">Attendance</span>
              </>
            }
          />

          {/* Filters */}
          {loading ? (
            <Card className="p-5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-28" />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </Card>
          ) : (
            <Card className="p-5 shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                  <Filter className="h-4 w-4 text-neutral-600" />
                  Filters
                </div>

                <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end">
                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3 md:max-w-3xl">
                    <Input
                      type="month"
                      value={monthValue}
                      onChange={e => setMonthValue(e.target.value)}
                      aria-label="Month"
                    />
                    <Input
                      type="date"
                      value={fromDate}
                      onChange={e => setFromDate(e.target.value)}
                      aria-label="From date"
                    />
                    <Input
                      type="date"
                      value={toDate}
                      onChange={e => setToDate(e.target.value)}
                      aria-label="To date"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    className="justify-start md:justify-center"
                    onClick={resetRange}
                  >
                    <RotateCcw />
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <AttendanceList
            loading={loading}
            attendance={filteredAttendance}
            shifts={shifts}
            onCheck={openCheck}
          />

          {openAttendanceModal && selectedDate && (
            <AttendanceModal
              key={selectedDate}
              shifts={shifts}
              onClose={() => setOpenAttendanceModal(false)}
              onSave={saveAttendance}
              initialNote={attendance.find(a => a.date === selectedDate)?.note ?? ""}
              initialSelectedIds={
                attendance.find(a => a.date === selectedDate)?.shiftIds ?? []
              }
              submitting={submitting}
            />
          )}
        </div>
      </div>
    </div>
  )
}

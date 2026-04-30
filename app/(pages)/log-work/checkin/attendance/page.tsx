"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { AttendanceList } from "../AttendanceList"
import { AttendanceModal } from "../AttendanceModal"
import { buildMonthAttendance, getCurrentMonthValue } from "../date"
import type { Attendance, Shift } from "../types"

const API_BASE_URL = "http://localhost:3001"
const SHIFTS_API = `/api/shifts`
const ATTENDANCE_API = `/api/attendance`

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
  const res = await fetch(`${ATTENDANCE_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ shiftIds, note })
  })

  if (!res.ok) {
    throw new Error("Khong the cap nhat cham cong")
  }

  const data = (await res.json()) as { data: Attendance }
  return data.data
}

async function createAttendance(
  date: string,
  shiftIds: string[],
  note: string
): Promise<Attendance> {
  const res = await fetch(ATTENDANCE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, shiftIds, note })
  })

  if (!res.ok) {
    throw new Error("Khong the tao cham cong")
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

  const openCheck = (date: string) => {
    setSelectedDate(date)
    setOpenAttendanceModal(true)
  }

  const saveAttendance = async (ids: string[], note: string) => {
    if (!selectedDate) return

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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Loi khong xac dinh")
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
    <div className="min-h-screen bg-gray-100 p-4 max-w-xl mx-auto space-y-6">
      <Link href="/log-work/checkin" className="text-sm text-blue-500">
        Quay lai
      </Link>

      {loading && <div className="text-sm text-gray-500">Dang tai...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      <div className="bg-white p-3 rounded-xl shadow space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="month"
            value={monthValue}
            onChange={e => setMonthValue(e.target.value)}
            className="border rounded p-2 text-sm text-gray-700"
          />
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="border rounded p-2 text-sm text-gray-700"
          />
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="border rounded p-2 text-sm text-gray-700"
          />
        </div>
        <button
          onClick={resetRange}
          className="text-sm text-blue-600"
        >
          Reset from-to
        </button>
      </div>

      <AttendanceList
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
          initialSelectedIds={attendance.find(a => a.date === selectedDate)?.shiftIds ?? []}
        />
      )}

      {submitting && (
        <div className="text-sm text-gray-500">Dang luu cham cong...</div>
      )}
    </div>
  )
}

"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import { ShiftModal } from "../ShiftModal"
import { ShiftSection } from "../ShiftSection"
import type { Shift, ShiftCreateInput } from "../types"

const API_BASE_URL = "http://localhost:3001"
const SHIFTS_API = `/api/shifts`

async function fetchShifts(): Promise<Shift[]> {
  const res = await fetch(SHIFTS_API, { method: "GET" })
  if (!res.ok) {
    throw new Error("Khong the tai danh sach ca")
  }

  const data = (await res.json()) as { data?: Shift[] }
  return data.data ?? []
}

async function createShift(payload: ShiftCreateInput): Promise<Shift> {
  const res = await fetch(SHIFTS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    throw new Error("Khong the tao ca")
  }

  const data = (await res.json()) as { data: Shift }
  return data.data
}

async function removeShift(id: string): Promise<void> {
  const res = await fetch(`${SHIFTS_API}/${id}`, { method: "DELETE" })
  if (!res.ok) {
    throw new Error("Khong the xoa ca")
  }
}

export default function Page() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [openShiftModal, setOpenShiftModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchShifts()
        setShifts(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Loi khong xac dinh")
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const addShift = async (payload: ShiftCreateInput) => {
    try {
      setSubmitting(true)
      setError(null)
      const created = await createShift(payload)
      setShifts(prev => [...prev, created])
    } catch (e) {
      setError(e instanceof Error ? e.message : "Loi khong xac dinh")
      throw e
    } finally {
      setSubmitting(false)
    }
  }

  const deleteShift = async (id: string) => {
    try {
      setError(null)
      await removeShift(id)
      setShifts(prev => prev.filter(s => s.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Loi khong xac dinh")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 max-w-xl mx-auto space-y-6">
      <Link href="/log-work/checkin" className="text-sm text-blue-500">
        Quay lai
      </Link>

      {loading && <div className="text-sm text-gray-500">Dang tai...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}

      <ShiftSection
        shifts={shifts}
        onCreate={() => setOpenShiftModal(true)}
        onDelete={id => {
          void deleteShift(id)
        }}
      />

      {openShiftModal && (
        <ShiftModal
          onClose={() => setOpenShiftModal(false)}
          onSave={addShift}
          submitting={submitting}
        />
      )}
    </div>
  )
}

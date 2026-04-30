"use client"

import { useState } from "react"

import type { ShiftCreateInput } from "./types"

type ShiftModalProps = {
  onClose: () => void
  onSave: (shift: ShiftCreateInput) => Promise<void> | void
  submitting?: boolean
}

export function ShiftModal({
  onClose,
  onSave,
  submitting = false
}: ShiftModalProps) {
  const [name, setName] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [salary, setSalary] = useState(0)

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 rounded-xl w-80 space-y-3 shadow-lg">
        <h3 className="font-semibold text-lg text-gray-700">Tao ca</h3>

        <input
          placeholder="Ten ca"
          className="w-full border p-2 rounded bg-white text-black"
          onChange={e => setName(e.target.value)}
        />

        <input
          type="time"
          className="w-full border p-2 rounded bg-white text-black"
          onChange={e => setStart(e.target.value)}
        />

        <input
          type="time"
          className="w-full border p-2 rounded bg-white text-black"
          onChange={e => setEnd(e.target.value)}
        />

        <input
          type="number"
          placeholder="Luong"
          className="w-full border p-2 rounded bg-white text-black"
          onChange={e => setSalary(Number(e.target.value))}
        />

        <button
          disabled={submitting}
          onClick={async () => {
            await onSave({
              name,
              startTime: start,
              endTime: end,
              salary
            })
            onClose()
          }}
          className="bg-blue-500 text-white w-full py-2 rounded-lg disabled:opacity-60"
        >
          Luu
        </button>

        <button
          onClick={onClose}
          className="text-gray-500 w-full"
        >
          Huy
        </button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"

import type { Shift } from "./types"

type AttendanceModalProps = {
  shifts: Shift[]
  onClose: () => void
  onSave: (ids: string[], note: string) => void
  initialNote?: string
  initialSelectedIds?: string[]
}

export function AttendanceModal({
  shifts,
  onClose,
  onSave,
  initialNote = "",
  initialSelectedIds = []
}: AttendanceModalProps) {
  const [selected, setSelected] = useState<string[]>(initialSelectedIds)
  const [note, setNote] = useState(initialNote)

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 rounded-xl w-80 space-y-3 shadow-lg">
        <h3 className="font-semibold text-lg text-gray-700">Chon ca</h3>

        {shifts.length === 0 && (
          <div className="text-gray-500 text-sm">Chua co ca nao</div>
        )}

        {shifts.map(s => (
          <label key={s.id} className="flex items-center gap-2 text-gray-500">
            <input
              type="checkbox"
              checked={selected.includes(s.id)}
              onChange={() => toggle(s.id)}
            />
            {s.name}
          </label>
        ))}

        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Ghi chu (vi du: nghi lam, di muon...)"
          className="w-full border rounded p-2 text-sm text-gray-700 min-h-20"
        />

        <button
          onClick={() => onSave(selected, note.trim())}
          className="bg-blue-500 text-white w-full py-2 rounded-lg"
        >
          Xac nhan
        </button>

        <button onClick={onClose} className="text-gray-500 w-full">
          Huy
        </button>
      </div>
    </div>
  )
}

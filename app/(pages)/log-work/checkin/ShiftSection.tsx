import type { Shift } from "./types"

type ShiftSectionProps = {
  shifts: Shift[]
  onCreate: () => void
  onDelete: (id: string) => void
}

export function ShiftSection({
  shifts,
  onCreate,
  onDelete
}: ShiftSectionProps) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <h2 className="font-semibold text-gray-500">Ca làm</h2>
        <button
          onClick={onCreate}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg"
        >
          + Tạo ca
        </button>
      </div>

      <div className="space-y-2">
        {shifts.map(s => (
          <div
            key={s.id}
            className="bg-white p-3 rounded-xl shadow flex justify-between"
          >
            <div>
              <div className="font-medium text-gray-500">{s.name}</div>
              <div className="text-sm text-gray-500">
                {s.startTime} - {s.endTime}
              </div>
              <div className="text-blue-500 text-sm">
                {s.salary.toLocaleString()}đ
              </div>
            </div>

            <button
              onClick={() => onDelete(s.id)}
              className="text-red-500"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

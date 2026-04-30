import type { Attendance, Shift } from "./types"

type AttendanceListProps = {
  attendance: Attendance[]
  shifts: Shift[]
  onCheck: (date: string) => void
}

export function AttendanceList({
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

  return (
    <div>
      <h2 className="font-semibold mb-2 text-gray-500">Danh sách ngày</h2>

      <div className="space-y-2">
        {[...attendance]
          .sort((a, b) => a.date.localeCompare(b.date))
          .map(a => (
            <div
              key={a.date}
              className="bg-white p-3 rounded-xl shadow flex justify-between"
            >
              <div>
                <div className="font-medium text-gray-500">{a.date}</div>

                <div className="text-sm text-gray-500">
                  {getShiftNames(a.shiftIds) || "Chưa chọn ca"}
                </div>

                {a.shiftIds.length > 0 && (
                  <div className="text-sm text-blue-500">
                    {getTotal(a.shiftIds).toLocaleString()}đ
                  </div>
                )}

                <div
                  className={`text-xs mt-1 ${a.status === "working"
                    ? "text-green-500"
                    : a.status === "absent"
                      ? "text-red-500"
                      : "text-gray-400"
                    }`}
                >
                  {a.status}
                </div>

                {a.note && (
                  <div className="text-xs mt-1 text-gray-500">{a.note}</div>
                )}
              </div>

              <button
                onClick={() => onCheck(a.date)}
                className="text-blue-500"
              >
                Chấm
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}

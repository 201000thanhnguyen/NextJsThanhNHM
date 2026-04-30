import type { Attendance } from "./types"

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export const getCurrentMonthValue = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

const parseMonthValue = (monthValue?: string) => {
  const now = new Date()
  if (!monthValue) {
    return { year: now.getFullYear(), monthIndex: now.getMonth() }
  }

  const [yearText, monthText] = monthValue.split("-")
  const year = Number(yearText)
  const monthIndex = Number(monthText) - 1
  if (!Number.isFinite(year) || !Number.isFinite(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return { year: now.getFullYear(), monthIndex: now.getMonth() }
  }

  return { year, monthIndex }
}

export const generateMonthDays = (monthValue?: string) => {
  const { year, monthIndex } = parseMonthValue(monthValue)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

  return Array.from({ length: daysInMonth }).map((_, i) => {
    const d = new Date(year, monthIndex, i + 1)
    return formatDate(d)
  })
}

export const buildMonthAttendance = (
  savedAttendance: Attendance[],
  monthValue?: string
): Attendance[] =>
  generateMonthDays(monthValue).map(date => {
    const saved = savedAttendance.find(item => item.date === date)

    return saved ?? {
      date,
      shiftIds: [],
      status: "not_checked"
    }
  })

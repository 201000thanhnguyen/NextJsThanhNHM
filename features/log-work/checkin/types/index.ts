export type Shift = {
  id: string
  name: string
  startTime: string
  endTime: string
  salary: number
}

export type ShiftCreateInput = {
  name: string
  startTime: string
  endTime: string
  salary: number
}

export type ShiftUpdateInput = Partial<ShiftCreateInput>

export type Attendance = {
  id?: string
  date: string
  shiftIds: string[]
  note?: string
  status: "working" | "absent" | "not_checked"
}

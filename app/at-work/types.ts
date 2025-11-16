const d = new Date();

const yyyy = d.getFullYear();
const MM = String(d.getMonth() + 1).padStart(2, '0');
const dd = String(d.getDate()).padStart(2, '0');

// e.g., "2024-06-15"
export const TODAY = `${yyyy}-${MM}-${dd}`;

export type WorkStatus = "Working" | "Off";
export type WorkShift = "6h30" | "15h30" | "17h30";

export interface WorkFormState {
  workingDays: string;
  workStatus: WorkStatus;
  workShift: WorkShift[];
  note: string;
}

export interface WorkPay {
  payDate: string;
  amount: number | string;
}

export const WORK_SHIFTS: WorkShift[] = ["6h30", "15h30", "17h30"];

export interface WorkFormErrors {
  workingDays?: string;
  workShift?: string;
  note?: string;
}

export interface WorkPayErrors {
  payDate?: string;
  amount?: string;
}

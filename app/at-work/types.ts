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

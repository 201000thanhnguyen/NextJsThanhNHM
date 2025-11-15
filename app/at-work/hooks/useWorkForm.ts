"use client";

import { useState } from "react";
import type { WorkFormState, WorkPay, WorkShift, WorkFormErrors, WorkPayErrors } from "../types";
import { WORK_SHIFTS } from "../types";

export default function useWorkForm() {
  const [formWorkForm, setFormWorkForm] = useState<WorkFormState>({
    workingDays: "",
    workStatus: "Working",
    workShift: [],
    note: "",
  });

  const [formWorkPay, setFormWorkPay] = useState<WorkPay>({
  payDate: "",
  // keep amount empty by default so the field is required
  amount: "",
  });

  const [formErrors, setFormErrors] = useState<WorkFormErrors>({});
  const [payErrors, setPayErrors] = useState<WorkPayErrors>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (name === "workShift") {
      const checked = (e.target as HTMLInputElement).checked;
      let newShifts = [...formWorkForm.workShift];
      if (checked) {
        newShifts.push(value as WorkShift);
      } else {
        newShifts = newShifts.filter((s) => s !== value);
      }
      setFormWorkForm({ ...formWorkForm, workShift: newShifts });
    } else if (type === "radio") {
      setFormWorkForm({ ...formWorkForm, [name]: value as WorkFormState["workStatus"] });
    } else {
      setFormWorkForm({ ...formWorkForm, [name]: value } as any);
    }
  };

  const handleChangeWorkPay = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "number") {
      const parsed = parseInt(value);
      setFormWorkPay({ ...formWorkPay, [name]: Number.isNaN(parsed) ? "" : parsed } as any);
    } else {
      setFormWorkPay({ ...formWorkPay, [name]: value } as any);
    }
  };

  const handleSubmitWorkForm = (e: React.FormEvent) => {
    e.preventDefault();
  const errs: WorkFormErrors = {};
  if (!formWorkForm.workingDays) errs.workingDays = "Please select working day(s).";
  if (formWorkForm.workShift.length === 0) errs.workShift = "Select at least one shift.";

  setFormErrors(errs);
  if (Object.keys(errs).length > 0) return;

  // eslint-disable-next-line no-alert
  alert(JSON.stringify(formWorkForm, null, 2));
  };

  const handleSubmitWorkPay = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: WorkPayErrors = {};
    if (!formWorkPay.payDate) errs.payDate = "Please select a pay date.";

    // Enforce required (no empty) and non-negative numeric amount
    if (formWorkPay.amount === "" || formWorkPay.amount === null || formWorkPay.amount === undefined) {
      errs.amount = "Amount is required.";
    } else {
      const amountNum = typeof formWorkPay.amount === "string" ? parseInt(formWorkPay.amount) : formWorkPay.amount;
      if (Number.isNaN(amountNum) || Number(amountNum) < 0) {
        errs.amount = "Amount must be a non-negative number.";
      }
    }

    setPayErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // eslint-disable-next-line no-alert
    alert(JSON.stringify(formWorkPay, null, 2));
  };

  return {
    formWorkForm,
    setFormWorkForm,
    formWorkPay,
    setFormWorkPay,
    handleChange,
    handleChangeWorkPay,
    handleSubmitWorkForm,
    handleSubmitWorkPay,
  formErrors,
  payErrors,
    WORK_SHIFTS,
  };
}

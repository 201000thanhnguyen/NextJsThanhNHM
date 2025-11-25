"use client";

import { useState } from "react";
import type { WorkFormState, WorkPay, WorkShift, WorkFormErrors, WorkPayErrors } from "../types";
import { TODAY, WORK_SHIFTS } from "../types";

export default function useWorkForm() {

  const [formWorkForm, setFormWorkForm] = useState<WorkFormState>({
    workingDays: `${TODAY}`,
    workStatus: "Working",
    workShift: [],
    note: "",
  });

  const [formWorkPay, setFormWorkPay] = useState<WorkPay>({
    payDate: `${TODAY}`,
    // keep amount empty by default so the field is required
    amount: "",
  });

  const [formErrors, setFormErrors] = useState<WorkFormErrors>({});
  const [payErrors, setPayErrors] = useState<WorkPayErrors>({});
  const [payLoading, setPayLoading] = useState(false);

  const handleChangeWorkForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    // Validate
    const errs: WorkFormErrors = {};
    if (name === "workStatus") {
      const newStatus = value as WorkFormState["workStatus"];

      // Nếu chuyển status => reset shift
      setFormWorkForm({
        ...formWorkForm,
        workStatus: newStatus,
        workShift: [],
      });

      if (newStatus === "Working" && formWorkForm.workShift.length === 0) {
        errs.workShift = "Select at least one shift.";
      }

    }

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

    setFormErrors(errs);
    return;

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

    if (formWorkForm.workStatus === "Working" && formWorkForm.workShift.length === 0) {
      errs.workShift = "Select at least one shift.";
    } else {
      delete errs.workShift;
    }

    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // eslint-disable-next-line no-alert
    alert(JSON.stringify(formWorkForm, null, 2));
  };

  const handleSubmitWorkPay = async (e: React.FormEvent) => {
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

    // send to NestJS API
    setPayLoading(true);
    try {
      const resp = await fetch("http://localhost:3001/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formWorkPay),
      });

      if (!resp.ok) {
        // try to parse error body
        let errText = `Request failed with status ${resp.status}`;
        try {
          const json = await resp.json();
          if (json && json.message) errText = json.message;
        } catch (_) {
          // ignore json parse
        }
        // set a generic error on amount to surface to user (could be improved)
        setPayErrors({ amount: errText });
        return;
      }

      const data = await resp.json();
      // on success: reset pay form and errors
      setFormWorkPay({ payDate: `${TODAY}`, amount: "" });
      setPayErrors({});
      // eslint-disable-next-line no-alert
      alert(`Payment saved: ${JSON.stringify(data)}`);
    } catch (err: any) {
      setPayErrors({ amount: err?.message || String(err) });
    } finally {
      setPayLoading(false);
    }
  };

  return {
    formWorkForm,
    setFormWorkForm,
    formWorkPay,
    setFormWorkPay,
    handleChangeWorkForm,
    handleChangeWorkPay,
    handleSubmitWorkForm,
    handleSubmitWorkPay,
    formErrors,
    payErrors,
    payLoading,
    WORK_SHIFTS,
  };
}

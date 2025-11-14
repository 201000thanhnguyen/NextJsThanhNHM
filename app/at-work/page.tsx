"use client";

import React, { useState } from "react";

type WorkStatus = "Working" | "Off";
type WorkShift = "6h30" | "15h30" | "17h30";

interface WorkFormState {
  workingDays: string;
  workStatus: WorkStatus;
  workShift: WorkShift[];
  note: string;
}

const WORK_SHIFTS: WorkShift[] = ["6h30", "15h30", "17h30"];

export default function WorkForm() {
  const [form, setForm] = useState<WorkFormState>({
    workingDays: "",
    workStatus: "Working",
    workShift: [],
    note: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === "workShift") {
      const checked = (e.target as HTMLInputElement).checked;
      let newShifts = [...form.workShift];
      if (checked) {
        newShifts.push(value as WorkShift);
      } else {
        newShifts = newShifts.filter((s) => s !== value);
      }
      setForm({ ...form, workShift: newShifts });
    } else if (type === "radio") {
      setForm({ ...form, [name]: value as WorkStatus });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(JSON.stringify(form, null, 2));
  };

  return (
    <form
      className="max-w-4xl mx-auto p-6 shadow-lg bg-white rounded space-y-4 mt-6 lg:mt-8"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col mb-2">
          <label className="text-gray-700 font-medium mb-1 underline">
            Working days
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="date"
            name="workingDays"
            value={form.workingDays}
            onChange={handleChange}
            className="mt-1 block w-full border-1 border-gray-500 rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex flex-col mb-2">
          <label className="text-gray-700 font-medium mb-1 underline">Work status</label>
          <div className="flex justify-evenly items-center space-x-8 mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="workStatus"
                value="Working"
                checked={form.workStatus === "Working"}
                onChange={handleChange}
                className="accent-blue-500"
              />
              <span>Working</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="workStatus"
                value="Off"
                checked={form.workStatus === "Off"}
                onChange={handleChange}
                className="accent-blue-500"
              />
              <span>Off</span>
            </label>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <label className="text-gray-700 font-medium mb-1 underline">Note</label>
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={handleChange}
            className="mt-1 block w-full border-1 border-gray-500 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="text-gray-700 font-medium mb-1 underline">Work shift</label>
          <div className="flex flex-row justify-evenly gap-x-6 mt-2">
            {WORK_SHIFTS.map((shift) => (
              <label key={shift} className="flex items-center gap-x-1">
                <input
                  type="checkbox"
                  name="workShift"
                  value={shift}
                  checked={form.workShift.includes(shift)}
                  onChange={handleChange}
                />
                <span>{shift}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <hr className="border-gray-500 mt-5"/>
      <div className="flex justify-center mt-2">
        <button
          type="submit"
          className="bg-indigo-500 shadow-md shadow-indigo-400 text-white px-8 py-2 rounded font-medium transition hover:bg-pink-400 hover:shadow-lg hover:shadow-pink-400"
        >
          Save
        </button>
      </div>
    </form>
  );
}

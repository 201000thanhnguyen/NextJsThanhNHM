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

interface WorkPay {
  payDate: string;
  amount: number | any;
}

const WORK_SHIFTS: WorkShift[] = ["6h30", "15h30", "17h30"];

export default function WorkForm() {
  const [formWorkForm, setFormWorkForm] = useState<WorkFormState>({
    workingDays: "",
    workStatus: "Working",
    workShift: [],
    note: "",
  });

  const [formWorkPay, setFormWorkPay] = useState<WorkPay>({
    payDate: "",
    amount: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

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
      setFormWorkForm({ ...formWorkForm, [name]: value as WorkStatus });
    } else {
      setFormWorkForm({ ...formWorkForm, [name]: value });
    }
  };

  const handleChangeWorkPay = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormWorkPay({ ...formWorkPay, [name]: Number(parseInt(value)) ? parseInt(value) : '' });
    } else {
      setFormWorkPay({ ...formWorkPay, [name]: value });
    }
  };

  const handleSubmitWorkForm = (e: React.FormEvent) => {
    e.preventDefault();
    alert(JSON.stringify(formWorkForm, null, 2));
  };
  
  const handleSubmitWorkPay = (e: React.FormEvent) => {
    e.preventDefault();
    alert(JSON.stringify(formWorkPay, null, 2));
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 md:gap-6">
      
      <div className="md:col-span-1 grid grid-cols-1 md:grid-cols-1 gap-6 p-6 shadow-lg bg-white rounded space-y-4 mt-6 lg:mt-8">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4">
          <div className="flex flex-col mb-2">
            <label className="text-gray-700 font-medium mb-1 underline">
              Summary Salary
            </label>
            <table className="table-fixed w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td>Total Shifts</td>
                  <td className="text-right">1.000.000 vnd</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td>Total Pay</td>
                  <td className="text-right">0 vnd</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td>Total Received</td>
                  <td className="text-right">0 vnd</td>
                </tr>
                <tr className="border-b border-gray-300">
                  <td>Total Unpaid</td>
                  <td className="text-right">0 vnd</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <form className="md:col-span-2 p-6 shadow-lg bg-white rounded space-y-4 mt-6 lg:mt-8"
        onSubmit={handleSubmitWorkForm}
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
              value={formWorkForm.workingDays}
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
                  checked={formWorkForm.workStatus === "Working"}
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
                  checked={formWorkForm.workStatus === "Off"}
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
              value={formWorkForm.note}
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
                    checked={formWorkForm.workShift.includes(shift)}
                    onChange={handleChange}
                  />
                  <span>{shift}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <hr className="border-gray-500 mt-5" />
        <div className="flex justify-center mt-2">
          <button
            type="submit"
            className="bg-indigo-500 shadow-md shadow-indigo-400 text-white px-8 py-2 rounded font-medium transition hover:bg-pink-400 hover:shadow-lg hover:shadow-pink-400"
          >
            Save
          </button>
        </div>
      </form>

      <div className="md:col-span-1 grid grid-cols-1 md:grid-cols-1 gap-6 p-6 shadow-lg bg-white rounded space-y-4 mt-6 lg:mt-8">
        <form
          className="bg-white rounded space-y-4"
          onSubmit={handleSubmitWorkPay}
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-4">
            <div className="flex flex-col mb-2">
              <label className="text-gray-700 font-medium mb-1 underline">
                Pay Date
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="date"
                name="payDate"
                value={formWorkPay.payDate}
                onChange={handleChangeWorkPay}
                className="mt-1 block w-full border-1 border-gray-500 rounded px-3 py-2"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-4">
            <div>
              <label className="text-gray-700 font-medium mb-1 underline">
                Amount
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="number"
                name="amount"
                min={0}
                value={formWorkPay.amount}
                onChange={handleChangeWorkPay}
                className="mt-1 block w-full border-1 border-gray-500 rounded px-3 py-2"
              />
            </div>
          </div>
          <hr className="border-gray-500 mt-5" />
          <div className="flex justify-center mt-2">
            <button
              type="submit"
              className="bg-indigo-500 shadow-md shadow-indigo-400 text-white px-8 py-2 rounded font-medium transition hover:bg-pink-400 hover:shadow-lg hover:shadow-pink-400"
            >
              Save
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

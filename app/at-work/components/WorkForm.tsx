"use client";

import React from "react";
import type { WorkFormState, WorkFormErrors } from "../types";
import { WORK_SHIFTS } from "../types";

interface WorkFormProps {
  value: WorkFormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
  errors?: WorkFormErrors;
}

export default function WorkForm({ value, onChange, onSubmit, errors, disabled }: WorkFormProps) {
  return (
    <form className="md:col-span-2 p-6 shadow-lg bg-white rounded space-y-4 mt-6 lg:mt-8" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
        <div className="flex flex-col mb-2">
          <label className="text-gray-700 font-medium mb-1 underline">
            Working days
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="date"
            name="workingDays"
            value={value.workingDays}
            onChange={onChange}
            className="mt-1 block w-full border-1 border-gray-500 rounded px-3 py-2"
            required
          />
          {errors?.workingDays && <p className="text-sm text-red-500 mt-1">{errors.workingDays}</p>}
        </div>
        <div className="flex flex-col mb-2">
          <label className="text-gray-700 font-medium mb-1 underline">Work status</label>
          <div className="flex justify-evenly items-center space-x-8 mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="workStatus"
                value="Working"
                checked={value.workStatus === "Working"}
                onChange={onChange}
                className="accent-blue-500"
              />
              <span>Working</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="workStatus"
                value="Off"
                checked={value.workStatus === "Off"}
                onChange={onChange}
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
            value={value.note}
            onChange={onChange}
            className="mt-1 block w-full border-1 border-gray-500 rounded px-3 py-2"
          />
          {errors?.note && <p className="text-sm text-red-500 mt-1">{errors.note}</p>}
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
                  checked={value.workShift.includes(shift)}
                  disabled={disabled}
                  onChange={onChange}
                />
                <span>{shift}</span>
              </label>
            ))}
          </div>
          {errors?.workShift && <p className="text-sm text-red-500 mt-1">{errors.workShift}</p>}
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
  );
}

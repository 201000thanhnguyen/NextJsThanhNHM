"use client";

import React from "react";
import type { WorkPay, WorkPayErrors } from "../types";

interface PayFormProps {
  value: WorkPay;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors?: WorkPayErrors;
}

export default function PayForm({ value, onChange, onSubmit, errors }: PayFormProps) {
  return (
    <div className="md:col-span-1 grid grid-cols-1 md:grid-cols-1 gap-6 p-6 shadow-lg bg-white rounded space-y-4 mt-6 lg:mt-8">
      <form className="bg-white rounded space-y-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-4">
          <div className="flex flex-col mb-2">
            <label className="text-gray-700 font-medium mb-1 underline">
              Pay Date
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="date"
              name="payDate"
              value={value.payDate}
              onChange={onChange}
              className="mt-1 block w-full border-1 border-gray-500 rounded px-3 py-2"
              required
            />
            {errors?.payDate && <p className="text-sm text-red-500 mt-1">{errors.payDate}</p>}
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
              value={value.amount as any}
              onChange={onChange}
              className="mt-1 block w-full border-1 border-gray-500 rounded px-3 py-2"
            />
            {errors?.amount && <p className="text-sm text-red-500 mt-1">{errors.amount}</p>}
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
  );
}

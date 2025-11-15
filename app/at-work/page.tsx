"use client";

import React from "react";
import useWorkForm from "./hooks/useWorkForm";
import SummaryCard from "./components/SummaryCard";
import WorkForm from "./components/WorkForm";
import PayForm from "./components/PayForm";

export default function WorkFormPage() {
  const {
    formWorkForm,
    formWorkPay,
    handleChange,
    handleChangeWorkPay,
    handleSubmitWorkForm,
    handleSubmitWorkPay,
  formErrors,
  payErrors,
  } = useWorkForm();

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 md:gap-6">
      <SummaryCard>
        <div className="flex flex-col mb-2">
          <label className="text-gray-700 font-medium mb-1 underline">Summary Salary</label>
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
      </SummaryCard>

  <WorkForm value={formWorkForm} onChange={handleChange} onSubmit={handleSubmitWorkForm} errors={formErrors} />

  <PayForm value={formWorkPay} onChange={handleChangeWorkPay} onSubmit={handleSubmitWorkPay} errors={payErrors} />
    </div>
  );
}

"use client";

import React from "react";

interface SummaryCardProps {
  children?: React.ReactNode;
}

export default function SummaryCard({ children }: SummaryCardProps) {
  return (
    <div className="md:col-span-1 grid grid-cols-1 md:grid-cols-1 gap-6 p-6 shadow-lg bg-white rounded space-y-4 mt-2 lg:mt-8">
      <div className="grid grid-cols-1 gap-x-8 gap-y-4">
        {children}
      </div>
    </div>
  );
}

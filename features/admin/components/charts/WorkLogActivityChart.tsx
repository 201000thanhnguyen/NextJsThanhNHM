"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { WorkLogActivityPoint } from "@/features/admin/types"

export function WorkLogActivityChart({
  data,
  empty,
}: {
  data: WorkLogActivityPoint[]
  empty?: boolean
}) {
  const chartData = empty ? [] : data

  if (chartData.length === 0) {
    return (
      <div className="flex h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 text-center">
        <p className="text-sm font-medium text-neutral-700">No activity yet</p>
        <p className="mt-1 max-w-xs text-xs text-neutral-500">
          Work logs for this range will appear here once your team starts logging
          time.
        </p>
      </div>
    )
  }

  return (
    <div className="h-[280px] w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#737373", fontSize: 12 }}
            dy={8}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#737373", fontSize: 12 }}
            width={36}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e5e5e5",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
            labelStyle={{ color: "#404040", fontWeight: 600, fontSize: 12 }}
            itemStyle={{ color: "#525252", fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="logs"
            name="Work logs"
            stroke="#171717"
            strokeWidth={2}
            dot={{ r: 3, fill: "#171717", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

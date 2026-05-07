"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import type { ProjectSlice } from "@/features/admin/types"

export function ProjectDistributionChart({
  data,
  empty,
}: {
  data: ProjectSlice[]
  empty?: boolean
}) {
  const chartData = empty ? [] : data

  if (chartData.length === 0) {
    return (
      <div className="flex h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/50 text-center">
        <p className="text-sm font-medium text-neutral-700">No projects</p>
        <p className="mt-1 max-w-xs text-xs text-neutral-500">
          Connect projects to see how work is distributed across your portfolio.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-[280px] flex-col gap-4 sm:flex-row sm:items-center">
      <div className="h-[200px] min-h-[200px] w-full min-w-0 sm:h-[240px] sm:flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={2}
              stroke="#fafafa"
              strokeWidth={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [
                `${value ?? 0}%`,
                "Share",
              ]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e5e5e5",
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex shrink-0 flex-col gap-2 text-xs text-neutral-600 sm:w-40">
        {chartData.map((row) => (
          <li key={row.name} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full ring-1 ring-neutral-200"
              style={{ backgroundColor: row.color }}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate">{row.name}</span>
            <span className="tabular-nums text-neutral-900">{row.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

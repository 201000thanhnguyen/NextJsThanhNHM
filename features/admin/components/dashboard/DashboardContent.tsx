"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  CalendarCheck2,
  CheckSquare,
  ClipboardList,
  Users,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { StatCard } from "@/features/admin/components/cards/StatCard"
import { WorkLogActivityChart } from "@/features/admin/components/charts/WorkLogActivityChart"
import { ProjectDistributionChart } from "@/features/admin/components/charts/ProjectDistributionChart"
import { RecentUsersTable } from "@/features/admin/components/tables/RecentUsersTable"
import { QuickStatsPanel } from "@/features/admin/components/panels/QuickStatsPanel"
import { DateRangePicker } from "@/components/admin/header/DateRangePicker"
import {
  mockDashboardStats,
  mockProjectDistribution,
  mockQuickStats,
  mockRecentUsers,
  mockWorkLogActivity,
} from "@/features/admin/data/mock-dashboard"

function formatInt(n: number) {
  return new Intl.NumberFormat().format(n)
}

export function DashboardContent() {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 700)
    return () => window.clearTimeout(t)
  }, [])

  if (!ready) {
    return <DashboardSkeleton />
  }

  const stats = mockDashboardStats

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Overview of workforce activity, projects, and recent directory changes.
          </p>
        </div>
        <DateRangePicker className="md:hidden" />
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total users"
          value={formatInt(stats.totalUsers)}
          icon={Users}
          hint="Across all departments"
        />
        <StatCard
          label="Total work logs"
          value={formatInt(stats.totalWorkLogs)}
          icon={ClipboardList}
          hint="All-time entries"
        />
        <StatCard
          label="Today check-ins"
          value={formatInt(stats.todayCheckIns)}
          icon={CalendarCheck2}
          hint="Unique employees"
        />
        <StatCard
          label="Open tasks"
          value={formatInt(stats.openTasks)}
          icon={CheckSquare}
          hint="Assigned & in progress"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="rounded-xl border-neutral-200/90 bg-white shadow-sm lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Work log activity
            </CardTitle>
            <CardDescription>
              Volume of logs submitted per day for the selected range.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkLogActivityChart data={mockWorkLogActivity} />
          </CardContent>
        </Card>

        <Card className="rounded-xl border-neutral-200/90 bg-white shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Project distribution
            </CardTitle>
            <CardDescription>
              Share of logged hours by strategic initiative.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectDistributionChart data={mockProjectDistribution} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-neutral-900">
              Recent users
            </h2>
          </div>
          <RecentUsersTable users={mockRecentUsers} />
        </div>
        <QuickStatsPanel items={mockQuickStats} />
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-full max-w-md rounded-lg" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="rounded-xl border-neutral-200/90 bg-white shadow-sm"
          >
            <CardContent className="space-y-3 p-5">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-8 w-28 rounded-lg" />
              <Skeleton className="h-3 w-36 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="rounded-xl border-neutral-200/90 bg-white lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[280px] w-full rounded-xl" />
          </CardContent>
        </Card>
        <Card className="rounded-xl border-neutral-200/90 bg-white lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="h-4 w-52 rounded-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[280px] w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <Skeleton className="h-5 w-32 rounded-md" />
          <Skeleton className="h-[320px] w-full rounded-xl" />
        </div>
        <Skeleton className="h-[360px] w-full rounded-xl" />
      </div>
    </div>
  )
}

import Link from "next/link"
import { CalendarCheck2, CalendarDays, CircleDollarSign, Clock, Gift } from "lucide-react"

import { PageHeader } from "@/app/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <PageHeader
            title="Check-in Management"
            description="Manage shifts, attendance days, and bonuses—all in one consistent dashboard."
            icon={<CalendarCheck2 className="h-5 w-5 text-neutral-700" />}
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="group p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-base font-semibold text-neutral-900">
                    <Clock className="h-5 w-5 text-neutral-600" />
                    Ca làm
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">
                    Create, edit, and organize your shift templates.
                  </p>
                </div>
                <Button asChild variant="outline" className="shrink-0">
                  <Link href="/log-work/checkin/shifts">Open</Link>
                </Button>
              </div>
            </Card>

            <Card className="group p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-base font-semibold text-neutral-900">
                    <CalendarDays className="h-5 w-5 text-neutral-600" />
                    Danh sách ngày chấm công
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">
                    Review and update daily attendance records.
                  </p>
                </div>
                <Button asChild variant="outline" className="shrink-0">
                  <Link href="/log-work/checkin/attendance">Open</Link>
                </Button>
              </div>
            </Card>

            <Card className="group p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md md:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-base font-semibold text-neutral-900">
                    <CircleDollarSign className="h-5 w-5 text-neutral-600" />
                    Tổng quan
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">
                    Tổng hợp thu nhập theo tháng và lịch sử thanh toán.
                  </p>
                </div>
                <Button asChild variant="outline" className="shrink-0">
                  <Link href="/log-work/overview">Open</Link>
                </Button>
              </div>
            </Card>

            <Card className="group p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md md:col-span-2">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-base font-semibold text-neutral-900">
                    <Gift className="h-5 w-5 text-neutral-600" />
                    Thưởng / phụ cấp
                  </div>
                  <p className="mt-1 text-sm text-neutral-600">
                    Manage bonus and allowance entries with clarity.
                  </p>
                </div>
                <Button asChild variant="outline" className="shrink-0">
                  <Link href="/log-work/checkin/bonus">Open</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

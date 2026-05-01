"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowDownCircle,
  CalendarDays,
  CircleDollarSign,
  HandCoins,
  Wallet,
} from "lucide-react"

import { getCurrentMonthValue } from "../checkin/date"
import { apiUrl } from "@/app/lib/api"
import { PageHeader } from "@/app/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

const TRANSACTIONS_API = apiUrl(`/api/transactions`)
const TRANSACTIONS_SUMMARY_API = `${TRANSACTIONS_API}/summary`

type TransactionType = "attendance" | "bonus" | "advance" | "penalty" | "payment"

type Transaction = {
  id: string
  date: string
  amount: number
  type: TransactionType
  period: string | null
}

type MonthlyBreakdown = {
  period: string
  earned: number
  paidTotal: number
  unpaid: number
}

type SummaryData = {
  lifetimeSalary: number
  globalUnpaid: number
  monthly: {
    period: string
    attendance: number
    bonus: number
    advance: number
    penalty: number
    earned: number
    periodPayment: number
    allocatedPayment: number
    paidTotal: number
    unpaid: number
  }
  monthlyBreakdown: MonthlyBreakdown[]
  paymentHistory: Transaction[]
}

const typeLabel: Record<TransactionType, string> = {
  attendance: "Cham cong",
  bonus: "Phu cap",
  advance: "Tam ung",
  penalty: "Phat",
  payment: "Da thanh toan"
}

const currency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value)

async function fetchSummary(period: string): Promise<SummaryData> {
  const url = `${TRANSACTIONS_SUMMARY_API}?period=${encodeURIComponent(period)}`
  const res = await fetch(url, { method: "GET" })
  if (!res.ok) throw new Error("Khong the tai du lieu tong hop")
  const data = (await res.json()) as { data: SummaryData }
  return data.data
}

async function createPayment(amount: number): Promise<Transaction> {
  const res = await fetch(TRANSACTIONS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: -Math.abs(amount),
      date: new Date().toISOString().slice(0, 10),
      period: null,
      type: "payment"
    })
  })

  if (!res.ok) {
    throw new Error("Khong the ghi nhan thanh toan")
  }

  const data = (await res.json()) as { data: Transaction }
  return data.data
}

export default function Page() {
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [monthValue, setMonthValue] = useState(getCurrentMonthValue())
  const [paymentAmount, setPaymentAmount] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async (period: string) => {
      try {
        setLoading(true)
        setError(null)
        const result = await fetchSummary(period)
        setSummary(result)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Loi khong xac dinh")
        setSummary(null)
      } finally {
        setLoading(false)
      }
    }

    void load(monthValue)
  }, [monthValue])

  const selectedSummary = summary?.monthly ?? {
    period: monthValue,
    attendance: 0,
    bonus: 0,
    advance: 0,
    penalty: 0,
    earned: 0,
    periodPayment: 0,
    allocatedPayment: 0,
    paidTotal: 0,
    unpaid: 0
  }
  const selectedPaid = selectedSummary.paidTotal

  const submitPayment = async () => {
    const amount = Number(paymentAmount)
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Nhap so tien thanh toan hop le")
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      await createPayment(amount)
      const updated = await fetchSummary(monthValue)
      setSummary(updated)
      setPaymentAmount("")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Loi khong xac dinh")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <PageHeader
            title="Tổng quan LogWork"
            description="Tổng hợp thu nhập theo tháng"
            icon={<CircleDollarSign className="h-5 w-5 text-neutral-700" />}
            action={
              <div className="grid gap-1.5">
                <Label htmlFor="overview-month" className="text-neutral-600">
                  Tháng
                </Label>
                <Input
                  id="overview-month"
                  type="month"
                  value={monthValue}
                  onChange={e => setMonthValue(e.target.value)}
                />
              </div>
            }
          />

          {error ? (
            <Card className="border-red-200 bg-red-50 text-red-800">
              <div className="p-4 text-sm">
                <span className="font-medium">Error:</span> {error}
              </div>
            </Card>
          ) : null}

          {/* Summary cards */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Card key={idx} className="p-5">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-8 w-48" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-4 md:grid-cols-3"
            >
              <StatCard
                label="Tổng tiền từ khi bắt đầu"
                value={currency(summary?.lifetimeSalary ?? 0)}
                icon={<Wallet className="h-4 w-4 text-neutral-600" />}
              />
              <StatCard
                label="Tổng tiền tháng này"
                value={currency(selectedSummary.earned)}
                valueClassName="text-blue-600"
                icon={<CalendarDays className="h-4 w-4 text-neutral-600" />}
              />
              <StatCard
                label="Tổng chưa nhận"
                value={currency(summary?.globalUnpaid ?? 0)}
                valueClassName="text-red-600"
                icon={<HandCoins className="h-4 w-4 text-neutral-600" />}
              />
            </motion.div>
          )}

          {/* Payment detail / breakdown */}
          <Card className="p-5 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-neutral-900">
                  Quản lý thanh toán tháng {monthValue}
                </div>
                <div className="mt-1 text-sm text-neutral-600">
                  Theo dõi thu nhập, khấu trừ và số tiền còn lại cần thanh toán.
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xs text-neutral-500">Tổng</div>
                <div className="text-lg font-semibold text-blue-600">
                  {currency(selectedSummary.earned)}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 py-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ))}
              </div>
            ) : !summary ? (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-700">
                Không có dữ liệu tổng hợp cho tháng này.
              </div>
            ) : (
              <div className="text-sm">
                <div className="grid gap-2">
                  <div className="text-xs font-medium text-neutral-500">Thu nhập</div>
                  <BreakdownRow label="Tổng tiền công" value={selectedSummary.attendance} />
                  <BreakdownRow label="Tăng ca" value={0} />
                  <BreakdownRow label="Thưởng/phụ cấp" value={selectedSummary.bonus} />
                </div>

                <div className="mt-4 border-t border-neutral-200 pt-4">
                  <div className="grid gap-2">
                    <div className="text-xs font-medium text-neutral-500">Thanh toán</div>
                    <BreakdownRow label="Đã thanh toán" value={selectedPaid} />
                    <BreakdownRow
                      label="Tạm ứng"
                      value={Math.abs(Math.min(selectedSummary.advance, 0))}
                    />
                  </div>
                </div>

                <div className="mt-4 border-t border-neutral-200 pt-4">
                  <div className="grid gap-2">
                    <div className="text-xs font-medium text-neutral-500">Khấu trừ</div>
                    <BreakdownRow
                      label="Tiền trừ"
                      value={Math.abs(Math.min(selectedSummary.penalty, 0))}
                    />
                  </div>
                </div>

                <div className="mt-4 border-t border-neutral-200 pt-4">
                  <div className="grid gap-2">
                    <div className="text-xs font-medium text-neutral-500">Tổng kết</div>
                    <BreakdownRow
                      label="Tổng lương"
                      value={selectedSummary.earned}
                      strong
                      valueClassName="text-blue-600"
                    />
                    <BreakdownRow
                      label="Tổng chưa nhận"
                      value={selectedSummary.unpaid}
                      strong
                      valueClassName="text-red-600"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Optional: keep existing features but restyled to match system */}
          <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <Card className="p-5 shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm font-semibold text-neutral-900">
                  Ghi nhận thanh toán
                </div>
              </div>
              <div className="grid gap-3">
                <Input
                  type="number"
                  min={0}
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  placeholder="Số tiền"
                />
                <Button type="button" onClick={submitPayment} disabled={submitting}>
                  <ArrowDownCircle />
                  {submitting ? "Đang lưu..." : "Thanh toán"}
                </Button>
              </div>
            </Card>

            <Card className="p-5 shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm font-semibold text-neutral-900">
                  Lịch sử thanh toán
                </div>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="rounded-lg border border-neutral-200 p-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (summary?.paymentHistory.length ?? 0) === 0 ? (
                <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-700">
                  Chưa có thanh toán.
                </div>
              ) : (
                <div className="space-y-2">
                  {summary?.paymentHistory.map(payment => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white p-3 transition-colors hover:bg-neutral-50"
                    >
                      <div>
                        <div className="font-medium text-neutral-900">{payment.date}</div>
                        <div className="text-xs text-neutral-500">
                          {typeLabel[payment.type]}{" "}
                          {payment.period ? `- ${payment.period}` : "- FIFO"}
                        </div>
                      </div>
                      <div className="font-semibold text-blue-600">
                        {currency(Math.abs(payment.amount))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <Card className="p-5 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-semibold text-neutral-900">
                Bảng kê theo tháng
              </div>
            </div>

            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="rounded-lg border border-neutral-200 p-3">
                    <div className="grid gap-2 sm:grid-cols-4 sm:items-center">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24 sm:ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (summary?.monthlyBreakdown.length ?? 0) === 0 ? (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-700">
                Chưa có giao dịch nào.
              </div>
            ) : (
              <div className="space-y-2">
                {summary?.monthlyBreakdown.map(item => (
                  <div
                    key={item.period}
                    className="grid gap-2 rounded-lg border border-neutral-200 bg-white p-3 transition-colors hover:bg-neutral-50 sm:grid-cols-4 sm:items-center"
                  >
                    <div className="font-medium text-neutral-900">{item.period}</div>
                    <div className="text-sm text-neutral-600">
                      Tổng tháng: {currency(item.earned)}
                    </div>
                    <div className="text-sm text-neutral-600">
                      Đã trả: {currency(item.paidTotal)}
                    </div>
                    <div className="font-semibold text-red-600 sm:text-right">
                      {currency(item.unpaid)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  valueClassName,
  icon,
}: {
  label: string
  value: string
  valueClassName?: string
  icon?: React.ReactNode
}) {
  return (
    <Card className="p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm text-neutral-500">{label}</div>
        {icon ? (
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50">
            {icon}
          </div>
        ) : null}
      </div>
      <div className={`mt-2 text-2xl font-bold text-neutral-900 ${valueClassName ?? ""}`}>
        {value}
      </div>
    </Card>
  )
}

function BreakdownRow({
  label,
  value,
  strong = false,
  valueClassName,
}: {
  label: string
  value: number
  strong?: boolean
  valueClassName?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <span className="text-sm text-neutral-600">{label}</span>
      <span
        className={[
          "text-sm",
          strong ? "font-semibold" : "font-medium",
          valueClassName ?? "text-neutral-900",
        ].join(" ")}
      >
        {currency(value)}
      </span>
    </div>
  )
}

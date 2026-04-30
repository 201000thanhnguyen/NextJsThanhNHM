"use client"

import { useEffect, useState } from "react"

import { getCurrentMonthValue } from "../checkin/date"

const API_BASE_URL = "http://localhost:3001"
const TRANSACTIONS_API = `${API_BASE_URL}/api/transactions`
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
    <div className="min-h-screen bg-gray-100 p-4 max-w-3xl mx-auto space-y-4 text-gray-700">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tong quan LogWork</h1>
          <p className="text-sm text-gray-500">
            Tong hop tien theo thang tu backend (gom cong, thuong, tam ung, phat, thanh toan).
          </p>
        </div>

        <label className="text-sm text-gray-600">
          Thang
          <input
            type="month"
            value={monthValue}
            onChange={e => setMonthValue(e.target.value)}
            className="mt-1 block rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800"
          />
        </label>
      </div>

      {loading && <div className="text-sm text-gray-500">Dang tai...</div>}
      {error && <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">{error}</div>}

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Tong tien tu khi bat dau</div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{currency(summary?.lifetimeSalary ?? 0)}</div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Tong tien thang {monthValue}</div>
          <div className="mt-2 text-2xl font-bold text-blue-600">{currency(selectedSummary.earned)}</div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Tong chua nhan</div>
          <div className="mt-2 text-2xl font-bold text-red-600">{currency(summary?.globalUnpaid ?? 0)}</div>
        </div>
      </section>

      <section className="rounded-lg bg-white p-4 shadow">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-semibold text-gray-800">Quan ly thanh toan thang {monthValue}</h2>
          <div className="text-lg font-bold text-gray-900">{currency(selectedSummary.earned)}</div>
        </div>

        <div className="divide-y divide-dashed divide-gray-200">
          <SummaryRow label="Loai" textValue="Cham cong theo ca" />
          <SummaryRow label="Tong tien cong" value={selectedSummary.attendance} />
          <SummaryRow label="Tang ca" value={0} />
          <SummaryRow label="Tong thuong/phu cap" value={selectedSummary.bonus} />
          <SummaryRow label="Tong luong" value={selectedSummary.earned} strong />
          <SummaryRow label="Tong da ung" value={Math.abs(Math.min(selectedSummary.advance, 0))} />
          <SummaryRow label="Tong tien tru" value={Math.abs(Math.min(selectedSummary.penalty, 0))} />
          <SummaryRow label="Tong da thanh toan" value={selectedPaid} />
          <SummaryRow label="Tong chua nhan" value={selectedSummary.unpaid} strong />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Tong tat ca tien luong</div>
          <div className="mt-2 text-xl font-bold text-gray-900">{currency(summary?.lifetimeSalary ?? 0)}</div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Da thanh toan thang nay</div>
          <div className="mt-2 text-xl font-bold text-green-600">{currency(selectedPaid)}</div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <div className="text-sm text-gray-500">Con lai thang nay</div>
          <div className="mt-2 text-xl font-bold text-red-600">{currency(selectedSummary.unpaid)}</div>
        </div>
      </section>

      <section className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-3 font-semibold text-gray-800">Bang ke theo thang</h2>
        <div className="space-y-2">
          {(summary?.monthlyBreakdown.length ?? 0) === 0 && (
            <div className="text-sm text-gray-500">Chua co giao dich nao.</div>
          )}
          {summary?.monthlyBreakdown.map(item => (
            <div
              key={item.period}
              className="grid gap-2 rounded-lg border border-gray-200 p-3 sm:grid-cols-4 sm:items-center"
            >
              <div className="font-medium text-gray-800">{item.period}</div>
              <div className="text-sm text-gray-500">Tong thang: {currency(item.earned)}</div>
              <div className="text-sm text-gray-500">
                Da tra: {currency(item.paidTotal)}
              </div>
              <div className="font-semibold text-red-600 sm:text-right">
                {currency(item.unpaid)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-3 font-semibold text-gray-800">Ghi nhan thanh toan</h2>
          <div className="space-y-3">
            <input
              type="number"
              min="0"
              value={paymentAmount}
              onChange={e => setPaymentAmount(e.target.value)}
              placeholder="So tien"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800"
            />
            <button
              type="button"
              onClick={submitPayment}
              disabled={submitting}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:bg-blue-300"
            >
              {submitting ? "Dang luu..." : "Thanh toan"}
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="mb-3 font-semibold text-gray-800">Lich su thanh toan</h2>
          <div className="space-y-2">
            {(summary?.paymentHistory.length ?? 0) === 0 && (
              <div className="text-sm text-gray-500">Chua co thanh toan.</div>
            )}
            {summary?.paymentHistory.map(payment => (
              <div
                key={payment.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
              >
                <div>
                  <div className="font-medium text-gray-800">{payment.date}</div>
                  <div className="text-xs text-gray-500">
                    {typeLabel[payment.type]} {payment.period ? `- ${payment.period}` : "- FIFO"}
                  </div>
                </div>
                <div className="font-semibold text-green-600">
                  {currency(Math.abs(payment.amount))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function SummaryRow({
  label,
  value,
  textValue,
  strong = false
}: {
  label: string
  value?: number
  textValue?: string
  strong?: boolean
}) {
  const content = textValue ?? currency(value ?? 0)

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={strong ? "font-bold text-gray-900" : "font-medium text-gray-800"}>
        {content}
      </span>
    </div>
  )
}

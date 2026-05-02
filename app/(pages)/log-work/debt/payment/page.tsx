"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { ArrowLeft, Banknote } from "lucide-react"

import { PageHeader } from "@/app/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { CustomerSearchInput, todayYmdLocal } from "../components/CustomerSearchInput"
import {
  addPaymentAdjustment,
  createPayment,
  formatVnd,
  getCustomer,
  listPayments,
} from "../debt-api"
import type { DebtPaymentListRow } from "../types"

type Cust = { id: string; name: string } | null

function displayPaymentDate(p: DebtPaymentListRow): string {
  if (p.paymentDate) return p.paymentDate
  return p.createdAt.slice(0, 10)
}

function DebtPaymentPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const customerIdParam = searchParams.get("customerId")

  const [customer, setCustomer] = useState<Cust>(null)
  const [amountStr, setAmountStr] = useState("")
  const [paymentDate, setPaymentDate] = useState(todayYmdLocal)
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)
  const [rows, setRows] = useState<DebtPaymentListRow[]>([])

  const [adjOpen, setAdjOpen] = useState(false)
  const [adjPayment, setAdjPayment] = useState<DebtPaymentListRow | null>(null)
  const [adjAmountStr, setAdjAmountStr] = useState("")
  const [adjNote, setAdjNote] = useState("")
  const [adjSaving, setAdjSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      const data = await listPayments(customer?.id)
      setRows(data)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không tải được lịch sử")
    }
  }, [customer?.id])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!customerIdParam?.trim()) return
    let cancelled = false
    ;(async () => {
      try {
        const c = await getCustomer(customerIdParam.trim())
        if (!cancelled) setCustomer({ id: c.id, name: c.name })
      } catch (e) {
        if (!cancelled) {
          toast.error(e instanceof Error ? e.message : "Không tải được khách hàng")
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [customerIdParam])

  const submit = async () => {
    if (!customer) {
      toast.error("Chọn khách hàng từ gợi ý")
      return
    }
    const amount = Number(amountStr.replace(/\s/g, "").replace(",", "."))
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Nhập số tiền lớn hơn 0")
      return
    }
    try {
      setSaving(true)
      await createPayment({
        customerId: customer.id,
        amount,
        paymentDate: paymentDate.trim() || undefined,
        note: note.trim() || undefined,
      })
      toast.success("Đã ghi thanh toán")
      router.push(`/log-work/debt/customers/${encodeURIComponent(customer.id)}`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không ghi được")
    } finally {
      setSaving(false)
    }
  }

  const openAdjust = (p: DebtPaymentListRow) => {
    setAdjPayment(p)
    setAdjAmountStr("")
    setAdjNote("")
    setAdjOpen(true)
  }

  const saveAdjust = async () => {
    if (!adjPayment) return
    const delta = Number(adjAmountStr.replace(/\s/g, "").replace(",", "."))
    if (!Number.isFinite(delta) || delta === 0) {
      toast.error("Nhập số điều chỉnh khác 0 (âm = lấy lại tiền, dương = bổ sung)")
      return
    }
    try {
      setAdjSaving(true)
      await addPaymentAdjustment(adjPayment.id, {
        amountAdjustment: delta,
        note: adjNote.trim() || undefined,
      })
      toast.success("Đã lưu điều chỉnh")
      setAdjOpen(false)
      setAdjPayment(null)
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không lưu được")
    } finally {
      setAdjSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-2 h-11 gap-2 px-2 text-base">
            <Link href="/log-work/debt">
              <ArrowLeft className="h-4 w-4" />
              Trang chủ nợ
            </Link>
          </Button>
          <PageHeader
            title="Thanh toán"
            description="Ghi nhận tiền khách trả; có thể điều chỉnh sau nếu đổi ý (lấy lại / bổ sung)."
            icon={<Banknote className="h-5 w-5 text-neutral-700" />}
          />
        </div>

        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault()
            void submit()
          }}
        >
          <Card className="p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Khách hàng</h2>
            <div className="mt-4">
              <CustomerSearchInput
                value={customer}
                onChange={setCustomer}
                autoFocus={!customerIdParam?.trim()}
              />
            </div>
          </Card>

          <Card className="p-5 shadow-sm sm:p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="pay-amt" className="text-base">
                  Số tiền
                </Label>
                <Input
                  id="pay-amt"
                  inputMode="decimal"
                  className="mt-2 h-14 text-lg tabular-nums"
                  placeholder="Ví dụ: 10000"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                />
                <p className="mt-2 text-sm text-neutral-500">Bất kỳ số dương nào (ví dụ 10000, 500000).</p>
              </div>
              <div>
                <Label htmlFor="pay-date" className="text-base">
                  Ngày thanh toán
                </Label>
                <Input
                  id="pay-date"
                  type="date"
                  className="mt-2 h-14 text-lg"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-5">
              <Label htmlFor="pay-note" className="text-base">
                Ghi chú
              </Label>
              <Textarea
                id="pay-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="mt-2 text-lg"
                placeholder="Tuỳ chọn"
              />
            </div>
            <Button type="submit" disabled={saving} className="mt-6 h-14 w-full text-lg sm:w-auto sm:min-w-[12rem]">
              {saving ? "Đang lưu…" : "Ghi thanh toán"}
            </Button>
          </Card>
        </form>

        <Card className="mt-10 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Lịch sử thanh toán</h2>
            <Button type="button" variant="outline" className="h-11 text-base" onClick={() => void load()}>
              Làm mới
            </Button>
          </div>
          {customer ? (
            <p className="mt-2 text-sm text-neutral-600">Lịch sử của: {customer.name}</p>
          ) : null}
          <ul className="mt-4 divide-y divide-neutral-200 rounded-xl border border-neutral-200">
            {rows.map((p) => (
              <li key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="text-base font-semibold text-neutral-900">{p.customerNameSnapshot}</div>
                  <div className="text-sm text-neutral-600">
                    Ngày: {displayPaymentDate(p)} · Ghi nhận: {new Date(p.createdAt).toLocaleString("vi-VN")}
                  </div>
                  {p.note ? <div className="mt-1 text-sm text-neutral-700">{p.note}</div> : null}
                </div>
                <div className="flex flex-col items-stretch gap-2 sm:items-end">
                  <div className="text-right">
                    <div className="text-xs text-neutral-500">Gốc / Hiệu lực</div>
                    <div className="text-lg font-semibold tabular-nums text-emerald-800">
                      {formatVnd(p.amount)} đ → {formatVnd(p.actualAmount)} đ
                    </div>
                  </div>
                  <Button type="button" className="h-11 text-base" onClick={() => openAdjust(p)}>
                    Điều chỉnh
                  </Button>
                </div>
              </li>
            ))}
            {rows.length === 0 ? (
              <li className="p-6 text-center text-neutral-600">Chưa có thanh toán.</li>
            ) : null}
          </ul>
        </Card>

        <Dialog open={adjOpen} onOpenChange={setAdjOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Điều chỉnh thanh toán</DialogTitle>
            </DialogHeader>
            {adjPayment ? (
              <p className="text-sm text-neutral-600">
                Khách: <strong>{adjPayment.customerNameSnapshot}</strong>
                <br />
                Hiệu lực hiện tại: <strong>{formatVnd(adjPayment.actualAmount)} đ</strong>
              </p>
            ) : null}
            <div className="grid gap-3">
              <div>
                <Label className="text-base">Số tiền điều chỉnh</Label>
                <Input
                  inputMode="decimal"
                  className="mt-2 h-12 text-lg tabular-nums"
                  placeholder="-5000 hoặc +2000"
                  value={adjAmountStr}
                  onChange={(e) => setAdjAmountStr(e.target.value)}
                />
                <p className="mt-1 text-xs text-neutral-500">Âm: khách lấy lại · Dương: trả thêm.</p>
              </div>
              <div>
                <Label className="text-base">Ghi chú</Label>
                <Textarea className="mt-2 text-base" value={adjNote} onChange={(e) => setAdjNote(e.target.value)} />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" className="h-11 text-base" onClick={() => setAdjOpen(false)}>
                Huỷ
              </Button>
              <Button type="button" className="h-11 text-base" disabled={adjSaving} onClick={() => void saveAdjust()}>
                {adjSaving ? "Đang lưu…" : "Lưu"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default function DebtPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-neutral-50 to-white px-4 py-20 text-neutral-600">
          Đang tải…
        </div>
      }
    >
      <DebtPaymentPageInner />
    </Suspense>
  )
}

"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Gift, Pencil, Plus, Trash2 } from "lucide-react"

import { getCurrentMonthValue } from "../date"
import { apiUrl } from "@/app/lib/api"
import { PageHeader } from "@/app/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

const TRANSACTIONS_API = apiUrl(`/api/transactions`)

type Transaction = {
  id: string
  date: string
  amount: number
  type: "attendance" | "bonus" | "advance" | "penalty" | "payment"
  period: string | null
  title?: string | null
  note?: string | null
}

const currency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value)

async function fetchTransactions(): Promise<Transaction[]> {
  const res = await fetch(TRANSACTIONS_API, { method: "GET" })
  if (!res.ok) throw new Error("Khong the tai giao dich")
  const data = (await res.json()) as { data?: Transaction[] }
  return data.data ?? []
}

async function createBonus(input: {
  title: string
  amount: number
  date: string
  note: string
}): Promise<void> {
  const res = await fetch(TRANSACTIONS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "bonus",
      amount: Math.abs(Math.trunc(input.amount)),
      date: input.date,
      period: input.date.slice(0, 7),
      title: input.title,
      note: input.note || null
    })
  })

  if (!res.ok) {
    throw new Error("Khong the luu thuong/phu cap")
  }
}

async function updateBonus(
  id: string,
  input: { title: string; amount: number; date: string; note: string }
): Promise<void> {
  const res = await fetch(`${TRANSACTIONS_API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "bonus",
      amount: Math.abs(Math.trunc(input.amount)),
      date: input.date,
      period: input.date.slice(0, 7),
      title: input.title,
      note: input.note || null
    })
  })
  if (!res.ok) {
    throw new Error("Khong the cap nhat thuong/phu cap")
  }
}

async function deleteBonus(id: string): Promise<void> {
  const res = await fetch(`${TRANSACTIONS_API}/${id}`, { method: "DELETE" })
  if (!res.ok) {
    throw new Error("Khong the xoa thuong/phu cap")
  }
}

export default function BonusPage() {
  const [monthValue, setMonthValue] = useState(getCurrentMonthValue())
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchTransactions()
      setTransactions(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Loi khong xac dinh")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const monthlyBonus = useMemo(
    () =>
      transactions
        .filter(item => item.type === "bonus" && item.period === monthValue)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [transactions, monthValue]
  )

  const totalMonth = monthlyBonus.reduce((sum, item) => sum + item.amount, 0)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const parsed = Number(amount)
    if (!title.trim()) {
      setError("Nhap tieu de")
      return
    }
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Nhap so tien hop le")
      return
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError("Ngay nhan phu cap khong hop le")
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      const payload = {
        title: title.trim(),
        amount: parsed,
        date,
        note: note.trim()
      }
      if (editingId) {
        await updateBonus(editingId, payload)
        toast.success("Đã cập nhật thưởng/phụ cấp")
      } else {
        await createBonus(payload)
        toast.success("Đã thêm thưởng/phụ cấp")
      }
      setTitle("")
      setAmount("")
      setNote("")
      setEditingId(null)
      await load()
      setMonthValue(date.slice(0, 7))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Loi khong xac dinh")
      toast.error("Không thể lưu thưởng/phụ cấp")
    } finally {
      setSubmitting(false)
    }
  }

  const startEdit = (item: Transaction) => {
    setEditingId(item.id)
    setTitle(item.title ?? "")
    setAmount(String(item.amount))
    setDate(item.date)
    setNote(item.note ?? "")
    setError(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setTitle("")
    setAmount("")
    setDate(new Date().toISOString().slice(0, 10))
    setNote("")
    setError(null)
  }

  const onDelete = async (id: string) => {
    const ok = window.confirm("Ban chac chan muon xoa khoan thuong/phu cap nay?")
    if (!ok) return
    try {
      setSubmitting(true)
      setError(null)
      await deleteBonus(id)
      toast.success("Đã xóa thưởng/phụ cấp")
      if (editingId === id) {
        cancelEdit()
      }
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Loi khong xac dinh")
      toast.error("Không thể xóa thưởng/phụ cấp")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <PageHeader
            title="Thưởng / phụ cấp"
            description="Quản lý thưởng và phụ cấp theo tháng"
            icon={<Gift className="h-5 w-5 text-neutral-700" />}
            action={
              <div className="flex items-center gap-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="bonus-month" className="text-neutral-600">
                    Tháng
                  </Label>
                  <Input
                    id="bonus-month"
                    type="month"
                    value={monthValue}
                    onChange={e => setMonthValue(e.target.value)}
                  />
                </div>
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

          {/* Form */}
          <Card className="p-5 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-neutral-900">
                Thêm thưởng / phụ cấp
              </div>
              {editingId ? (
                <Button type="button" variant="ghost" onClick={cancelEdit} disabled={submitting}>
                  Hủy sửa
                </Button>
              ) : null}
            </div>

            <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="bonus-title">Tiêu đề</Label>
                <Input
                  id="bonus-title"
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ví dụ: Phụ cấp xăng"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bonus-amount">Số tiền</Label>
                <Input
                  id="bonus-amount"
                  type="number"
                  min={0}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Nhập số tiền"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bonus-date">Ngày nhận</Label>
                <Input
                  id="bonus-date"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>

              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="bonus-note">Ghi chú</Label>
                <Textarea
                  id="bonus-note"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Ghi chú thêm (nếu có)"
                  rows={3}
                />
              </div>

              <div className="md:col-span-2 flex items-center justify-end gap-2">
                <Button type="submit" disabled={submitting}>
                  {editingId ? <Pencil /> : <Plus />}
                  {submitting ? "Đang lưu..." : editingId ? "Cập nhật" : "Lưu"}
                </Button>
              </div>
            </form>
          </Card>

          {/* List */}
          <Card className="p-5 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-neutral-900">
                Danh sách tháng {monthValue}
              </div>
              <div className="text-right">
                <div className="text-xs text-neutral-500">Tổng</div>
                <div className="text-lg font-semibold text-neutral-900">
                  <span className="text-blue-600">{currency(totalMonth)}</span>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid gap-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="rounded-lg border border-neutral-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-44" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-56" />
                      </div>
                      <Skeleton className="h-5 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : monthlyBonus.length === 0 ? (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-6 text-center text-sm text-neutral-700">
                Chưa có thưởng/phụ cấp trong tháng này
              </div>
            ) : (
              <div className="divide-y divide-neutral-200 rounded-lg border border-neutral-200">
                {monthlyBonus.map(item => (
                  <div key={item.id} className="flex items-start justify-between gap-4 p-4">
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-neutral-900">
                        {item.title || "Thưởng / phụ cấp"}
                      </div>
                      <div className="mt-1 text-xs text-neutral-500">
                        Ngày nhận: {item.date}
                      </div>
                      {item.note ? (
                        <div className="mt-2 text-sm text-neutral-600">
                          {item.note}
                        </div>
                      ) : null}
                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(item)}
                          disabled={submitting}
                        >
                          <Pencil />
                          Sửa
                        </Button>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <div className="text-right">
                        <div className="text-xs text-neutral-500">Số tiền</div>
                        <div className="font-semibold text-blue-600">
                          {currency(item.amount)}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-red-700 hover:bg-red-50 hover:text-red-800"
                        onClick={() => void onDelete(item.id)}
                        disabled={submitting}
                        aria-label="Delete bonus"
                      >
                        <Trash2 />
                      </Button>
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

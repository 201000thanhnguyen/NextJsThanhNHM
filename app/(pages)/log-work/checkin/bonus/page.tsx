"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"

import { getCurrentMonthValue } from "../date"
import { apiUrl } from "@/app/lib/api"

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
      } else {
        await createBonus(payload)
      }
      setTitle("")
      setAmount("")
      setNote("")
      setEditingId(null)
      await load()
      setMonthValue(date.slice(0, 7))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Loi khong xac dinh")
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
      if (editingId === id) {
        cancelEdit()
      }
      await load()
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
          <h1 className="text-2xl font-bold text-gray-800">Thuong / phu cap</h1>
          <p className="text-sm text-gray-500">Nhap 4 thong tin va quan ly theo thang.</p>
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

      <section className="rounded-lg bg-white p-4 shadow">
        <h2 className="mb-3 font-semibold text-gray-800">
          {editingId ? "Sua thuong / phu cap" : "Them thuong / phu cap"}
        </h2>
        <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm text-gray-600 sm:col-span-2">
            Tieu de
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800"
              placeholder="Vi du: Phu cap xang"
            />
          </label>

          <label className="text-sm text-gray-600">
            So tien
            <input
              type="number"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800"
              placeholder="Nhap so tien"
            />
          </label>

          <label className="text-sm text-gray-600">
            Ngay nhan phu cap
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800"
            />
          </label>

          <label className="text-sm text-gray-600 sm:col-span-2">
            Ghi chu
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800"
              placeholder="Ghi chu them (neu co)"
            />
          </label>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:bg-blue-300"
            >
              {submitting ? "Dang luu..." : editingId ? "Cap nhat" : "Luu thuong / phu cap"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="ml-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700"
              >
                Huy sua
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="rounded-lg bg-white p-4 shadow">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-semibold text-gray-800">Danh sach thang {monthValue}</h2>
          <div className="text-lg font-bold text-blue-600">{currency(totalMonth)}</div>
        </div>

        <div className="space-y-2">
          {monthlyBonus.length === 0 && (
            <div className="text-sm text-gray-500">Chua co thuong/phu cap trong thang nay.</div>
          )}

          {monthlyBonus.map(item => (
            <div key={item.id} className="rounded-lg border border-gray-200 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium text-gray-800">{item.title || "Thuong / phu cap"}</div>
                <div className="font-semibold text-green-600">{currency(item.amount)}</div>
              </div>
              <div className="mt-1 text-xs text-gray-500">Ngay nhan: {item.date}</div>
              {item.note && <div className="mt-2 text-sm text-gray-600">{item.note}</div>}
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                >
                  Sua
                </button>
                <button
                  type="button"
                  onClick={() => void onDelete(item.id)}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700"
                >
                  Xoa
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

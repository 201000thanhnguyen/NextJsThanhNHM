"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { ArrowLeft, Users } from "lucide-react"

import { PageHeader } from "@/app/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

import { createCustomer, customerDebts, formatVnd, listCustomers, moneyNum, searchCustomers } from "../debt-api"
import type { CustomerDebtRow, DebtCustomer } from "../types"

export default function DebtCustomersPage() {
  const [q, setQ] = useState("")
  const [debounced, setDebounced] = useState("")
  const [rows, setRows] = useState<DebtCustomer[]>([])
  const [debts, setDebts] = useState<CustomerDebtRow[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(q.trim()), 300)
    return () => window.clearTimeout(t)
  }, [q])

  const load = async () => {
    try {
      setLoading(true)
      const [d, base] = await Promise.all([customerDebts(), listCustomers()])
      setDebts(d)
      if (!debounced) {
        setRows(base)
      } else {
        const hit = await searchCustomers(debounced)
        setRows(hit)
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không tải được")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced])

  const debtMap = new Map(debts.map((x) => [x.customerId, x.debt]))

  const create = async () => {
    if (!name.trim()) {
      toast.error("Nhập tên")
      return
    }
    try {
      setSaving(true)
      await createCustomer({
        name: name.trim(),
        phone: phone.trim() || undefined,
        note: note.trim() || undefined,
      })
      toast.success("Đã tạo")
      setOpen(false)
      setName("")
      setPhone("")
      setNote("")
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="mb-4 h-11 gap-2 px-2 text-base">
          <Link href="/log-work/debt">
            <ArrowLeft className="h-4 w-4" />
            Trang chủ nợ
          </Link>
        </Button>
        <PageHeader
          title="Khách hàng"
          description="Tìm theo tên hoặc SĐT (gợi ý tối đa 10). Bấm dòng để xem chi tiết."
          icon={<Users className="h-5 w-5 text-neutral-700" />}
        />

        <Card className="mt-6 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <Label htmlFor="cust-q" className="text-base">
                Tìm kiếm
              </Label>
              <Input
                id="cust-q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Gõ để tìm…"
                className="mt-2 h-14 text-lg"
              />
            </div>
            <Button type="button" className="h-14 shrink-0 text-lg" onClick={() => setOpen(true)}>
              + Tạo khách
            </Button>
          </div>

          <ul className="mt-6 divide-y divide-neutral-200 rounded-xl border border-neutral-200">
            {loading ? (
              <li className="p-6 text-center text-neutral-600">Đang tải…</li>
            ) : (
              rows.map((c) => {
                const debt = debtMap.get(c.id)
                return (
                  <li key={c.id}>
                    <Link
                      href={`/log-work/debt/customers/${c.id}`}
                      className="flex flex-col gap-1 p-4 transition hover:bg-neutral-50 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <div className="text-lg font-semibold text-neutral-900">{c.name}</div>
                        {c.phone ? <div className="text-sm text-neutral-600">{c.phone}</div> : null}
                      </div>
                      {debt ? (
                        <div className="text-right text-sm">
                          <div className="text-neutral-500">Còn nợ</div>
                          <div className="text-lg font-semibold tabular-nums text-red-700">
                          {formatVnd(moneyNum(debt))} đ
                        </div>
                        </div>
                      ) : (
                        <div className="text-sm text-emerald-700">Không nợ</div>
                      )}
                    </Link>
                  </li>
                )
              })
            )}
            {!loading && rows.length === 0 ? (
              <li className="p-6 text-center text-neutral-600">Không có khách hàng.</li>
            ) : null}
          </ul>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">Tạo khách hàng</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <Label className="text-base">Tên *</Label>
                <Input className="mt-2 h-12 text-lg" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label className="text-base">SĐT</Label>
                <Input className="mt-2 h-12 text-lg" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label className="text-base">Ghi chú</Label>
                <Textarea className="mt-2 text-base" value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" className="h-11 text-base" onClick={() => setOpen(false)}>
                Huỷ
              </Button>
              <Button type="button" className="h-11 text-base" disabled={saving} onClick={() => void create()}>
                {saving ? "Đang lưu…" : "Lưu"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

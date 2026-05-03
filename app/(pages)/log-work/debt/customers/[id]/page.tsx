"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Banknote, FilePlus, UserRound } from "lucide-react"
import { toast } from "sonner"

import { PageHeader } from "@/app/components/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import {
  customerTimeline,
  formatVnd,
  getCustomer,
  listPayments,
  listTransactions,
  moneyNum,
  updateCustomer,
} from "../../debt-api"
import type { DebtCustomer, DebtPaymentListRow, DebtTransactionDetail, TimelineEntry } from "../../types"

function isValidPhone(phone: string): boolean {
  const raw = phone.trim()
  if (!raw) return true
  if (!/^[0-9+\-\s().]+$/.test(raw)) return false
  const digits = raw.replace(/\D/g, "")
  return digits.length >= 8 && digits.length <= 15
}

function statusBadge(status: string) {
  if (status === "PAID") return <Badge variant="success">Đã trả</Badge>
  if (status === "PARTIAL") return <Badge variant="info">Một phần</Badge>
  return <Badge variant="destructive">Chưa trả</Badge>
}

export default function CustomerDebtDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params?.id ?? ""

  const [tab, setTab] = useState<"tx" | "pay">("tx")
  const [customer, setCustomer] = useState<DebtCustomer | null>(null)
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [txs, setTxs] = useState<DebtTransactionDetail[]>([])
  const [pays, setPays] = useState<DebtPaymentListRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editing, setEditing] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)
  const [draftName, setDraftName] = useState("")
  const [draftPhone, setDraftPhone] = useState("")
  const [draftNote, setDraftNote] = useState("")

  const load = useCallback(async () => {
    if (!id) return
    try {
      setError(null)
      const [cust, tl, t, p] = await Promise.all([
        getCustomer(id),
        customerTimeline(id),
        listTransactions(id),
        listPayments(id),
      ])
      setCustomer(cust)
      setTimeline(tl)
      setTxs(t)
      setPays(p)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được")
    }
  }, [id])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      await load()
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [load])

  const currentDebt = useMemo(() => {
    if (!timeline.length) return 0
    const latest = timeline[0]
    return moneyNum(latest.runningDebt)
  }, [timeline])

  const startEdit = () => {
    if (!customer) return
    setDraftName(customer.name ?? "")
    setDraftPhone(customer.phone ?? "")
    setDraftNote(customer.note ?? "")
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    if (!customer) return
    setDraftName(customer.name ?? "")
    setDraftPhone(customer.phone ?? "")
    setDraftNote(customer.note ?? "")
  }

  const saveEdit = async () => {
    if (!customer) return
    const name = draftName.trim()
    const phone = draftPhone.trim()
    const note = draftNote.trim()

    if (!name) {
      toast.error("Tên khách hàng là bắt buộc")
      return
    }
    if (!isValidPhone(phone)) {
      toast.error("Số điện thoại không hợp lệ")
      return
    }

    try {
      setSavingEdit(true)
      const updated = await updateCustomer(customer.id, {
        name,
        phone: phone || "",
        note: note || "",
      })
      setCustomer(updated)
      toast.success("Đã cập nhật khách hàng")
      setEditing(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không cập nhật được")
    } finally {
      setSavingEdit(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <PageHeader
            title={customer?.name || "Khách hàng"}
            description="Theo dõi giao dịch, thanh toán và mức nợ lũy kế (ước tính trên timeline)."
            icon={<UserRound className="h-5 w-5 text-neutral-700" />}
            backHref="/log-work/debt/customers"
            backLabel="Danh sách khách"
            action={
              customer ? (
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 text-base"
                  onClick={() => (editing ? cancelEdit() : startEdit())}
                >
                  {editing ? "Huỷ" : "Chỉnh sửa"}
                </Button>
              ) : null
            }
          />

          {customer?.phone ? (
            <div className="-mt-2 text-sm text-neutral-700">
              <span className="mr-2">📞</span>
              <span className="font-medium">{customer.phone}</span>
            </div>
          ) : null}

          {customer ? (
            <Card className="p-5 shadow-sm">
              {!editing ? (
                <div className="space-y-1 text-sm text-neutral-700">
                  <div>
                    <span className="text-neutral-500">Tên:</span>{" "}
                    <span className="font-semibold text-neutral-900">{customer.name}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">SĐT:</span>{" "}
                    <span className="font-medium">{customer.phone || "—"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Ghi chú:</span>{" "}
                    <span className="font-medium">{customer.note || "—"}</span>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  <div>
                    <Label className="text-base">Tên khách hàng</Label>
                    <Input
                      className="mt-2 h-12 text-base"
                      value={draftName}
                      onFocus={(e) => e.currentTarget.select()}
                      onChange={(e) => setDraftName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-base">Số điện thoại</Label>
                    <Input
                      className="mt-2 h-12 text-base"
                      value={draftPhone}
                      onFocus={(e) => e.currentTarget.select()}
                      onChange={(e) => setDraftPhone(e.target.value)}
                      placeholder="Tuỳ chọn"
                    />
                  </div>
                  <div>
                    <Label className="text-base">Ghi chú</Label>
                    <Textarea
                      className="mt-2 text-base"
                      rows={3}
                      value={draftNote}
                      onChange={(e) => setDraftNote(e.target.value)}
                      placeholder="Tuỳ chọn"
                    />
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="button" className="h-11 text-base" disabled={savingEdit} onClick={() => void saveEdit()}>
                      {savingEdit ? "Đang lưu…" : "Lưu"}
                    </Button>
                    <Button type="button" variant="secondary" className="h-11 text-base" onClick={cancelEdit}>
                      Huỷ
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ) : null}

          <Card className="flex flex-col gap-2 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm text-neutral-600">Công nợ còn lại (ước tính)</div>
              <div className="text-3xl font-semibold tabular-nums text-neutral-900">
                {formatVnd(currentDebt)} đ
              </div>
            </div>
            <Button type="button" variant="outline" className="h-11 text-base" onClick={() => void load()}>
              Làm mới
            </Button>
          </Card>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="rounded-xl border border-neutral-200 bg-white px-4 py-6 text-center text-base text-neutral-600">
              Đang tải…
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-neutral-200 bg-white p-2 shadow-sm">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={tab === "tx" ? "default" : "secondary"}
                    className="h-12 text-base"
                    onClick={() => setTab("tx")}
                  >
                    Giao dịch
                  </Button>
                  <Button
                    type="button"
                    variant={tab === "pay" ? "default" : "secondary"}
                    className="h-12 text-base"
                    onClick={() => setTab("pay")}
                  >
                    Thanh toán
                  </Button>
                </div>
              </div>

              {tab === "tx" ? (
                <Card className="p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-neutral-900">Giao dịch</h2>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-lg border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
                      title="Thêm giao dịch"
                      aria-label="Thêm giao dịch"
                      onClick={() =>
                        router.push(`/log-work/debt/transaction?customerId=${encodeURIComponent(id)}`)
                      }
                    >
                      <FilePlus className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {txs.map((t) => (
                      <li key={t.id} className="rounded-xl border border-neutral-200 bg-neutral-50/40 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="text-sm text-neutral-600">
                            Ngày nợ: {t.transactionDate ?? t.createdAt.slice(0, 10)} · Ghi:{" "}
                            {new Date(t.createdAt).toLocaleString("vi-VN")}
                          </div>
                          {statusBadge(t.status)}
                        </div>
                        <div className="mt-2 text-xl font-semibold tabular-nums text-neutral-900">
                          {formatVnd(t.totalAmount)} đ
                        </div>
                        {t.items?.length ? (
                          <ul className="mt-2 space-y-1 text-sm text-neutral-700">
                            {t.items.map((it) => (
                              <li key={it.id} className="flex justify-between gap-2">
                                <span className="min-w-0 truncate">
                                  {it.productNameSnapshot} ×{it.quantity}
                                </span>
                                <span className="shrink-0 tabular-nums">{formatVnd(it.subtotal)} đ</span>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </li>
                    ))}
                    {txs.length === 0 ? (
                      <li className="text-sm text-neutral-600">Chưa có giao dịch.</li>
                    ) : null}
                  </ul>
                </Card>
              ) : (
                <Card className="p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-neutral-900">Thanh toán</h2>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 shrink-0 rounded-lg border-neutral-200 text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900"
                      title="Thêm thanh toán"
                      aria-label="Thêm thanh toán"
                      onClick={() =>
                        router.push(`/log-work/debt/payment?customerId=${encodeURIComponent(id)}`)
                      }
                    >
                      <Banknote className="h-4 w-4" aria-hidden />
                    </Button>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {pays.map((p) => (
                      <li key={p.id} className="rounded-xl border border-neutral-200 bg-neutral-50/40 p-4">
                        <div className="text-sm text-neutral-600">
                          Ngày TT: {p.paymentDate ?? p.createdAt.slice(0, 10)} · Ghi:{" "}
                          {new Date(p.createdAt).toLocaleString("vi-VN")}
                        </div>
                        <div className="mt-2 text-xl font-semibold tabular-nums text-emerald-800">
                          +{formatVnd(p.actualAmount)} đ
                          <span className="ml-2 text-sm font-normal text-neutral-600">
                            (gốc {formatVnd(p.amount)} đ)
                          </span>
                        </div>
                        {p.note ? <div className="mt-2 text-sm text-neutral-600">{p.note}</div> : null}
                      </li>
                    ))}
                    {pays.length === 0 ? (
                      <li className="text-sm text-neutral-600">Chưa có thanh toán.</li>
                    ) : null}
                  </ul>
                </Card>
              )}

              <Card className="p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-neutral-900">Timeline &amp; nợ chạy</h2>
                <p className="mt-1 text-sm text-neutral-600">
                  Mỗi bước cộng phát sinh nợ, trừ khi có thanh toán — số “nợ chạy” mang tính minh hoạ.
                </p>
                <ol className="relative mt-5 space-y-4 border-l-2 border-neutral-200 pl-6">
                  {timeline.map((e) => (
                    <li key={`${e.kind}-${e.id}`} className="relative">
                      <span className="absolute -left-[9px] top-2 h-3 w-3 rounded-full bg-neutral-900 ring-4 ring-white" />
                      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-sm text-neutral-600">
                            {e.kind === "transaction"
                              ? `Ngày nợ: ${e.transactionDate}`
                              : `Ngày TT: ${e.paymentDate}`}{" "}
                            · {new Date(e.createdAt).toLocaleString("vi-VN")}
                          </div>
                          <Badge variant={e.kind === "transaction" ? "secondary" : "success"}>
                            {e.kind === "transaction" ? "Phát sinh" : "Thanh toán"}
                          </Badge>
                        </div>
                        {e.kind === "transaction" ? (
                          <div className="mt-2 text-lg font-semibold text-neutral-900">
                            +{formatVnd(e.totalAmount)} đ{" "}
                            <span className="text-sm font-normal text-neutral-600">
                              (đã trả {formatVnd(e.paidAmount)} đ)
                            </span>
                          </div>
                        ) : (
                          <div className="mt-2 text-lg font-semibold text-emerald-800">
                            −{formatVnd(e.actualAmount)} đ
                            <span className="ml-2 text-sm font-normal text-neutral-600">
                              (gốc {formatVnd(e.amount)} đ)
                            </span>
                          </div>
                        )}
                        <div className="mt-2 text-sm text-neutral-700">
                          Nợ chạy:{" "}
                          <span className="font-semibold tabular-nums">{formatVnd(e.runningDebt)} đ</span>
                        </div>
                      </div>
                    </li>
                  ))}
                  {timeline.length === 0 ? (
                    <li className="text-sm text-neutral-600">Chưa có dữ liệu timeline.</li>
                  ) : null}
                </ol>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

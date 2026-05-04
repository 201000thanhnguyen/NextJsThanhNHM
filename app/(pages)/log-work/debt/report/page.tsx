"use client"

import Link from "next/link"
import { Fragment, useEffect, useMemo, useState } from "react"
import { ArrowLeft, FileText } from "lucide-react"

import { PageHeader } from "@/app/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { debtReport, formatVnd } from "../debt-api"
import type { DebtReportRow } from "../types"

function ymdLocal(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export default function DebtReportPage() {
  const today = useMemo(() => new Date(), [])
  const [fromDate, setFromDate] = useState(() =>
    ymdLocal(new Date(today.getFullYear(), today.getMonth(), 1)),
  )
  const [toDate, setToDate] = useState(() => ymdLocal(today))
  const [rows, setRows] = useState<DebtReportRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await debtReport({
        fromDate: fromDate.trim() || undefined,
        toDate: toDate.trim() || undefined,
      })
      setRows(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được sao kê")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-2 h-11 gap-2 px-2 text-base">
            <Link href="/log-work/debt">
              <ArrowLeft className="h-4 w-4" />
              Trang chủ nợ
            </Link>
          </Button>
          <PageHeader
            title="Lịch sử nợ&nbsp;"
            description="Hiển thị snapshot từng giao dịch và trạng thái thanh toán tại thời điểm ghi nợ."
            icon={<FileText className="h-5 w-5 text-neutral-700" />}
          />
        </div>

        <Card className="p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="from" className="text-base">
                  Từ ngày
                </Label>
                <Input
                  id="from"
                  type="date"
                  className="mt-2 h-12 text-base"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="to" className="text-base">
                  Đến ngày
                </Label>
                <Input
                  id="to"
                  type="date"
                  className="mt-2 h-12 text-base"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
            <Button type="button" className="h-12 text-base" disabled={loading} onClick={() => void load()}>
              {loading ? "Đang tải…" : "Lọc"}
            </Button>
          </div>

          {error ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}
        </Card>

        <Card className="mt-8 overflow-hidden shadow-sm">
          <div className="overflow-auto">
            <table className="w-full min-w-[1080px] border-separate border-spacing-0">
              <thead className="sticky top-0 bg-white">
                <tr className="text-left text-sm text-neutral-600">
                  <th className="border-b border-neutral-200 px-4 py-3">Ngày nợ</th>
                  <th className="border-b border-neutral-200 px-4 py-3">Tên khách hàng</th>
                  <th className="border-b border-neutral-200 px-4 py-3">Sản phẩm</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-right">Số lượng</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-right">Giá</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-right">Thành tiền</th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-right">
                    Đã thanh toán trước đó
                  </th>
                  <th className="border-b border-neutral-200 px-4 py-3 text-right">Tổng tiền còn nợ</th>
                </tr>
              </thead>
              <tbody className="text-sm text-neutral-800">
                {rows.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-neutral-600">
                      Không có dữ liệu.
                    </td>
                  </tr>
                ) : null}

                {rows.map((tx) => {
                  const items = tx.items?.length ? tx.items : []
                  const paid = formatVnd(tx.paidAmountAtThatTime)
                  const remaining = formatVnd(tx.remainingDebt)

                  return (
                    <Fragment key={tx.transactionId}>
                      {items.map((it, idx) => {
                        const isFirst = idx === 0
                        const border = isFirst ? "border-t-2 border-neutral-200" : "border-t border-neutral-100"

                        return (
                          <tr key={it.id} className="bg-white">
                            <td className={`${border} px-4 py-3 align-top text-neutral-900`}>
                              {isFirst ? tx.transactionDate : ""}
                            </td>
                            <td className={`${border} px-4 py-3 align-top`}>{isFirst ? tx.customerName : ""}</td>
                            <td className={`${border} px-4 py-3 align-top`}>{it.productNameSnapshot}</td>
                            <td className={`${border} px-4 py-3 align-top text-right tabular-nums`}>{it.quantity}</td>
                            <td className={`${border} px-4 py-3 align-top text-right tabular-nums`}>
                              {formatVnd(it.priceSnapshot)} đ
                            </td>
                            <td className={`${border} px-4 py-3 align-top text-right tabular-nums`}>
                              {formatVnd(it.subtotal)} đ
                            </td>
                            <td className={`${border} px-4 py-3 align-top text-right tabular-nums font-medium text-emerald-800`}>
                              {isFirst ? `${paid} đ` : ""}
                            </td>
                            <td className={`${border} px-4 py-3 align-top text-right tabular-nums font-semibold text-neutral-900`}>
                              {isFirst ? `${remaining} đ` : ""}
                            </td>
                          </tr>
                        )
                      })}

                      {items.length === 0 ? (
                        <tr className="bg-white">
                          <td className="border-t-2 border-neutral-200 px-4 py-3 align-top text-neutral-900">
                            {tx.transactionDate}
                          </td>
                          <td className="border-t-2 border-neutral-200 px-4 py-3 align-top">{tx.customerName}</td>
                          <td className="border-t-2 border-neutral-200 px-4 py-3 align-top text-neutral-600" colSpan={4}>
                            (Không có sản phẩm)
                          </td>
                          <td className="border-t-2 border-neutral-200 px-4 py-3 align-top text-right tabular-nums font-medium text-emerald-800">
                            {paid} đ
                          </td>
                          <td className="border-t-2 border-neutral-200 px-4 py-3 align-top text-right tabular-nums font-semibold text-neutral-900">
                            {remaining} đ
                          </td>
                        </tr>
                      ) : null}

                      <tr>
                        <td colSpan={8} className="h-2 bg-neutral-50" />
                      </tr>
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}


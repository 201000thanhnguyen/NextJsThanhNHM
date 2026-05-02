"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { ArrowLeft, Package } from "lucide-react"

import { PageHeader } from "@/app/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  createProduct,
  deactivateProduct,
  formatVnd,
  listProducts,
  moneyNum,
  updateProduct,
} from "../debt-api"
import type { DebtProduct } from "../types"

export default function DebtProductsPage() {
  const [products, setProducts] = useState<DebtProduct[]>([])
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [saving, setSaving] = useState(false)

  const [edit, setEdit] = useState<DebtProduct | null>(null)
  const [editName, setEditName] = useState("")
  const [editPrice, setEditPrice] = useState(0)

  const load = async () => {
    try {
      setLoading(true)
      const data = await listProducts()
      setProducts(data)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không tải được")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return products
    return products.filter((p) => p.name.toLowerCase().includes(s))
  }, [products, q])

  const create = async () => {
    if (!name.trim()) {
      toast.error("Nhập tên")
      return
    }
    try {
      setSaving(true)
      await createProduct({ name: name.trim(), defaultPrice: Math.max(0, price) })
      toast.success("Đã tạo")
      setOpen(false)
      setName("")
      setPrice(0)
      await load()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lỗi")
    } finally {
      setSaving(false)
    }
  }

  const saveEdit = async () => {
    if (!edit) return
    try {
      setSaving(true)
      await updateProduct(edit.id, {
        name: editName.trim(),
        defaultPrice: Math.max(0, editPrice),
      })
      toast.success("Đã cập nhật")
      setEdit(null)
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
          title="Sản phẩm"
          description="Chỉ dùng để gợi ý khi ghi nợ — giá thực tế luôn nhập tay tại giao dịch."
          icon={<Package className="h-5 w-5 text-neutral-700" />}
        />

        <Card className="mt-6 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <Label htmlFor="prod-q" className="text-base">
                Tìm trong danh sách
              </Label>
              <Input
                id="prod-q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="mt-2 h-14 text-lg"
                placeholder="Lọc theo tên…"
              />
            </div>
            <Button type="button" className="h-14 shrink-0 text-lg" onClick={() => setOpen(true)}>
              + Tạo sản phẩm
            </Button>
          </div>

          <ul className="mt-6 divide-y divide-neutral-200 rounded-xl border border-neutral-200">
            {loading ? (
              <li className="p-6 text-center">Đang tải…</li>
            ) : (
              filtered.map((p) => (
                <li key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-semibold text-neutral-900">{p.name}</span>
                      {!p.isActive ? <Badge variant="muted">Đã ẩn</Badge> : null}
                    </div>
                    <div className="text-sm text-neutral-600">
                      Giá mặc định:{" "}
                      <span className="font-semibold tabular-nums">{formatVnd(p.defaultPrice)} đ</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 text-base"
                      onClick={() => {
                        setEdit(p)
                        setEditName(p.name)
                        setEditPrice(moneyNum(p.defaultPrice))
                      }}
                    >
                      Sửa
                    </Button>
                    {p.isActive ? (
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-11 text-base"
                        onClick={async () => {
                          try {
                            await deactivateProduct(p.id)
                            toast.success("Đã ẩn")
                            await load()
                          } catch (e) {
                            toast.error(e instanceof Error ? e.message : "Lỗi")
                          }
                        }}
                      >
                        Ẩn
                      </Button>
                    ) : null}
                  </div>
                </li>
              ))
            )}
            {!loading && filtered.length === 0 ? (
              <li className="p-6 text-center text-neutral-600">Chưa có sản phẩm.</li>
            ) : null}
          </ul>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">Tạo sản phẩm</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <Label className="text-base">Tên *</Label>
                <Input className="mt-2 h-12 text-lg" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label className="text-base">Giá mặc định</Label>
                <Input
                  type="number"
                  min={0}
                  step="any"
                  className="mt-2 h-12 text-lg tabular-nums"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
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

        <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-xl">Sửa sản phẩm</DialogTitle>
            </DialogHeader>
            <div className="grid gap-3">
              <div>
                <Label className="text-base">Tên</Label>
                <Input className="mt-2 h-12 text-lg" value={editName} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div>
                <Label className="text-base">Giá mặc định</Label>
                <Input
                  type="number"
                  min={0}
                  step="any"
                  className="mt-2 h-12 text-lg tabular-nums"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" className="h-11 text-base" onClick={() => setEdit(null)}>
                Huỷ
              </Button>
              <Button type="button" className="h-11 text-base" disabled={saving} onClick={() => void saveEdit()}>
                {saving ? "Đang lưu…" : "Lưu"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

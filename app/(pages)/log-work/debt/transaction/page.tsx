"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { ArrowLeft, ReceiptText } from "lucide-react"

import { PageHeader } from "@/app/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { CustomerSearchInput, todayYmdLocal } from "../components/CustomerSearchInput"
import {
  autocompleteProducts,
  createCustomer,
  createDebtTransaction,
  createProduct,
  formatVnd,
  getCustomer,
  moneyNum,
  updateProduct,
} from "../debt-api"
import type { DebtProduct } from "../types"

const LAST_PRICE_KEY = "logwork-debt:lastPrice:"

type Cust = { id: string; name: string } | null

type Line = {
  key: string
  productId?: string
  productName: string
  search: string
  price: number
  quantity: number
  defaultPrice?: number
  showSuggestions: boolean
  isNewProduct?: boolean
  priceMode?: "custom" | "update"
}

function newLine(): Line {
  return {
    key: crypto.randomUUID(),
    productName: "",
    search: "",
    price: 0,
    quantity: 1,
    showSuggestions: false,
    priceMode: "custom",
  }
}

function parseMoneyLoose(v: string | number): number {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0
  const raw = String(v)
  const cleaned = raw.replace(/[^\d.-]/g, "")
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

function smoothScrollTo(targetY: number, duration = 500) {
  const startY = window.scrollY
  const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  const clampedTargetY = Math.min(Math.max(0, targetY), maxY)
  const distance = clampedTargetY - startY
  let startTime: number | null = null
  let rafId = 0

  function easeInQuad(t: number) {
    return t * t
  }

  function animation(currentTime: number) {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)
    const ease = easeInQuad(progress)

    window.scrollTo(0, startY + distance * ease)

    if (timeElapsed < duration) {
      rafId = window.requestAnimationFrame(animation)
    }
  }

  rafId = window.requestAnimationFrame(animation)

  return () => {
    if (rafId) window.cancelAnimationFrame(rafId)
  }
}

function readLastPrice(productId: string): number | null {
  try {
    const raw = localStorage.getItem(LAST_PRICE_KEY + productId)
    if (!raw) return null
    const n = Number(raw)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

function writeLastPrice(productId: string, price: number) {
  try {
    localStorage.setItem(LAST_PRICE_KEY + productId, String(price))
  } catch {
    /* ignore */
  }
}

function DebtTransactionPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const customerIdParam = searchParams.get("customerId")

  const [customer, setCustomer] = useState<Cust>(null)
  const [transactionDate, setTransactionDate] = useState(todayYmdLocal)
  const [note, setNote] = useState("")
  // NOTE: Client components are still pre-rendered on server; avoid random IDs in initial HTML.
  const [lines, setLines] = useState<Line[]>(() => [{ ...newLine(), key: "line-0" }])
  const [saving, setSaving] = useState(false)

  const [debouncedSearch, setDebouncedSearch] = useState<Record<string, string>>({})
  const [suggestionsByLine, setSuggestionsByLine] = useState<Record<string, DebtProduct[]>>({})
  const [activeSugIndexByLine, setActiveSugIndexByLine] = useState<Record<string, number>>({})
  const firstProductRef = useRef<HTMLInputElement>(null)
  const customerInputRef = useRef<HTMLInputElement>(null)
  const [focusCustomerAfterSave, setFocusCustomerAfterSave] = useState(false)
  const pendingProductFocusKeyRef = useRef<string | null>(null)

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

  useEffect(() => {
    const timers: number[] = []
    for (const line of lines) {
      const id = window.setTimeout(() => {
        setDebouncedSearch((prev) => ({ ...prev, [line.key]: line.search }))
      }, 300)
      timers.push(id)
    }
    return () => {
      for (const id of timers) window.clearTimeout(id)
    }
  }, [lines])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const entries = await Promise.all(
        lines.map(async (line) => {
          const q = debouncedSearch[line.key] ?? ""
          try {
            const res = await autocompleteProducts(q || undefined, 10)
            const merged = res.merged.length ? res.merged : res.results
            return [line.key, (merged ?? []).slice(0, 10)] as const
          } catch {
            return [line.key, [] as DebtProduct[]] as const
          }
        }),
      )
      if (cancelled) return
      const next: Record<string, DebtProduct[]> = {}
      for (const [k, v] of entries) next[k] = v
      setSuggestionsByLine(next)
    })()
    return () => {
      cancelled = true
    }
  }, [lines, debouncedSearch])

  useEffect(() => {
    if (!focusCustomerAfterSave) return

    const el = customerInputRef.current
    if (!el) {
      setFocusCustomerAfterSave(false)
      return
    }

    const rect = el.getBoundingClientRect()
    const targetY = rect.top + window.scrollY - window.innerHeight / 2

    const cancelScroll = smoothScrollTo(targetY, 600)

    const t = window.setTimeout(() => {
      customerInputRef.current?.focus()
      customerInputRef.current?.select()
      setFocusCustomerAfterSave(false)
    }, 650)

    return () => {
      cancelScroll()
      window.clearTimeout(t)
    }
  }, [focusCustomerAfterSave])

  useEffect(() => {
    const key = pendingProductFocusKeyRef.current
    if (!key) return
    const id = window.setTimeout(() => {
      const el = document.querySelector<HTMLInputElement>(`[data-product-input-key="${key}"]`)
      el?.focus()
      el?.select()
      pendingProductFocusKeyRef.current = null
    }, 0)
    return () => window.clearTimeout(id)
  }, [lines.length])

  const addLine = useCallback(() => {
    const nl = newLine()
    pendingProductFocusKeyRef.current = nl.key
    setLines((prev) => [...prev, nl])
  }, [])

  const applyProduct = (lineKey: string, p: DebtProduct) => {
    const def = parseMoneyLoose(p.defaultPrice)
    const last = readLastPrice(p.id)
    const price = last ?? def
    setLines((prev) =>
      prev.map((l) =>
        l.key === lineKey
          ? {
              ...l,
              productId: p.id,
              productName: p.name,
              search: p.name,
              defaultPrice: def,
              price,
              showSuggestions: false,
              isNewProduct: false,
              priceMode: "custom",
            }
          : l,
      ),
    )
    setActiveSugIndexByLine((prev) => ({ ...prev, [lineKey]: -1 }))
  }

  const markNewProduct = (lineKey: string, name: string) => {
    const n = name.trim()
    if (!n) return
    setLines((prev) =>
      prev.map((l) =>
        l.key === lineKey
          ? {
              ...l,
              productId: undefined,
              productName: n,
              search: n,
              defaultPrice: undefined,
              showSuggestions: false,
              isNewProduct: true,
              priceMode: "update",
            }
          : l,
      ),
    )
    setActiveSugIndexByLine((prev) => ({ ...prev, [lineKey]: -1 }))
  }

  const resetPriceToDefault = (lineKey: string) => {
    setLines((prev) =>
      prev.map((l) =>
        l.key === lineKey && l.defaultPrice !== undefined ? { ...l, price: l.defaultPrice } : l,
      ),
    )
  }

  const totalPreview = useMemo(() => {
    return lines.reduce((acc, l) => acc + Math.max(0, l.price) * Math.max(1, l.quantity), 0)
  }, [lines])

  const submit = async () => {
    if (!customer) {
      toast.error("Chọn khách hàng từ danh sách gợi ý")
      return
    }

    // If user selected "create new customer", create it only on submit.
    let customerIdToUse = customer.id
    if (!customerIdToUse) {
      const name = (customer as { name?: string }).name?.trim() || ""
      if (!name) {
        toast.error("Nhập tên khách hàng")
        return
      }
      try {
        const created = await createCustomer({ name })
        customerIdToUse = created.id
        setCustomer({ id: created.id, name: created.name })
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Không tạo được khách hàng")
        return
      }
    }

    // Create-on-the-fly for any typed product that wasn't selected.
    const missingNames = Array.from(
      new Set(
        lines
          .filter((l) => !l.productId && l.productName.trim().length > 0)
          .map((l) => l.productName.trim()),
      ),
    )
    const createdByName = new Map<string, DebtProduct>()
    if (missingNames.length) {
      const priceByName = new Map<string, number>()
      for (const l of lines) {
        const n = l.productName.trim()
        if (!n || l.productId) continue
        if (!priceByName.has(n)) priceByName.set(n, Math.max(0, l.price))
      }
      const created = await Promise.allSettled(
        missingNames.map(async (name) => {
          const defaultPrice = priceByName.get(name) ?? 0
          const p = await createProduct({ name, defaultPrice })
          return { name, p }
        }),
      )
      for (const r of created) {
        if (r.status === "fulfilled") createdByName.set(r.value.name, r.value.p)
      }
    }

    // If user chose "Cập nhật giá này", persist defaultPrice before saving transaction.
    const toUpdate = lines
      .filter((l) => l.productId && l.priceMode === "update")
      .map((l) => ({ id: l.productId as string, defaultPrice: Math.max(0, l.price) }))
    if (toUpdate.length) {
      const results = await Promise.allSettled(
        toUpdate.map((u) => updateProduct(u.id, { defaultPrice: u.defaultPrice })),
      )
      const failed = results.filter((r) => r.status === "rejected").length
      if (failed) {
        toast.error("Có sản phẩm chưa cập nhật được giá, nhưng giao dịch vẫn sẽ được lưu theo giá bạn nhập.")
      }
    }

    const items = lines
      .filter((l) => l.productName.trim().length > 0)
      .map((l) => {
        const name = l.productName.trim()
        const created = !l.productId ? createdByName.get(name) : undefined
        const productId = l.productId ?? created?.id
        const originalDefault =
          productId && l.defaultPrice !== undefined ? l.defaultPrice : created ? Math.max(0, l.price) : undefined
        return {
          productId,
          productNameSnapshot: name,
          priceSnapshot: Math.max(0, l.price),
          originalProductPrice: originalDefault,
          quantity: Math.max(1, Math.floor(l.quantity)),
        }
      })
    if (items.length === 0) {
      toast.error("Thêm ít nhất một dòng sản phẩm")
      return
    }
    try {
      setSaving(true)
      await createDebtTransaction({
        customerId: customerIdToUse,
        transactionDate: transactionDate.trim() || undefined,
        note: note.trim() || undefined,
        items,
      })
      for (const l of lines) {
        if (l.productId) writeLastPrice(l.productId, l.price)
      }
      toast.success("Đã lưu giao dịch thành công")
      setNote("")
      setLines([newLine()])
      setFocusCustomerAfterSave(true)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không lưu được")
    } finally {
      setSaving(false)
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
            title="Ghi nợ"
            description="Dữ liệu lưu theo snapshot tại thời điểm ghi — giá do bạn nhập, không tự đồng bộ từ sản phẩm."
            icon={<ReceiptText className="h-5 w-5 text-neutral-700" />}
          />
        </div>

        <form
          className="flex flex-col gap-8"
          onSubmit={(e) => {
            e.preventDefault()
            void submit()
          }}
        >
          <Card className="p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Khách hàng</h2>
            <p className="mt-1 text-sm text-neutral-600">Gõ để tìm (tối đa 10 kết quả).</p>
            <div className="mt-4">
              <Label htmlFor="cust-search" className="sr-only">
                Khách hàng
              </Label>
              <CustomerSearchInput
                id="cust-search"
                ref={customerInputRef}
                value={customer}
                onChange={setCustomer}
                autoFocus={!customerIdParam?.trim()}
              />
            </div>
          </Card>

          <Card className="p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-semibold text-neutral-900">Ngày phát sinh</h2>
            <div className="mt-4 max-w-xs">
              <Label htmlFor="tx-date" className="text-base">
                Ngày giao dịch
              </Label>
              <Input
                id="tx-date"
                type="date"
                className="mt-2 h-14 text-lg"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
              />
            </div>
          </Card>

          <Card className="p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">Danh sách sản phẩm</h2>
              <div className="text-lg font-semibold tabular-nums text-neutral-900">
                Tổng: {formatVnd(totalPreview)} đ
              </div>
            </div>
            <p className="mt-1 text-sm text-neutral-600">
              Tab để chuyển ô — Enter ở ô số lượng để thêm dòng mới.
            </p>

            <div className="mt-6 space-y-6">
              {lines.map((line, idx) => {
                const sug = suggestionsByLine[line.key] ?? []
                const trimmed = line.search.trim()
                const options = [
                  ...sug.map((p) => ({ kind: "hit" as const, p })),
                  ...(trimmed ? [{ kind: "create" as const, name: trimmed }] : []),
                ]
                const activeIdx = activeSugIndexByLine[line.key] ?? -1
                const priceDiffers =
                  line.defaultPrice !== undefined &&
                  Math.abs(line.price - line.defaultPrice) > 0.009
                const priceMode = line.priceMode ?? "custom"

                return (
                  <div
                    key={line.key}
                    className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 sm:p-5"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-medium text-neutral-800">Dòng {idx + 1}</span>
                      {lines.length > 1 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-11 text-base text-red-700"
                          onClick={() => setLines((prev) => prev.filter((l) => l.key !== line.key))}
                        >
                          Xoá
                        </Button>
                      ) : null}
                    </div>
                    <div className="grid gap-4 md:grid-cols-12">
                      <div className="relative md:col-span-5">
                        <Label className="text-base">Sản phẩm</Label>
                        <Input
                          ref={idx === 0 ? firstProductRef : undefined}
                          data-product-input-key={line.key}
                          className="mt-2 h-14 text-lg"
                          value={line.search}
                          onChange={(e) =>
                            setLines((prev) =>
                              prev.map((l) =>
                                l.key === line.key
                                  ? {
                                      ...l,
                                      search: e.target.value,
                                      productName: e.target.value,
                                      showSuggestions: true,
                                      isNewProduct: undefined,
                                    }
                                  : l,
                              ),
                            )
                          }
                          onFocus={(e) => {
                            e.currentTarget.select()
                            setLines((prev) =>
                              prev.map((l) =>
                                l.key === line.key ? { ...l, showSuggestions: true } : l,
                              ),
                            )
                          }}
                          onKeyDown={(e) => {
                            if (!line.showSuggestions) {
                              if (e.key === "Enter" && trimmed) {
                                e.preventDefault()
                                markNewProduct(line.key, trimmed)
                              }
                              return
                            }

                            if (e.key === "ArrowDown") {
                              e.preventDefault()
                              setActiveSugIndexByLine((prev) => ({
                                ...prev,
                                [line.key]: Math.min(options.length - 1, (prev[line.key] ?? -1) + 1),
                              }))
                            } else if (e.key === "ArrowUp") {
                              e.preventDefault()
                              setActiveSugIndexByLine((prev) => ({
                                ...prev,
                                [line.key]: Math.max(-1, (prev[line.key] ?? -1) - 1),
                              }))
                            } else if (e.key === "Escape") {
                              e.preventDefault()
                              setLines((prev) =>
                                prev.map((l) =>
                                  l.key === line.key ? { ...l, showSuggestions: false } : l,
                                ),
                              )
                              setActiveSugIndexByLine((prev) => ({ ...prev, [line.key]: -1 }))
                            } else if (e.key === "Enter") {
                              if (!trimmed) return
                              e.preventDefault()
                              const idx = activeIdx >= 0 ? activeIdx : options.length - 1
                              const opt = options[idx]
                              if (!opt) return
                              if (opt.kind === "hit") applyProduct(line.key, opt.p)
                              else markNewProduct(line.key, opt.name)
                            }
                          }}
                          onBlur={() => {
                            window.setTimeout(() => {
                              setLines((prev) =>
                                prev.map((l) =>
                                  l.key === line.key ? { ...l, showSuggestions: false } : l,
                                ),
                              )
                            }, 200)
                          }}
                          autoComplete="off"
                          placeholder="Gõ tên sản phẩm…"
                        />
                        {line.showSuggestions && options.length > 0 ? (
                          <div className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
                            {options.map((opt, i) => {
                              if (opt.kind === "hit") {
                                const p = opt.p
                                return (
                                  <button
                                    key={p.id}
                                    type="button"
                                    className={cn(
                                      "flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-base",
                                      "hover:bg-neutral-50",
                                      i === activeIdx && "bg-neutral-50",
                                    )}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onMouseMove={() =>
                                      setActiveSugIndexByLine((prev) => ({ ...prev, [line.key]: i }))
                                    }
                                    onClick={() => applyProduct(line.key, p)}
                                  >
                                    <span className="font-medium">{p.name}</span>
                                    <span className="text-sm text-neutral-600">
                                      {formatVnd(p.defaultPrice)} đ
                                    </span>
                                  </button>
                                )
                              }

                              return (
                                <button
                                  key={`create:${line.key}:${opt.name}`}
                                  type="button"
                                  className={cn(
                                    "flex w-full items-center gap-2 px-4 py-3 text-left text-base",
                                    "text-emerald-800 hover:bg-emerald-50",
                                    i === activeIdx && "bg-emerald-50",
                                  )}
                                  onMouseDown={(e) => e.preventDefault()}
                                  onMouseMove={() =>
                                    setActiveSugIndexByLine((prev) => ({ ...prev, [line.key]: i }))
                                  }
                                  onClick={() => markNewProduct(line.key, opt.name)}
                                >
                                  <span className="font-semibold">➕ Tạo sản phẩm mới:</span>
                                  <span className="truncate text-neutral-900">{opt.name}</span>
                                </button>
                              )
                            })}
                          </div>
                        ) : null}
                      </div>
                      <div className="md:col-span-3">
                        <Label className="text-base">Đơn giá</Label>
                        <Input
                          type="number"
                          min={0}
                          step="any"
                          className={cn(
                            "mt-2 h-14 text-lg tabular-nums",
                            priceDiffers && "ring-2 ring-amber-400",
                          )}
                          value={Number.isFinite(line.price) ? line.price : 0}
                          onFocus={(e) => e.currentTarget.select()}
                          onChange={(e) =>
                            setLines((prev) =>
                              prev.map((l) =>
                                l.key === line.key ? { ...l, price: Number(e.target.value) } : l,
                              ),
                            )
                          }
                        />
                        <div className="mt-2 flex flex-col gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2">
                          <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-800">
                            <input
                              type="radio"
                              name={`price-mode:${line.key}`}
                              checked={priceMode === "custom"}
                              onChange={() =>
                                setLines((prev) =>
                                  prev.map((l) =>
                                    l.key === line.key ? { ...l, priceMode: "custom" } : l,
                                  ),
                                )
                              }
                            />
                            Giá tự chọn
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-800">
                            <input
                              type="radio"
                              name={`price-mode:${line.key}`}
                              checked={priceMode === "update"}
                              disabled={!line.productId && !line.isNewProduct}
                              onChange={() =>
                                setLines((prev) =>
                                  prev.map((l) =>
                                    l.key === line.key ? { ...l, priceMode: "update" } : l,
                                  ),
                                )
                              }
                            />
                            Cập nhật giá này
                          </label>
                        </div>
                        {line.defaultPrice !== undefined ? (
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-2 h-11 w-full text-sm"
                            onClick={() => resetPriceToDefault(line.key)}
                          >
                            Reset giá mặc định
                          </Button>
                        ) : null}
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-base">Số lượng</Label>
                        <Input
                          type="number"
                          min={1}
                          step={1}
                          className="mt-2 h-14 text-lg tabular-nums"
                          value={line.quantity}
                          onFocus={(e) => e.currentTarget.select()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addLine()
                            }
                          }}
                          onChange={(e) =>
                            setLines((prev) =>
                              prev.map((l) =>
                                l.key === line.key
                                  ? { ...l, quantity: Math.max(1, Number(e.target.value) || 1) }
                                  : l,
                              ),
                            )
                          }
                        />
                      </div>
                      <div className="md:col-span-2 flex items-end">
                        <div className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-3 text-center">
                          <div className="text-xs text-neutral-500">Thành tiền</div>
                          <div className="text-lg font-semibold tabular-nums">
                            {formatVnd(Math.max(0, line.price) * Math.max(1, line.quantity))} đ
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="secondary" className="h-14 flex-1 text-lg" onClick={addLine}>
                + Thêm dòng
              </Button>
              <Button type="submit" disabled={saving} className="h-14 flex-1 text-lg">
                {saving ? "Đang lưu…" : "Lưu giao dịch"}
              </Button>
            </div>
          </Card>

          <Card className="p-5 shadow-sm sm:p-6">
            <Label htmlFor="tx-note" className="text-base">
              Ghi chú giao dịch
            </Label>
            <Textarea
              id="tx-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="mt-2 min-h-[5rem] text-lg"
              placeholder="Tuỳ chọn"
            />
          </Card>
        </form>
      </div>
    </div>
  )
}

export default function DebtTransactionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-neutral-50 to-white px-4 py-20 text-neutral-600">
          Đang tải…
        </div>
      }
    >
      <DebtTransactionPageInner />
    </Suspense>
  )
}

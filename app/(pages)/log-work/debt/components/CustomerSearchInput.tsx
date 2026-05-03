"use client"

import { forwardRef, useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

import { searchCustomers } from "../debt-api"
import type { DebtCustomer } from "../types"

export function todayYmdLocal(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export type CustomerInputValue =
  | { id: string; name: string; isNew?: false }
  | { name: string; isNew: true }
  | null

export const CustomerSearchInput = forwardRef<
  HTMLInputElement,
  {
    value: CustomerInputValue
    onChange: (v: CustomerInputValue) => void
    disabled?: boolean
    autoFocus?: boolean
    id?: string
  }
>(function CustomerSearchInput({ value, onChange, disabled, autoFocus, id }, ref) {
  const [text, setText] = useState(() => (value ? value.name : ""))
  const [debounced, setDebounced] = useState("")
  const [hits, setHits] = useState<DebtCustomer[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) setText(value.name)
  }, [value])

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(text.trim()), 300)
    return () => window.clearTimeout(t)
  }, [text])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!debounced) {
        setHits([])
        setActiveIndex(-1)
        return
      }
      setLoading(true)
      try {
        const rows = await searchCustomers(debounced)
        if (!cancelled) setHits((rows ?? []).slice(0, 10))
      } catch {
        if (!cancelled) setHits([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [debounced])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [])

  const pick = (c: DebtCustomer) => {
    onChange({ id: c.id, name: c.name, isNew: false })
    setText(c.name)
    setOpen(false)
    setActiveIndex(-1)
  }

  const trimmed = text.trim()

  const options = useMemo(() => {
    const base = hits.map((c) => ({ kind: "hit" as const, c }))
    if (!trimmed) return base
    return [...base, { kind: "create" as const, name: trimmed }]
  }, [hits, trimmed])

  const pickNew = (name: string) => {
    const n = name.trim()
    if (!n) return
    onChange({ name: n, isNew: true })
    setText(n)
    setOpen(false)
    setActiveIndex(-1)
  }

  return (
    <div ref={rootRef} className="relative">
      <input
        ref={ref}
        id={id}
        type="text"
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete="off"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          onChange(null)
          setOpen(true)
          setActiveIndex(-1)
        }}
        onFocus={(e) => {
          e.currentTarget.select()
          setOpen(true)
          setActiveIndex(-1)
        }}
        onKeyDown={(e) => {
          if (!open) {
            if (e.key === "Enter" && !value && trimmed) {
              e.preventDefault()
              pickNew(trimmed)
            }
            return
          }

          if (e.key === "ArrowDown") {
            e.preventDefault()
            setActiveIndex((i) => Math.min(options.length - 1, i + 1))
          } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setActiveIndex((i) => Math.max(-1, i - 1))
          } else if (e.key === "Escape") {
            e.preventDefault()
            setOpen(false)
            setActiveIndex(-1)
          } else if (e.key === "Enter") {
            if (!trimmed) return
            e.preventDefault()
            const idx = activeIndex >= 0 ? activeIndex : options.length - 1
            const opt = options[idx]
            if (!opt) return
            if (opt.kind === "hit") pick(opt.c)
            else pickNew(opt.name)
          }
        }}
        placeholder="Gõ tên hoặc SĐT khách hàng…"
        className={cn(
          "h-14 w-full rounded-lg border border-neutral-200 bg-white px-4 text-lg text-neutral-900 shadow-sm",
          "placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900",
        )}
      />
      {loading ? (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">…</div>
      ) : null}
      {open && options.length > 0 ? (
        <ul
          className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {options.map((opt, idx) => {
            if (opt.kind === "hit") {
              const c = opt.c
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left text-base",
                      "hover:bg-neutral-50",
                      idx === activeIndex && "bg-neutral-50",
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseMove={() => setActiveIndex(idx)}
                    onClick={() => pick(c)}
                  >
                    <span className="font-semibold text-neutral-900">{c.name}</span>
                    {c.phone ? <span className="text-sm text-neutral-600">{c.phone}</span> : null}
                  </button>
                </li>
              )
            }

            return (
              <li key={`create:${opt.name}`}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 px-4 py-3 text-left text-base",
                    "text-emerald-800 hover:bg-emerald-50",
                    idx === activeIndex && "bg-emerald-50",
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseMove={() => setActiveIndex(idx)}
                  onClick={() => pickNew(opt.name)}
                >
                  <span className="font-semibold">➕ Tạo khách hàng mới:</span>
                  <span className="truncate text-neutral-900">{opt.name}</span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
      {value ? (
        <p className="mt-2 text-sm text-emerald-800">Đã chọn: {value.name}</p>
      ) : (
        <p className="mt-2 text-sm text-neutral-500">Chọn một khách từ gợi ý (tối đa 10 kết quả).</p>
      )}
    </div>
  )
})

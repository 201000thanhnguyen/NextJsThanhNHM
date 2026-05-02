"use client"

import { useEffect, useRef, useState } from "react"

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

type Value = { id: string; name: string } | null

export function CustomerSearchInput({
  value,
  onChange,
  disabled,
  autoFocus,
  id,
}: {
  value: Value
  onChange: (v: Value) => void
  disabled?: boolean
  autoFocus?: boolean
  id?: string
}) {
  const [text, setText] = useState(() => (value ? value.name : ""))
  const [debounced, setDebounced] = useState("")
  const [hits, setHits] = useState<DebtCustomer[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
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
        return
      }
      setLoading(true)
      try {
        const rows = await searchCustomers(debounced)
        if (!cancelled) setHits(rows)
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
    onChange({ id: c.id, name: c.name })
    setText(c.name)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <input
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
        }}
        onFocus={() => setOpen(true)}
        placeholder="Gõ tên hoặc SĐT khách hàng…"
        className={cn(
          "h-14 w-full rounded-lg border border-neutral-200 bg-white px-4 text-lg text-neutral-900 shadow-sm",
          "placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900",
        )}
      />
      {loading ? (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">…</div>
      ) : null}
      {open && hits.length > 0 ? (
        <ul
          className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {hits.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className="flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left text-base hover:bg-neutral-50"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(c)}
              >
                <span className="font-semibold text-neutral-900">{c.name}</span>
                {c.phone ? <span className="text-sm text-neutral-600">{c.phone}</span> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {value ? (
        <p className="mt-2 text-sm text-emerald-800">Đã chọn: {value.name}</p>
      ) : (
        <p className="mt-2 text-sm text-neutral-500">Chọn một khách từ gợi ý (tối đa 10 kết quả).</p>
      )}
    </div>
  )
}

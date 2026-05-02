import { apiUrl } from "@/app/lib/api"

import type {
  CustomerDebtRow,
  DebtCustomer,
  DebtPaymentDetail,
  DebtPaymentListRow,
  DebtProduct,
  DebtTransactionDetail,
  TimelineEntry,
} from "./types"

const BASE = apiUrl("/api/debt")

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text()
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(text || res.statusText)
  }
}

export function moneyNum(s: string | number): number {
  if (typeof s === "number") return s
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

export function formatVnd(n: number | string): string {
  const v = moneyNum(n)
  return v.toLocaleString("vi-VN", { maximumFractionDigits: 0 })
}

async function debtFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    let msg = res.statusText
    try {
      const j = (await res.json()) as { message?: string | string[] }
      if (typeof j.message === "string") msg = j.message
      else if (Array.isArray(j.message)) msg = j.message.join(", ")
    } catch {
      /* ignore */
    }
    throw new Error(msg)
  }
  return res
}

export async function getCustomer(id: string): Promise<DebtCustomer> {
  const res = await debtFetch(`/customers/${id}`)
  const body = await parseJson<{ data: DebtCustomer }>(res)
  return body.data
}

/** Full list (server-capped) when no keyword. */
export async function listCustomers(): Promise<DebtCustomer[]> {
  const res = await debtFetch(`/customers`)
  const body = await parseJson<{ data: DebtCustomer[] }>(res)
  return body.data ?? []
}

/** Autocomplete: max 10, LIKE on name/phone. */
export async function searchCustomers(search: string): Promise<DebtCustomer[]> {
  const s = search.trim()
  if (!s) return []
  const qs = `?search=${encodeURIComponent(s)}`
  const res = await debtFetch(`/customers${qs}`)
  const body = await parseJson<{ data: DebtCustomer[] }>(res)
  return body.data ?? []
}

export async function createCustomer(payload: {
  name: string
  phone?: string
  note?: string
}): Promise<DebtCustomer> {
  const res = await debtFetch(`/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const body = await parseJson<{ data: DebtCustomer }>(res)
  return body.data
}

export async function listProducts(search?: string): Promise<DebtProduct[]> {
  const qs = search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : ""
  const res = await debtFetch(`/products${qs}`)
  const body = await parseJson<{ data: DebtProduct[] }>(res)
  return body.data ?? []
}

export type AutocompleteResponse = {
  results: DebtProduct[]
  topUsed: DebtProduct[]
  merged: DebtProduct[]
}

export async function autocompleteProducts(
  search?: string,
  limit = 20,
): Promise<AutocompleteResponse> {
  const sp = new URLSearchParams()
  if (search?.trim()) sp.set("search", search.trim())
  sp.set("limit", String(limit))
  const res = await debtFetch(`/products/autocomplete?${sp.toString()}`)
  const body = await parseJson<{ data: AutocompleteResponse }>(res)
  return body.data
}

export async function createProduct(payload: {
  name: string
  defaultPrice: number
  isActive?: boolean
}): Promise<DebtProduct> {
  const res = await debtFetch(`/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const body = await parseJson<{ data: DebtProduct }>(res)
  return body.data
}

export async function updateProduct(
  id: string,
  payload: Partial<{ name: string; defaultPrice: number; isActive: boolean }>,
): Promise<DebtProduct> {
  const res = await debtFetch(`/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const body = await parseJson<{ data: DebtProduct }>(res)
  return body.data
}

export async function deactivateProduct(id: string): Promise<DebtProduct> {
  const res = await debtFetch(`/products/${id}`, { method: "DELETE" })
  const body = await parseJson<{ data: DebtProduct }>(res)
  return body.data
}

export async function createDebtTransaction(payload: {
  customerId: string
  transactionDate?: string
  note?: string
  items: Array<{
    productId?: string
    productNameSnapshot: string
    priceSnapshot: number
    originalProductPrice?: number
    quantity: number
  }>
}): Promise<DebtTransactionDetail> {
  const res = await debtFetch(`/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const body = await parseJson<{ data: DebtTransactionDetail }>(res)
  return body.data
}

export async function listTransactions(customerId?: string): Promise<DebtTransactionDetail[]> {
  const qs = customerId ? `?customerId=${encodeURIComponent(customerId)}` : ""
  const res = await debtFetch(`/transactions${qs}`)
  const body = await parseJson<{ data: DebtTransactionDetail[] }>(res)
  return body.data ?? []
}

export async function createPayment(payload: {
  customerId: string
  amount: number
  paymentDate?: string
  note?: string
}): Promise<DebtPaymentDetail> {
  const res = await debtFetch(`/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const body = await parseJson<{ data: DebtPaymentDetail }>(res)
  return body.data
}

export async function listPayments(customerId?: string): Promise<DebtPaymentListRow[]> {
  const qs = customerId ? `?customerId=${encodeURIComponent(customerId)}` : ""
  const res = await debtFetch(`/payments${qs}`)
  const body = await parseJson<{ data: DebtPaymentListRow[] }>(res)
  return body.data ?? []
}

export async function addPaymentAdjustment(
  paymentId: string,
  payload: { amountAdjustment: number; note?: string },
): Promise<DebtPaymentDetail> {
  const res = await debtFetch(`/payments/${paymentId}/adjustments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const body = await parseJson<{ data: DebtPaymentDetail }>(res)
  return body.data
}

export async function customerDebts(): Promise<CustomerDebtRow[]> {
  const res = await debtFetch(`/reports/customer-debts`)
  const body = await parseJson<{ data: CustomerDebtRow[] }>(res)
  return body.data ?? []
}

export async function customerTimeline(customerId: string): Promise<TimelineEntry[]> {
  const res = await debtFetch(`/customers/${customerId}/timeline`)
  const body = await parseJson<{ data: TimelineEntry[] }>(res)
  return body.data ?? []
}

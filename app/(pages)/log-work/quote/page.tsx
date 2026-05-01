"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, Quote as QuoteIcon } from "lucide-react"
import { toast } from "sonner"

import { apiUrl } from "@/app/lib/api"
import { PageHeader } from "@/app/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import type { Quote, QuoteCreateInput, QuoteUpdateInput } from "./types"
import { ConfirmDialog } from "./components/ConfirmDialog"
import { QuoteCard } from "./components/QuoteCard"
import { QuoteFormModal } from "./components/QuoteFormModal"

const QUOTES_API = apiUrl(`/api/quotes`)

async function fetchQuotes(): Promise<Quote[]> {
  const res = await fetch(QUOTES_API, { method: "GET", credentials: "include" })
  if (!res.ok) throw new Error("Không thể tải danh sách quote")
  const data = (await res.json()) as { data?: Quote[] }
  return data.data ?? []
}

async function createQuote(payload: QuoteCreateInput): Promise<Quote> {
  const res = await fetch(QUOTES_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Không thể tạo quote")
  const data = (await res.json()) as { data: Quote }
  return data.data
}

async function updateQuote(id: string, payload: QuoteUpdateInput): Promise<Quote> {
  const res = await fetch(`${QUOTES_API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Không thể cập nhật quote")
  const data = (await res.json()) as { data: Quote }
  return data.data
}

async function removeQuote(id: string): Promise<void> {
  const res = await fetch(`${QUOTES_API}/${id}`, { method: "DELETE", credentials: "include" })
  if (!res.ok) throw new Error("Không thể xóa quote")
}

export default function Page() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Quote | null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingQuote, setDeletingQuote] = useState<Quote | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchQuotes()
        setQuotes(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Lỗi không xác định")
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const addQuote = async (payload: QuoteCreateInput) => {
    try {
      setCreating(true)
      setError(null)
      const created = await createQuote(payload)
      setQuotes(prev => [created, ...prev])
      toast.success("Tạo quote thành công")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi không xác định")
      toast.error("Không thể tạo quote")
      throw e
    } finally {
      setCreating(false)
    }
  }

  const editQuote = async (id: string, payload: QuoteUpdateInput) => {
    try {
      setUpdating(true)
      setError(null)
      const updated = await updateQuote(id, payload)
      setQuotes(prev => prev.map(q => (q.id === id ? updated : q)))
      toast.success("Cập nhật quote thành công")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi không xác định")
      toast.error("Không thể cập nhật quote")
      throw e
    } finally {
      setUpdating(false)
    }
  }

  const deleteQuote = async (id: string) => {
    try {
      setError(null)
      setDeleting(true)
      await removeQuote(id)
      setQuotes(prev => prev.filter(q => q.id !== id))
      toast.success("Đã xóa quote")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi không xác định")
      toast.error("Không thể xóa quote")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <PageHeader
            title="Quote Management"
            description="Create, edit, and curate the quotes shown on the public Quote page."
            icon={<QuoteIcon className="h-5 w-5 text-neutral-700" />}
            breadcrumb={
              <>
                <Link href="/log-work/checkin" className="hover:text-neutral-700">
                  Log work
                </Link>{" "}
                <span className="text-neutral-400">/</span>{" "}
                <span className="text-neutral-700">Quotes</span>
              </>
            }
            action={
              <Button className="shadow-sm" onClick={() => setCreateOpen(true)}>
                <Plus />
                Create quote
              </Button>
            }
          />

          {error ? (
            <Card className="border-red-200 bg-red-50 text-red-800">
              <div className="p-4 text-sm">
                <span className="font-medium">Error:</span> {error}
              </div>
            </Card>
          ) : null}

          <div className="grid gap-3">
            {loading ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Card key={idx} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-9" />
                        <Skeleton className="h-9 w-9" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : quotes.length === 0 ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <Card className="border-neutral-200/80 bg-white">
                  <div className="p-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
                      <QuoteIcon className="h-6 w-6 text-neutral-600" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-neutral-900">
                      No quotes yet
                    </h2>
                    <p className="mx-auto mt-1 max-w-md text-sm text-neutral-600">
                      Create your first quote to display it on the public page.
                    </p>
                    <div className="mt-6 flex justify-center">
                      <Button onClick={() => setCreateOpen(true)}>
                        <Plus />
                        Create quote
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div layout className="grid gap-3 sm:grid-cols-2" transition={{ duration: 0.18 }}>
                <AnimatePresence>
                  {quotes.map(q => (
                    <QuoteCard
                      key={q.id}
                      quote={q}
                      onEdit={quote => {
                        setEditing(quote)
                        setEditOpen(true)
                      }}
                      onDelete={quote => {
                        setDeletingQuote(quote)
                        setConfirmOpen(true)
                      }}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <QuoteFormModal
        open={createOpen}
        mode="create"
        submitting={creating}
        onOpenChange={setCreateOpen}
        onSubmit={addQuote}
      />

      <QuoteFormModal
        open={editOpen}
        mode="edit"
        initial={editing}
        submitting={updating}
        onOpenChange={open => {
          setEditOpen(open)
          if (!open) setEditing(null)
        }}
        onSubmit={async payload => {
          if (!editing) return
          await editQuote(editing.id, payload)
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this quote?"
        description={
          deletingQuote
            ? `This will permanently remove "${deletingQuote.author}".`
            : "This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        loading={deleting}
        onOpenChange={open => {
          setConfirmOpen(open)
          if (!open) setDeletingQuote(null)
        }}
        onConfirm={async () => {
          if (!deletingQuote) return
          await deleteQuote(deletingQuote.id)
          setConfirmOpen(false)
          setDeletingQuote(null)
        }}
      />
    </div>
  )
}


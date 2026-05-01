"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { apiUrl } from "@/app/lib/api"
import { PageHeader } from "@/app/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import type { Shift, ShiftCreateInput, ShiftUpdateInput } from "../types"
import { ConfirmDialog } from "./components/ConfirmDialog"
import { ShiftCard } from "./components/ShiftCard"
import { ShiftFormModal } from "./components/ShiftFormModal"

const SHIFTS_API = apiUrl(`/api/shifts`)

async function fetchShifts(): Promise<Shift[]> {
  const res = await fetch(SHIFTS_API, { method: "GET" })
  if (!res.ok) {
    throw new Error("Khong the tai danh sach ca")
  }

  const data = (await res.json()) as { data?: Shift[] }
  return data.data ?? []
}

async function createShift(payload: ShiftCreateInput): Promise<Shift> {
  const res = await fetch(SHIFTS_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    throw new Error("Khong the tao ca")
  }

  const data = (await res.json()) as { data: Shift }
  return data.data
}

async function updateShift(id: string, payload: ShiftUpdateInput): Promise<Shift> {
  const res = await fetch(`${SHIFTS_API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw new Error("Khong the cap nhat ca")
  }
  const data = (await res.json()) as { data: Shift }
  return data.data
}

async function removeShift(id: string): Promise<void> {
  const res = await fetch(`${SHIFTS_API}/${id}`, { method: "DELETE" })
  if (!res.ok) {
    throw new Error("Khong the xoa ca")
  }
}

export default function Page() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<Shift | null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingShift, setDeletingShift] = useState<Shift | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchShifts()
        setShifts(data)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Loi khong xac dinh")
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  const addShift = async (payload: ShiftCreateInput) => {
    try {
      setCreating(true)
      setError(null)
      const created = await createShift(payload)
      setShifts(prev => [...prev, created])
      toast.success("Tạo ca thành công")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Loi khong xac dinh")
      toast.error("Không thể tạo ca")
      throw e
    } finally {
      setCreating(false)
    }
  }

  const editShift = async (id: string, payload: ShiftUpdateInput) => {
    try {
      setUpdating(true)
      setError(null)
      const updated = await updateShift(id, payload)
      setShifts(prev => prev.map(s => (s.id === id ? updated : s)))
      toast.success("Cập nhật ca thành công")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Loi khong xac dinh")
      toast.error("Không thể cập nhật ca")
      throw e
    } finally {
      setUpdating(false)
    }
  }

  const deleteShift = async (id: string) => {
    try {
      setError(null)
      setDeleting(true)
      await removeShift(id)
      setShifts(prev => prev.filter(s => s.id !== id))
      toast.success("Đã xóa ca")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Loi khong xac dinh")
      toast.error("Không thể xóa ca")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <PageHeader
            title="Shifts Management"
            description="Create, edit, and manage your shifts with a clean workflow—built for daily use."
            icon={<Sparkles className="h-5 w-5 text-neutral-700" />}
            breadcrumb={
              <>
                <Link href="/log-work/checkin" className="hover:text-neutral-700">
                  Log work
                </Link>{" "}
                <span className="text-neutral-400">/</span>{" "}
                <span className="text-neutral-700">Shifts</span>
              </>
            }
            action={
              <Button className="shadow-sm" onClick={() => setCreateOpen(true)}>
                <Plus />
                Create shift
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
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-56" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-9 w-9" />
                        <Skeleton className="h-9 w-9" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : shifts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-neutral-200/80 bg-white">
                  <div className="p-10 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
                      <Sparkles className="h-6 w-6 text-neutral-600" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-neutral-900">
                      No shifts yet
                    </h2>
                    <p className="mx-auto mt-1 max-w-md text-sm text-neutral-600">
                      Create your first shift to start tracking attendance and
                      salary more smoothly.
                    </p>
                    <div className="mt-6 flex justify-center">
                      <Button onClick={() => setCreateOpen(true)}>
                        <Plus />
                        Create shift
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid gap-3 sm:grid-cols-2"
                transition={{ duration: 0.18 }}
              >
                <AnimatePresence>
                  {shifts.map(shift => (
                    <ShiftCard
                      key={shift.id}
                      shift={shift}
                      onEdit={s => {
                        setEditingShift(s)
                        setEditOpen(true)
                      }}
                      onDelete={s => {
                        setDeletingShift(s)
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

      <ShiftFormModal
        open={createOpen}
        mode="create"
        submitting={creating}
        onOpenChange={setCreateOpen}
        onSubmit={addShift}
      />

      <ShiftFormModal
        open={editOpen}
        mode="edit"
        initial={editingShift}
        submitting={updating}
        onOpenChange={open => {
          setEditOpen(open)
          if (!open) setEditingShift(null)
        }}
        onSubmit={async payload => {
          if (!editingShift) return
          await editShift(editingShift.id, payload)
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this shift?"
        description={
          deletingShift
            ? `This will permanently remove "${deletingShift.name}".`
            : "This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        loading={deleting}
        onOpenChange={open => {
          setConfirmOpen(open)
          if (!open) setDeletingShift(null)
        }}
        onConfirm={async () => {
          if (!deletingShift) return
          await deleteShift(deletingShift.id)
          setConfirmOpen(false)
          setDeletingShift(null)
        }}
      />
    </div>
  )
}

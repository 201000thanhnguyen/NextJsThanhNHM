"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import type { Quote, QuoteCreateInput } from "../types"

type Mode = "create" | "edit"

type QuoteFormModalProps = {
  open: boolean
  mode: Mode
  initial?: Quote | null
  submitting?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: QuoteCreateInput) => void | Promise<void>
}

export function QuoteFormModal({
  open,
  mode,
  initial,
  submitting = false,
  onOpenChange,
  onSubmit,
}: QuoteFormModalProps) {
  const [content, setContent] = React.useState("")
  const [author, setAuthor] = React.useState("")
  const [touched, setTouched] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    setContent(initial?.content ?? "")
    setAuthor(initial?.author ?? "")
    setTouched(false)
  }, [open, initial])

  const title = mode === "create" ? "Create quote" : "Edit quote"
  const description =
    mode === "create"
      ? "Add a new quote to show on the public Quote page."
      : "Update the quote content or author. Changes apply immediately."

  const validation = (() => {
    if (!content.trim()) return "Quote content is required."
    if (!author.trim()) return "Author is required."
    return null
  })()

  async function handleSubmit() {
    setTouched(true)
    if (validation) return
    await onSubmit({ content: content.trim(), author: author.trim() })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={next => (submitting ? null : onOpenChange(next))}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="quote-content">Content</Label>
            <Textarea
              id="quote-content"
              placeholder="Write the quote…"
              value={content}
              onChange={e => setContent(e.target.value)}
              onBlur={() => setTouched(true)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quote-author">Author</Label>
            <Input
              id="quote-author"
              placeholder="e.g. Virginia Woolf"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              onBlur={() => setTouched(true)}
              autoComplete="off"
            />
          </div>

          {touched && validation ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {validation}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="button" onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? "Saving..." : mode === "create" ? "Create quote" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


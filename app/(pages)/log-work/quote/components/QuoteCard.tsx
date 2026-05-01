"use client"

import * as React from "react"
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import type { Quote } from "../types"

type QuoteCardProps = {
  quote: Quote
  onEdit: (quote: Quote) => void
  onDelete: (quote: Quote) => void
}

export function QuoteCard({ quote, onEdit, onDelete }: QuoteCardProps) {
  return (
    <Card className="border-neutral-200/80 bg-white">
      <div className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0 flex-1">
          <p className="line-clamp-3 text-sm leading-6 text-neutral-900">
            <span className="select-none text-neutral-300">“</span>
            <span className="italic">{quote.content}</span>
            <span className="select-none text-neutral-300">”</span>
          </p>
          <p className="mt-3 text-sm font-medium text-neutral-700">— {quote.author}</p>
          <p className="mt-1 text-xs text-neutral-500">
            {new Date(quote.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(quote)}
            aria-label="Edit quote"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDelete(quote)}
            aria-label="Delete quote"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}


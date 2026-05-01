"use client"

import * as React from "react"

import { apiUrl } from "@/app/lib/api"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Quote = {
  id: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
}

const QUOTES_API = apiUrl("/api/quotes")

async function fetchQuotes(): Promise<Quote[]> {
  const res = await fetch(QUOTES_API, { method: "GET" })
  if (!res.ok) throw new Error("Cannot load quotes")
  const data = (await res.json()) as { data?: Quote[] }
  return data.data ?? []
}

export default function QuotePage() {
  const [quotes, setQuotes] = React.useState<Quote[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchQuotes()
        if (!cancelled) setQuotes(data)
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unknown error")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const quote = quotes[0] ?? null

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-white">
      <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-6 sm:py-20">
        <div className="space-y-10">
          <header className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-neutral-500">
              Quote
            </p>
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-neutral-950 sm:text-4xl">
              A moment to read.
            </h1>
            <p className="max-w-2xl text-pretty text-sm leading-7 text-neutral-600">
              Short lines. Quiet whitespace. One thought at a time.
            </p>
          </header>

          {error ? (
            <Card className="border-red-200 bg-red-50 text-red-800">
              <div className="p-4 text-sm">
                <span className="font-medium">Error:</span> {error}
              </div>
            </Card>
          ) : null}

          {loading ? (
            <Card className="border-neutral-200/70 bg-white">
              <div className="p-10 sm:p-12">
                <Skeleton className="h-7 w-3/4" />
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-6 w-[92%]" />
                  <Skeleton className="h-6 w-[84%]" />
                </div>
                <div className="mt-8 flex justify-end">
                  <Skeleton className="h-5 w-36" />
                </div>
              </div>
            </Card>
          ) : !quote ? (
            <Card className="border-neutral-200/70 bg-white">
              <div className="p-12 text-center">
                <h2 className="text-lg font-semibold text-neutral-900">No quotes yet</h2>
                <p className="mt-1 text-sm text-neutral-600">
                  Check back later.
                </p>
              </div>
            </Card>
          ) : (
            <article className="rounded-2xl border border-neutral-200/70 bg-white px-7 py-10 shadow-[0_1px_0_rgba(0,0,0,0.03)] sm:px-10 sm:py-14">
              <blockquote className="font-serif text-[1.6rem] leading-[1.85] tracking-[-0.01em] text-neutral-950 sm:text-[2rem]">
                <span className="select-none text-neutral-300">“</span>
                <span className="italic">{quote.content}</span>
                <span className="select-none text-neutral-300">”</span>
              </blockquote>
              <div className="mt-8 flex justify-end">
                <p className="text-sm font-medium tracking-wide text-neutral-700">
                  — {quote.author}
                </p>
              </div>
            </article>
          )}
        </div>
      </div>
    </div>
  )
}


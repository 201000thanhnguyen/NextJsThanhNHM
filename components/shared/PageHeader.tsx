"use client"

import * as React from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PageHeaderProps = {
  title: string
  description?: string
  breadcrumb?: React.ReactNode
  action?: React.ReactNode
  icon?: React.ReactNode
  backHref?: string
  backLabel?: string
  className?: string
}

export function PageHeader({
  title,
  description,
  breadcrumb,
  action,
  icon,
  backHref,
  backLabel = "Back",
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-sm">
            {icon ?? <Sparkles className="h-5 w-5 text-neutral-700" />}
          </div>
          <div className="min-w-0">
            <div className="text-sm text-neutral-500">
              {breadcrumb}
              {backHref ? (
                <>
                  {breadcrumb ? <span className="text-neutral-400"> · </span> : null}
                  <Button asChild variant="ghost" size="sm" className="-ml-2 h-7 px-2">
                    <Link href={backHref}>{backLabel}</Link>
                  </Button>
                </>
              ) : null}
            </div>
            <h1 className="truncate text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
              {title}
            </h1>
          </div>
        </div>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm text-neutral-600">{description}</p>
        ) : null}
      </div>

      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  )
}


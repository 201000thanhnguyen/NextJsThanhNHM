import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { UserStatus } from "@/features/admin/types"

const map: Record<
  UserStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
  inactive: {
    label: "Inactive",
    className: "border-neutral-200 bg-neutral-100 text-neutral-600",
  },
  pending: {
    label: "Pending",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const s = map[status]
  return (
    <Badge
      variant="secondary"
      className={cn("rounded-md px-2 py-0.5 text-xs font-medium", s.className)}
    >
      {s.label}
    </Badge>
  )
}

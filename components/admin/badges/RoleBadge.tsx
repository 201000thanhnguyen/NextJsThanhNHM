import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { AdminRole } from "@/lib/auth/types"

const roleStyles: Record<AdminRole, string> = {
  SUPER_ADMIN:
    "border-violet-200 bg-violet-50 text-violet-800 font-semibold tracking-wide",
  ADMIN: "border-neutral-300 bg-neutral-100 text-neutral-800",
  USER: "border-neutral-200 bg-white text-neutral-600",
}

export function RoleBadge({
  role,
  className,
}: {
  role: AdminRole
  className?: string
}) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-md px-2 py-0.5 text-[10px] uppercase",
        roleStyles[role],
        className
      )}
    >
      {role.replace(/_/g, " ")}
    </Badge>
  )
}

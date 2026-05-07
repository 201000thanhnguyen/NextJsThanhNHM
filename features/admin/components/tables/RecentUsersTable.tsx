"use client"

import { MoreHorizontal, Pencil, ShieldOff, UserRound } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RoleBadge } from "@/components/admin/badges/RoleBadge"
import { UserStatusBadge } from "@/components/admin/badges/UserStatusBadge"
import type { DashboardUser } from "@/features/admin/types"

import { formatAdminDisplayDate } from "@/lib/admin/format-display-date"

export function RecentUsersTable({ users }: { users: DashboardUser[] }) {
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/40 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-500">
          <UserRound className="h-6 w-6" aria-hidden />
        </div>
        <p className="mt-4 text-sm font-medium text-neutral-800">No users yet</p>
        <p className="mt-1 max-w-sm text-xs text-neutral-500">
          Invite teammates or sync from your directory to populate this table.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-neutral-200/90 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-neutral-100 hover:bg-transparent">
            <TableHead className="w-[52px] pl-5">Avatar</TableHead>
            <TableHead>Full name</TableHead>
            <TableHead className="hidden lg:table-cell">Username</TableHead>
            <TableHead className="hidden xl:table-cell">Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden md:table-cell">Department</TableHead>
            <TableHead className="hidden lg:table-cell">Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[52px] pr-5 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id} className="border-neutral-100">
              <TableCell className="pl-5">
                <Avatar className="h-9 w-9">
                  {u.avatarUrl ? (
                    <AvatarImage src={u.avatarUrl} alt="" />
                  ) : null}
                  <AvatarFallback className="text-[11px] font-semibold">
                    {u.initials}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-neutral-900">{u.fullName}</span>
                  <span className="text-xs text-neutral-500 lg:hidden">
                    @{u.username}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden text-neutral-600 lg:table-cell">
                @{u.username}
              </TableCell>
              <TableCell className="hidden max-w-[220px] truncate text-neutral-600 xl:table-cell">
                {u.email}
              </TableCell>
              <TableCell>
                <RoleBadge role={u.role} />
              </TableCell>
              <TableCell className="hidden text-neutral-600 md:table-cell">
                {u.department}
              </TableCell>
              <TableCell className="hidden text-neutral-600 lg:table-cell">
                {formatAdminDisplayDate(u.createdAt)}
              </TableCell>
              <TableCell>
                <UserStatusBadge status={u.status} />
              </TableCell>
              <TableCell className="pr-5 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                      aria-label={`Actions for ${u.fullName}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44 rounded-xl">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 rounded-lg">
                      <Pencil className="h-4 w-4" />
                      Edit user
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 rounded-lg">
                      <ShieldOff className="h-4 w-4" />
                      Revoke access
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

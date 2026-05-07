import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { AdminLayoutShell } from "@/components/admin/layout/AdminLayoutShell"
import { getServerSession } from "@/lib/auth/get-server-session"
import { canAccessAdminPanel } from "@/lib/auth/roles"
import { initialsFromUsername } from "@/lib/auth/display"

export const metadata: Metadata = {
  title: "Admin · WorkLog",
  description: "Work log management administration",
}

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession()
  if (!session) {
    redirect("/login?next=/admin/dashboard")
  }
  if (!canAccessAdminPanel(session.role)) {
    redirect("/?error=forbidden")
  }

  return (
    <AdminLayoutShell
      userName={session.username}
      userRole={session.role}
      initials={initialsFromUsername(session.username)}
    >
      {children}
    </AdminLayoutShell>
  )
}

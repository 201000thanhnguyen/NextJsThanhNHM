"use client"

import { usePathname } from "next/navigation"

import Navbar from "@/components/shared/Nav"

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

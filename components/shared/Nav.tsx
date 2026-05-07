"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";

type NavLinkProps = {
  href: string
  label: string
  className?: string
  onClick?: () => void
}

function isActiveRoute(pathname: string | null, href: string) {
  if (!pathname) return false
  if (pathname === href) return true
  if (pathname.startsWith(href + "/")) return true
  return false
}

function NavLink({ href, label, className, onClick }: NavLinkProps) {
  const pathname = usePathname()
  const active = isActiveRoute(pathname, href)

  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100",
        className ?? "",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  )
}

function loginHref(pathname: string | null) {
  const next = pathname && pathname !== "/login" ? pathname : "/"
  return `/login?next=${encodeURIComponent(next)}`
}

export default function Navbar() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleLogout() {
    await signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const authed = Boolean(user);

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              ThanhNHM
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/" label="Home" />
            <NavLink href="/quote" label="Quote" />
            <NavLink href="/contact" label="Contact" />

            {!loading && authed ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
              >
                Logout
              </button>
            ) : !loading ? (
              <Link
                href={loginHref(pathname)}
                className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
              >
                Login
              </Link>
            ) : (
              <span className="text-sm text-gray-500">…</span>
            )}
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav-panel"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            onClick={() => setOpen(!open)}
            className="md:hidden -mr-2 inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div className="md:hidden" role="dialog" aria-modal="true" aria-label="Menu điều hướng">
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            className="fixed inset-0 top-16 z-40 bg-gray-900/40 backdrop-blur-[2px] transition-opacity duration-200"
            onClick={() => setOpen(false)}
          />
          <div
            id="mobile-nav-panel"
            className="nav-mobile-panel fixed left-0 right-0 top-16 z-50 max-h-[min(85vh,calc(100dvh-4rem))] overflow-y-auto rounded-b-2xl border-b border-gray-200/80 bg-white shadow-xl ring-1 ring-black/5"
          >
            <div className="px-3 py-2">
              <nav className="flex flex-col gap-1 pb-4">
                <NavLink
                  href="/"
                  label="Home"
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-4 text-[15px]"
                />
                <NavLink
                  href="/quote"
                  label="Quote"
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-4 text-[15px]"
                />
                <NavLink
                  href="/contact"
                  label="Contact"
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-4 text-[15px]"
                />

                <div className="mt-2 border-t border-gray-100 pt-3">
                  {!loading && authed ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex min-h-12 w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-[15px] font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
                    >
                      Logout
                    </button>
                  ) : !loading ? (
                    <Link
                      href={loginHref(pathname)}
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 w-full items-center justify-center rounded-xl bg-gray-900 px-4 text-[15px] font-semibold text-white transition-colors hover:bg-gray-800 active:bg-gray-950"
                    >
                      Login
                    </Link>
                  ) : null}
                </div>
              </nav>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}

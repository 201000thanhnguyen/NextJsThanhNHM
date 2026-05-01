"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!cancelled) setAuthed(res.ok);
      } catch {
        if (!cancelled) setAuthed(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
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
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      setAuthed(false);
      setOpen(false);
      router.push("/");
      router.refresh();
    }
  }

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              ThanhNHM
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Home
            </Link>
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
              >
                LogWork
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="invisible absolute left-0 top-full min-w-40 rounded bg-white py-2 shadow-lg ring-1 ring-gray-200 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <Link
                  href="/log-work/checkin"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                >
                  Checkin
                </Link>
                <Link
                  href="/log-work/overview"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                >
                  Overview
                </Link>
              </div>
            </div>
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600"
            >
              Contact
            </Link>

            {authed ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
              >
                Logout
              </button>
            ) : (
              <Link
                href={`/login?next=${encodeURIComponent(pathname ?? "/log-work/checkin")}`}
                className="rounded bg-gray-900 px-4 py-2 text-white hover:bg-gray-800"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
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

      {/* Mobile: overlay + panel */}
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
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className={`flex min-h-12 items-center rounded-xl px-4 text-[15px] font-medium transition-colors ${
                    pathname === "/"
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-800 hover:bg-gray-50 active:bg-gray-100"
                  }`}
                >
                  Home
                </Link>

                <div className="my-1 border-t border-gray-100" />

                <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  LogWork
                </p>
                <div className="ml-2 flex flex-col gap-0.5 border-l-2 border-blue-100 pl-3">
                  <Link
                    href="/log-work/checkin"
                    onClick={() => setOpen(false)}
                    className={`flex min-h-11 items-center rounded-lg px-3 text-[15px] transition-colors ${
                      pathname?.startsWith("/log-work/checkin")
                        ? "bg-blue-50 font-medium text-blue-700"
                        : "text-gray-800 hover:bg-gray-50 active:bg-gray-100"
                    }`}
                  >
                    Checkin
                  </Link>
                  <Link
                    href="/log-work/overview"
                    onClick={() => setOpen(false)}
                    className={`flex min-h-11 items-center rounded-lg px-3 text-[15px] transition-colors ${
                      pathname?.startsWith("/log-work/overview")
                        ? "bg-blue-50 font-medium text-blue-700"
                        : "text-gray-800 hover:bg-gray-50 active:bg-gray-100"
                    }`}
                  >
                    Overview
                  </Link>
                </div>

                <div className="my-1 border-t border-gray-100" />

                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-4 text-[15px] font-medium text-gray-800 transition-colors hover:bg-gray-50 active:bg-gray-100"
                >
                  Contact
                </Link>

                <div className="mt-2 border-t border-gray-100 pt-3">
                  {authed ? (
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex min-h-12 w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-4 text-[15px] font-semibold text-gray-900 shadow-sm transition-colors hover:bg-gray-50 active:bg-gray-100"
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      href={`/login?next=${encodeURIComponent(pathname ?? "/log-work/checkin")}`}
                      onClick={() => setOpen(false)}
                      className="flex min-h-12 w-full items-center justify-center rounded-xl bg-gray-900 px-4 text-[15px] font-semibold text-white transition-colors hover:bg-gray-800 active:bg-gray-950"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}

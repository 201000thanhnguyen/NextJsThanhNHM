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
        const res = await fetch("http://localhost:3001/auth/me", { credentials: "include" });
        if (!cancelled) setAuthed(res.ok);
      } catch {
        if (!cancelled) setAuthed(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  async function handleLogout() {
    try {
      await fetch("http://localhost:3001/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      setAuthed(false);
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

          {/* Mobile button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded hover:bg-gray-100"
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

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t">
          <div className="flex flex-col px-4 py-3 space-y-2">
            <Link href="/" className="bg-blue-600 text-white p-2 rounded text-center">
              Home
            </Link>
            <div className="space-y-1">
              <p className="px-2 text-sm font-medium text-gray-500">LogWork</p>
              <Link href="/log-work/checkin" className="block hover:bg-gray-100 p-2 rounded">
                Checkin
              </Link>
              <Link href="/log-work/overview" className="block hover:bg-gray-100 p-2 rounded">
                Overview
              </Link>
            </div>
            <Link
              href="/"
              className="hover:bg-gray-100 p-2 rounded"
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
                className="rounded bg-gray-900 px-4 py-2 text-white text-center hover:bg-gray-800"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

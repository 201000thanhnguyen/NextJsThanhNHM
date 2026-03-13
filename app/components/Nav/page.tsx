"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Timekeeping
            </Link>
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600"
            >
              Contact
            </Link>
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
            <Link href="/" className="hover:bg-gray-100 p-2 rounded">
              Timekeeping
            </Link>
            <Link
              href="/"
              className="hover:bg-gray-100 p-2 rounded"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
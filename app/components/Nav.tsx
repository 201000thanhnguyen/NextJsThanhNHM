// Nav.tsx
// Next.js + Tailwind responsive navigation component with TypeScript typings

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white shadow-lg shadow-gray-400/50 fixed w-full z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-md flex items-center justify-center text-white font-bold">T</div>
              <span className="font-semibold text-lg text-gray-800">ThanhNHM</span>
            </Link>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {links.map((l) => (
              <NavLink key={l.href} href={l.href} label={l.label} active={pathname === l.href} />
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/login" className="px-4 py-2 rounded-md text-sm font-medium bg-gray-300 border border-transparent hover:bg-gray-100 shadow-lg shadow-gray-500/50">
              Sign in
            </Link>
            <Link href="/signup" className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-500 text-white hover:opacity-95 shadow-lg shadow-indigo-500/50">
              Sign up
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen((s) => !s)}
              aria-expanded={open}
              aria-label="Toggle navigation"
              className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg className={`h-6 w-6 transition-transform ${open ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="md:hidden py-2">
            <div className="space-y-1">
              {links.map((l) => (
                <MobileLink key={l.href} href={l.href} label={l.label} active={pathname === l.href} onClick={() => setOpen(false)} />
              ))}
            </div>
            <div className="mt-3 border-t pt-3 flex flex-col space-y-2">
              <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium">
                Sign in
              </Link>
              <Link href="/signup" className="block px-3 py-2 rounded-md font-medium bg-indigo-600 text-white text-center">
                Sign up
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

interface NavLinkProps extends NavItem {
  active: boolean;
}

function NavLink({ href, label, active }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm text-white font-medium bg-indigo-500 shadow-lg shadow-indigo-500/50 ${
        active ? "text-indigo-600 underline decoration-indigo-200" : "text-gray-700 hover:text-gray-900"
      }`}
    >
      {label}
    </Link>
  );
}

interface MobileLinkProps extends NavLinkProps {
  onClick: () => void;
}

function MobileLink({ href, label, active, onClick }: MobileLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-3 py-2 rounded-md text-base font-medium ${active ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"}`}
    >
      {label}
    </Link>
  );
}

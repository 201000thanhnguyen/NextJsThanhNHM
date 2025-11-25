// Nav.tsx
// Next.js + Tailwind responsive navigation component with TypeScript typings

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  subItem?: NavSubItem[];
}

interface NavSubItem extends NavItem {
  active: boolean;
  subMenu?: NavItem[];
}

export default function Nav() {
 
  const [open, setOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  // helper to determine if a link (top-level) should be considered active for mobile
  const isActive = (href: string, sub?: NavSubItem[]) => {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    if (pathname === href) return true;
    // treat nested paths under the href as active (e.g. /at-work/summary-salary -> /at-work active)
    if (pathname.startsWith(href.endsWith("/") ? href : href + "/")) return true;
    // also consider if any subitem exactly matches pathname
    if (sub && sub.some(s => pathname === s.href || pathname.startsWith(s.href + "/"))) return true;
    return false;
  };

  const subLinksAtwork: NavSubItem[] = [
    { href: "/at-work", label: "Atwork", active: pathname === "/at-work" },
    { href: "/pay-form", label: "PayForm", active: pathname === "/pay-form" },
    { href: "/at-work/summary-salary", label: "SummarySalary", active: pathname === "/at-work/summary-salary" },
    { href: "/work-form", label: "WorkForm", active: pathname === "/work-form" }
  ];

  const links: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/at-work", label: "Atwork", subItem: subLinksAtwork},
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
            {
            links.map((l) => (
              <NavLink key={l.href + '' + l.label} href={l.href} label={l.label} active={pathname === l.href} fullLink={pathname} subItem={l.subItem} />
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/login" className="px-4 py-2 rounded-md text-sm font-medium bg-gray-300 border border-transparent lg:shadow-md shadow-gray-500/50 hover:bg-gray-200 hover:shadow-lg hover:shadow-gray-400">
              Sign in
            </Link>
            <Link href="/signup" className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-500 text-white lg:shadow-md lg:shadow-indigo-400 hover:bg-pink-400 hover:shadow-lg hover:shadow-pink-400">
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
                l.subItem && l.subItem.length > 0 ? (
                  <div key={l.href} className="space-y-1">
                    {/** highlight parent when any child or nested path is active */}
                    <button
                      onClick={() => setMobileSubOpen((prev) => ({ ...prev, [l.href]: !prev[l.href] }))}
                      aria-expanded={!!mobileSubOpen[l.href]}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium hover:bg-gray-50 ${isActive(l.href, l.subItem) ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}`}
                    >
                      <span>{l.label}</span>
                      <svg className={`h-5 w-5 transform transition-transform ${mobileSubOpen[l.href] ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6L14 10L6 14V6Z" />
                      </svg>
                    </button>

                    {mobileSubOpen[l.href] && (
                      <div className="pl-4 space-y-1">
                        {l.subItem.map((s) => (
                          <Link
                            key={s.href}
                            href={s.href}
                            onClick={() => setOpen(false)}
                            className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === s.href ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                          >
                            {s.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <MobileLink key={l.href} href={l.href} label={l.label} active={isActive(l.href)} onClick={() => setOpen(false)} />
                )
              ))}
            </div>
            <div className="mt-3 border-t pt-3 flex flex-col space-y-2">
              <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium bg-gray-300 text-center">
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
  fullLink?: string;
}

function NavLink({ href, label, active, fullLink, subItem }: NavLinkProps) {
  
  const [menuOpen, setMenuOpen] = useState(false);
  const str = fullLink || "";

  const parts = str.split("/").filter(Boolean); // ["at-work", "summary-salary"]

  const resultPath = parts.map(p => `/${p}`);
  if (str == "/"){
    resultPath.push("/");
  };

  // If there is no submenu, render a simple Link
  if (!subItem || subItem.length === 0) {
    return (
      <Link
        href={href}
        className={`px-3 py-2 rounded-md text-sm text-white font-medium bg-indigo-500 shadow-md shadow-indigo-500/50 ${
          href === resultPath[0]
            ? "underline lg:shadow-lg lg:shadow-pink-400 lg:bg-pink-400"
            : "text-gray-700 hover:underline hover:bg-pink-400 hover:shadow-lg hover:shadow-pink-400"
        }`}
      >
        {label}
      </Link>
    );
  }

  // Render a dropdown for items with subItem
  return (
    <div className="relative" onMouseLeave={() => setMenuOpen(false)}>
      <button
        //onMouseEnter={() => setMenuOpen(true)} // hover to open dropdown menu
        onClick={() => setMenuOpen((s) => !s)} // click to open dropdown menu
        aria-haspopup="true"
        aria-expanded={menuOpen}
        className={`px-3 py-2 rounded-md text-sm text-white font-medium bg-indigo-500 shadow-md shadow-indigo-500/50 
            ${href === resultPath[0] 
              ? 'text-gray-900 underline lg:shadow-lg lg:shadow-pink-400 lg:bg-pink-400' 
              : 'text-gray-700 hover:underline hover:bg-pink-400 hover:shadow-lg hover:shadow-pink-400'}
          `}
      >
        {label}
      </button>

      {menuOpen && (
        <div className="absolute left-0 w-48 bg-white border rounded shadow-lg z-20">
          {subItem.map((s) => (
            <Link key={s.href} href={s.href} 
                  className={`block px-4 py-2 text-sm text-gray-700 hover:bg-pink-300
                  ${s.href === (resultPath[0] ?? "")+(resultPath[1] ?? "") 
                    ? 'lg:bg-pink-400' 
                    : 'text-gray-700'}
                  `}>
              {s.label}
            </Link>
          ))}
        </div>
      )}
    </div>
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
      className={`block px-3 py-2 rounded-md text-base font-medium 
        ${active 
          ? "bg-indigo-50 text-indigo-700" 
          : "text-gray-700 hover:bg-gray-50"}`}
    >
      {label}
    </Link>
  );
}


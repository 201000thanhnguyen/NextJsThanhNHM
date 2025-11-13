// Footer.tsx
// Simple responsive footer using Tailwind CSS

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full mt-0 bg-white shadow-top">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Copyright */}
        <div className="mt-0 text-center text-sm text-gray-500">
          © {year} ThanhNHM. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
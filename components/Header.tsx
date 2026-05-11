"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { href: "/everyday", label: "Everyday" },
  { href: "/ai-tools", label: "AI Tools" },
  { href: "/pdf-image", label: "PDF & Image" },
  { href: "/all-tools", label: "All Tools" }
];

const categoryLinks = [
  { href: "/student", label: "Student" },
  { href: "/developer", label: "Developer" },
  { href: "/seo-tools", label: "SEO Tools" },
  { href: "/social-media-tools", label: "Social Media Tools" },
  { href: "/image-tools", label: "Image Tools" },
  { href: "/pdf-tools", label: "PDF Tools" },
  { href: "/text-tools", label: "Text Tools" },
  { href: "/calculator-tools", label: "Calculator Tools" }
];

const mobileLinks = [...primaryLinks.slice(0, 3), ...categoryLinks, primaryLinks[3]];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 shadow-sm shadow-slate-900/[0.03] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-xl font-bold tracking-tight text-slate-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-sm font-black text-white shadow-[0_14px_28px_rgba(37,99,235,0.22)] ring-1 ring-white/50">FT</span>
          <span>Free<span className="text-brand-600">ToolKit</span></span>
        </Link>

        <nav className="hidden shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white/85 p-1 text-sm font-semibold text-slate-600 shadow-sm lg:flex">
          {primaryLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-3 py-2.5 transition hover:bg-brand-50 hover:text-brand-700">
              {link.label}
            </Link>
          ))}
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1 rounded-full px-3 py-2.5 transition hover:bg-brand-50 hover:text-brand-700">
              Categories
              <span aria-hidden="true" className="text-xs transition group-open:rotate-180">v</span>
            </summary>
            <div className="absolute right-0 top-full mt-2 grid w-64 gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/[0.08]">
              {categoryLinks.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
                  {link.label}
                </Link>
              ))}
            </div>
          </details>
        </nav>

        <button
          className="min-h-11 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 focus:outline-none focus:ring-4 focus:ring-brand-100 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div className={cn("border-t border-slate-100 bg-white/95 px-4 py-3 shadow-lg shadow-slate-900/[0.04] lg:hidden", !open && "hidden")}>
        <nav className="mx-auto grid max-w-7xl gap-2 text-sm font-semibold text-slate-700">
          {mobileLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-2xl border border-slate-100 bg-white px-4 py-4 text-base shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

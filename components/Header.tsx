"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/everyday", label: "Everyday" },
  { href: "/ai-tools", label: "AI Tools" },
  { href: "/student", label: "Student" },
  { href: "/developer", label: "Developer" },
  { href: "/pdf-image", label: "PDF & Image" },
  { href: "/all-tools", label: "All Tools" }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  function searchPath() {
    const trimmed = query.trim();
    return trimmed ? `/all-tools?q=${encodeURIComponent(trimmed)}` : "/all-tools";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 shadow-sm shadow-slate-900/[0.03] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-xl font-bold tracking-tight text-slate-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-sm font-black text-white shadow-[0_14px_28px_rgba(37,99,235,0.22)] ring-1 ring-white/50">FT</span>
          <span>Free<span className="text-brand-600">ToolKit</span></span>
        </Link>
        <form action={searchPath()} className="hidden min-w-0 flex-1 xl:block">
          <label className="sr-only" htmlFor="site-search">Search FreeToolKit</label>
          <input
            id="site-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search 76+ tools..."
            className="min-h-11 w-full rounded-full border border-slate-200 bg-white/85 px-5 text-sm font-semibold text-slate-700 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
            type="search"
          />
        </form>
        <nav className="hidden shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white/85 p-1 text-sm font-semibold text-slate-600 shadow-sm lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-3 py-2.5 transition hover:bg-brand-50 hover:text-brand-700">
              {link.label}
            </Link>
          ))}
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
          <Link href="/all-tools" className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-4 text-base font-black text-brand-700 shadow-sm" onClick={() => setOpen(false)}>
            Search all tools
          </Link>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-2xl border border-slate-100 bg-white px-4 py-4 text-base shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

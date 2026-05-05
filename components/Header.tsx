"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/everyday", label: "Everyday" },
  { href: "/student", label: "Student" },
  { href: "/ai-tools", label: "AI Tools" },
  { href: "/developer", label: "Developer" },
  { href: "/all-tools", label: "All Tools" }
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 shadow-sm shadow-slate-900/[0.03] backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3 text-xl font-bold tracking-tight text-slate-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-sm font-black text-white shadow-[0_14px_28px_rgba(37,99,235,0.22)]">FT</span>
          <span className="font-display">Free<span className="text-brand-600">ToolKit</span></span>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/85 p-1 text-sm font-semibold text-slate-600 shadow-sm lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-3.5 py-2.5 transition hover:bg-brand-50 hover:text-brand-700">
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <div className={cn("border-t border-slate-100 bg-white/95 px-4 py-3 shadow-lg shadow-slate-900/[0.04] lg:hidden", !open && "hidden")}>
        <nav className="mx-auto grid max-w-7xl gap-2 text-sm font-semibold text-slate-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-2xl px-4 py-4 text-base hover:bg-brand-50" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

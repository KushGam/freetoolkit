"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/image-tools", label: "Image Tools" },
  { href: "/pdf-tools", label: "PDF Tools" },
  { href: "/student-tools", label: "Student Tools" },
  { href: "/text-tools", label: "Text Tools" },
  { href: "/developer-tools", label: "Developer Tools" },
  { href: "/calculator-tools", label: "Calculator Tools" },
  { href: "/security-tools", label: "Security Tools" }
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 shadow-sm shadow-slate-900/[0.03] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-3 text-xl font-black tracking-normal text-slate-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-sm text-white shadow-[0_14px_28px_rgba(37,99,235,0.22)]">FT</span>
          <span>Free<span className="text-brand-600">ToolKit</span></span>
        </Link>
        <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 text-xs font-bold text-slate-600 shadow-sm xl:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-3 py-2 hover:bg-brand-50 hover:text-brand-700">
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/all-tools" className="hidden rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-700 md:inline-flex">
          All Tools
        </Link>
        <button
          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-extrabold text-slate-700 shadow-sm xl:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label="Toggle navigation"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <div className={cn("border-t border-slate-100 bg-white/95 px-4 py-3 shadow-lg shadow-slate-900/[0.04] xl:hidden", !open && "hidden")}>
        <nav className="mx-auto grid max-w-6xl gap-2 text-sm font-bold text-slate-700">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-2xl px-3 py-3 hover:bg-brand-50" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/all-tools" className="rounded-2xl bg-slate-950 px-3 py-3 text-white" onClick={() => setOpen(false)}>
            All Tools
          </Link>
        </nav>
      </div>
    </header>
  );
}

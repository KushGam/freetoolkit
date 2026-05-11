"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { href: "/", label: "Home" }
];

const categoryGroups = [
  {
    title: "Productivity",
    links: [
      { href: "/student-tools", label: "Student Tools", icon: "ST" },
      { href: "/calculator-tools", label: "Calculator Tools", icon: "CA" },
      { href: "/text-tools", label: "Text Tools", icon: "TX" }
    ]
  },
  {
    title: "Creative",
    links: [
      { href: "/image-tools", label: "Image Tools", icon: "IM" },
      { href: "/social-media-tools", label: "Social Media Tools", icon: "SO" }
    ]
  },
  {
    title: "Technical",
    links: [
      { href: "/developer-tools", label: "Developer Tools", icon: "DV" },
      { href: "/seo-tools", label: "SEO Tools", icon: "SE" },
      { href: "/security-tools", label: "Security Tools", icon: "SC" }
    ]
  },
  {
    title: "Document",
    links: [{ href: "/pdf-tools", label: "PDF Tools", icon: "PF" }]
  },
  {
    title: "AI",
    links: [{ href: "/ai-tools", label: "AI Tools", icon: "AI" }]
  }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [activeDesktopGroup, setActiveDesktopGroup] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const body = document.body;
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const previousStyles = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight
    };

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousStyles.overflow;
      body.style.position = previousStyles.position;
      body.style.top = previousStyles.top;
      body.style.width = previousStyles.width;
      body.style.paddingRight = previousStyles.paddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/75 shadow-sm shadow-slate-900/[0.03] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-xl font-bold tracking-tight text-slate-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-sm font-black text-white shadow-[0_14px_28px_rgba(37,99,235,0.22)] ring-1 ring-white/50">FT</span>
          <span>Free<span className="text-brand-600">ToolKit</span></span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white/85 p-1 text-sm font-semibold text-slate-600 shadow-sm lg:flex"
          onMouseLeave={() => setActiveDesktopGroup(null)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setActiveDesktopGroup(null);
            }
          }}
          onBlurCapture={(event) => {
            const nextFocused = event.relatedTarget;
            if (!(nextFocused instanceof Node) || !event.currentTarget.contains(nextFocused)) {
              setActiveDesktopGroup(null);
            }
          }}
        >
          {primaryLinks.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full px-3 py-2.5 transition hover:bg-brand-50 hover:text-brand-700">
              {link.label}
            </Link>
          ))}
          {categoryGroups.map((group) => (
            <div
              key={group.title}
              className="relative"
              onMouseEnter={() => setActiveDesktopGroup(group.title)}
              onFocusCapture={() => setActiveDesktopGroup(group.title)}
            >
              <button
                type="button"
                className={cn(
                  "flex items-center gap-1 rounded-full px-3 py-2.5 transition hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100",
                  activeDesktopGroup === group.title && "bg-brand-50 text-brand-700"
                )}
                aria-expanded={activeDesktopGroup === group.title ? "true" : "false"}
                aria-haspopup="menu"
                aria-controls={`desktop-menu-${group.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {group.title}
                <span
                  aria-hidden="true"
                  className={cn("text-xs transition-transform", activeDesktopGroup === group.title && "rotate-180")}
                >
                  v
                </span>
              </button>
              <div
                id={`desktop-menu-${group.title.toLowerCase().replace(/\s+/g, "-")}`}
                className={cn(
                  "absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/[0.12] transition-all duration-150 ease-out",
                  activeDesktopGroup === group.title ? "pointer-events-auto visible translate-y-0 opacity-100" : "pointer-events-none invisible -translate-y-1 opacity-0"
                )}
              >
                <p className="px-2 pb-2 text-[11px] font-black uppercase tracking-wide text-slate-400">{group.title}</p>
                <div className="grid gap-1">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group/link flex min-w-0 items-center gap-3 rounded-2xl px-2.5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-100"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-black text-slate-500 transition group-hover/link:border-brand-200 group-hover/link:bg-white group-hover/link:text-brand-700">
                        {link.icon}
                      </span>
                      <span className="truncate">{link.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>

        <button
          className="min-h-11 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-brand-200 hover:bg-brand-50 focus:outline-none focus:ring-4 focus:ring-brand-100 lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open ? "true" : "false"}
          aria-label="Toggle navigation"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <div className={cn("border-t border-slate-100 bg-white/95 px-4 py-3 shadow-lg shadow-slate-900/[0.04] lg:hidden", !open && "hidden")}>
        <nav aria-label="Mobile navigation" className="mx-auto grid max-h-[calc(100dvh-5.25rem)] max-w-7xl gap-3 overflow-y-auto overscroll-contain scroll-smooth text-sm font-semibold text-slate-700 [-webkit-overflow-scrolling:touch]">
          <div className="grid gap-2">
            {primaryLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-2xl border border-slate-100 bg-white px-4 py-4 text-base shadow-sm transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {categoryGroups.map((group) => (
              <section key={group.title} className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                <p className="px-1 text-[11px] font-black uppercase tracking-wide text-slate-400">{group.title}</p>
                <div className="mt-2 grid gap-1">
                  {group.links.map((link) => (
                    <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700" onClick={() => setOpen(false)}>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[10px] font-black text-slate-500">
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

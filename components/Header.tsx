"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteLogo } from "@/components/SiteLogo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/pdf-image", label: "PDF & Image" },
  { href: "/ai-tools", label: "AI Tools" },
  { href: "/seo-tools", label: "SEO" },
  { href: "/developer", label: "Developer" },
  { href: "/calculators", label: "Calculators" },
  { href: "/blog", label: "Blog" }
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <SiteLogo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-ink-muted transition hover:bg-white/[0.06] hover:text-ink-primary",
                isActive(link.href) && "bg-white/[0.06] text-ink-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/all-tools" className="btn-primary ml-2 !min-h-9 !px-4 !py-2 !text-xs">
            All tools
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-ink-secondary lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-white/10 px-4 py-4 lg:hidden">
          <div className="grid gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-3 text-sm font-medium text-ink-muted",
                  isActive(link.href) && "bg-white/[0.06] text-ink-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/all-tools" onClick={() => setOpen(false)} className="btn-primary mt-2 text-center">
              All tools
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

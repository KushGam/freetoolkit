"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/pdf-image", label: "PDF & Image" },
  { href: "/ai-tools", label: "AI Tools" },
  { href: "/seo-tools", label: "SEO" },
  { href: "/developer", label: "Developer" },
  { href: "/calculators", label: "Calculators" },
  { href: "/blog", label: "Blog" }
];

function Logo() {
  return (
    <Link
      href="/"
      className="max-w-[160px] truncate font-heading text-[15px] font-extrabold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:max-w-none sm:text-[17px]"
      aria-label="freetoolkitapp home"
    >
      <span className="text-text">free</span>
      <span className="text-gold">toolkit</span>
      <span className="text-text">app</span>
    </Link>
  );
}

function HamburgerButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[44px] w-[44px] flex-col items-center justify-center gap-[5px] rounded-lg border border-border-hi bg-bg3 transition-colors hover:bg-bg4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold lg:hidden"
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
    >
      <span
        className={cn("h-[2px] w-5 rounded-full bg-text transition-all duration-200", open && "translate-y-[7px] rotate-45")}
      />
      <span className={cn("h-[2px] w-5 rounded-full bg-text transition-all duration-200", open && "opacity-0")} />
      <span
        className={cn("h-[2px] w-5 rounded-full bg-text transition-all duration-200", open && "-translate-y-[7px] -rotate-45")}
      />
    </button>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (open && !(e.target as Element).closest("header")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-[60px] border-b border-border bg-[rgba(10,10,15,0.85)] backdrop-blur-lg">
      <div className="relative mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex min-h-[44px] items-center rounded-lg px-3 py-2.5 text-[13px] font-medium text-text-2 transition-all hover:bg-bg3 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold",
                isActive(link.href) && "bg-bg3 text-text"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/all-tools"
            className="hidden min-h-[44px] items-center rounded-xl bg-gold px-4 py-2.5 text-sm font-bold text-[#0a0a0f] shadow-gold transition-all hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold lg:inline-flex"
          >
            All tools →
          </Link>
          <HamburgerButton open={open} onClick={() => setOpen((v) => !v)} />
        </div>

        <div
          className={cn(
            "absolute left-0 right-0 top-[60px] overflow-hidden border-b border-border bg-bg2 transition-all duration-200 lg:hidden",
            open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav aria-label="Mobile" className="flex flex-col">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-[48px] w-full items-center border-b border-border px-6 py-3 text-[15px] font-medium text-text-2 transition hover:bg-bg3 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold last:border-b-0",
                  isActive(link.href) && "text-text"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/all-tools"
              onClick={() => setOpen(false)}
              className="mx-4 mb-4 mt-2 flex min-h-[48px] items-center justify-center rounded-xl bg-gold text-center text-[14px] font-bold text-[#0a0a0f] shadow-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Browse all tools →
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

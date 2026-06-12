import Link from "next/link";
import { cn } from "@/lib/utils";

const baseFocus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold";

export function PrimaryButton({
  href,
  children,
  className,
  onClick
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-xl bg-gold px-6 py-3 text-sm font-bold text-[#0a0a0f] shadow-gold transition hover:-translate-y-0.5 hover:brightness-110",
    baseFocus,
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

export function SecondaryButton({
  href,
  children,
  className
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-xl border border-border-hi bg-bg3 px-6 py-3 text-sm font-semibold text-text transition hover:border-gold hover:bg-[rgba(245,166,35,0.04)]",
        baseFocus,
        className
      )}
    >
      {children}
    </Link>
  );
}

export function GhostButton({
  href,
  children,
  className
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("text-sm font-medium text-text-2 transition hover:text-gold", baseFocus, className)}
    >
      {children}
    </Link>
  );
}

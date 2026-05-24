import { cn, siteLogoMark } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06] text-xs font-bold",
        className
      )}
      aria-hidden="true"
    >
      {siteLogoMark}
    </span>
  );
}

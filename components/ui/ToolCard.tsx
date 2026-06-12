import Link from "next/link";
import { ToolBadge } from "@/components/ui/ToolBadge";
import { cn } from "@/lib/utils";

export function ToolCard({
  slug,
  name,
  desc,
  category,
  privacy,
  featured = false,
  href,
  description,
  variant = "default",
  isNew = false,
  isPopular = false,
  accentColor
}: {
  slug?: string;
  name: string;
  desc?: string;
  category: string;
  privacy?: string;
  featured?: boolean;
  href?: string;
  description?: string;
  variant?: "default" | "compact";
  isNew?: boolean;
  isPopular?: boolean;
  accentColor?: string;
}) {
  const path = slug ? `/${slug}` : (href ?? "/");
  const cardDesc = desc ?? description ?? "";

  if (variant === "compact") {
    return (
      <Link
        href={path}
        prefetch={false}
        className="group relative block overflow-hidden rounded-xl border border-border bg-bg2 p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-border-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:p-4"
      >
        {accentColor ? (
          <span
            className="absolute left-0 right-0 top-0 h-[2px] opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            style={{ backgroundColor: accentColor }}
            aria-hidden="true"
          />
        ) : null}
        <div className="flex items-start justify-between gap-2">
          <ToolBadge category={category} />
          <div className="flex gap-1">
            {isNew ? (
              <span className="rounded-full bg-[rgba(52,211,153,0.12)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#34D399]">
                New
              </span>
            ) : null}
            {isPopular ? (
              <span className="rounded-full bg-[rgba(245,166,35,0.12)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-gold">
                Popular
              </span>
            ) : null}
          </div>
        </div>
        <h3 className="mt-2 text-[13px] font-semibold leading-snug text-text">{name}</h3>
        <p className="mt-1 line-clamp-2 flex-1 text-[11px] leading-relaxed text-text-2">{cardDesc}</p>
        <div className="mt-2 flex items-center justify-between">
          {privacy ? <p className="text-[10px] text-text-3">{privacy}</p> : <span />}
          <span
            className="text-[12px] text-gold opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100"
            aria-hidden="true"
          >
            →
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={path}
      prefetch={false}
      className={cn(
        "group flex flex-col gap-2.5 rounded-2xl border p-4 transition-all duration-150 hover:-translate-y-0.5 hover:border-border-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:p-5",
        featured
          ? "border-[rgba(245,166,35,0.22)] bg-gradient-to-br from-[rgba(245,166,35,0.04)] to-bg2"
          : "border-border bg-bg2"
      )}
    >
      <div className="flex items-center gap-2">
        <ToolBadge category={category} />
        <span className="flex-1" />
        <span
          className="text-sm text-gold opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100"
          aria-hidden="true"
        >
          →
        </span>
      </div>
      <h3 className="text-[13px] font-semibold leading-snug text-text sm:text-[14px]">{name}</h3>
      <p className="flex-1 text-[11px] leading-relaxed text-text-2 sm:text-[12px]">{cardDesc}</p>
      {privacy ? <p className="text-[11px] text-text-3">{privacy}</p> : null}
    </Link>
  );
}

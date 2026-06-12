import Link from "next/link";

export function CategoryHubCard({
  href,
  emoji,
  title,
  description,
  tags,
  accent
}: {
  href: string;
  emoji: string;
  title: string;
  description: string;
  tags: string[];
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl border border-border bg-bg2 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--cat-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:p-6"
      style={{ "--cat-accent": accent } as React.CSSProperties}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-[0.06]"
        style={{ background: `linear-gradient(135deg, ${accent}, transparent)` }}
        aria-hidden="true"
      />
      <div className="relative z-10">
        <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-white/[0.04] text-base sm:mb-4 sm:h-10 sm:w-10 sm:text-lg">
          {emoji}
        </span>
        <h3 className="mb-1.5 font-heading text-[13px] font-bold text-text sm:text-[15px]">{title}</h3>
        <p className="mb-4 text-[11px] leading-relaxed text-text-2 sm:text-[12px]">{description}</p>
        <div className="hidden flex-wrap gap-1 sm:flex">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-border bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-semibold text-text-3"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

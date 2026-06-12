export type ToolBadgeCategory = "pdf" | "img" | "ai" | "seo" | "dev" | "calc" | "student";

const BADGE_META: Record<ToolBadgeCategory, { label: string; color: string }> = {
  pdf: { label: "PDF", color: "var(--cat-pdf)" },
  img: { label: "Image", color: "var(--cat-img)" },
  ai: { label: "AI", color: "var(--cat-ai)" },
  seo: { label: "SEO", color: "var(--cat-seo)" },
  dev: { label: "Dev", color: "var(--cat-dev)" },
  calc: { label: "Calc", color: "var(--cat-calc)" },
  student: { label: "Student", color: "var(--cat-student)" }
};

const CATEGORY_ALIASES: Record<string, ToolBadgeCategory> = {
  pdf: "pdf",
  img: "img",
  image: "img",
  ai: "ai",
  seo: "seo",
  dev: "dev",
  developer: "dev",
  calc: "calc",
  calculators: "calc",
  calculator: "calc",
  student: "student",
  "pdf tools": "pdf",
  "image tools": "img",
  "ai tools": "ai",
  "seo tools": "seo",
  "developer tools": "dev",
  "calculator tools": "calc",
  "student tools": "student"
};

export function normalizeBadgeCategory(category: string): ToolBadgeCategory {
  const key = category.trim().toLowerCase();
  return CATEGORY_ALIASES[key] ?? "ai";
}

export function ToolBadge({ category }: { category: string }) {
  const normalized = normalizeBadgeCategory(category);
  const { label, color } = BADGE_META[normalized];

  return (
    <span
      className="inline-flex rounded px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`
      }}
    >
      {label}
    </span>
  );
}

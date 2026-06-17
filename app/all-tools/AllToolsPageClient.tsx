"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GhostButton, PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { ToolBadge } from "@/components/ui/ToolBadge";
import { ToolCard } from "@/components/ui/ToolCard";
import { getToolPrivacyTier, type PrivacyTier } from "@/data/site-trust";
import { tools, type Tool } from "@/data/tools";

type CatalogCategory =
  | "PDF Tools"
  | "Image Tools"
  | "AI Tools"
  | "Writing Tools"
  | "SEO Tools"
  | "Developer Tools"
  | "Calculator Tools"
  | "Student Tools";

type ToolWithMeta = {
  slug: string;
  name: string;
  shortDesc: string;
  category: string;
  hub: string;
  privacy: PrivacyTier;
  isNew: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  catalogCategory: CatalogCategory;
  badgeCategory: string;
};

const CATALOG_ORDER: CatalogCategory[] = [
  "PDF Tools",
  "Image Tools",
  "AI Tools",
  "Writing Tools",
  "SEO Tools",
  "Developer Tools",
  "Calculator Tools",
  "Student Tools"
];

const CATEGORY_COLORS: Record<CatalogCategory, string> = {
  "PDF Tools": "#F87171",
  "Image Tools": "#FB923C",
  "AI Tools": "#A78BFA",
  "Writing Tools": "#E879F9",
  "SEO Tools": "#34D399",
  "Developer Tools": "#60A5FA",
  "Calculator Tools": "#FBBF24",
  "Student Tools": "#F472B6"
};

const CATEGORY_HUBS: Record<CatalogCategory, string> = {
  "PDF Tools": "/pdf-image",
  "Image Tools": "/pdf-image",
  "AI Tools": "/ai-tools",
  "Writing Tools": "/ai-tools",
  "SEO Tools": "/seo-tools",
  "Developer Tools": "/developer",
  "Calculator Tools": "/calculators",
  "Student Tools": "/ai-tools"
};

const WRITING_SLUGS = new Set([
  "word-counter",
  "character-counter",
  "case-converter",
  "readability-checker",
  "paraphrasing-tool",
  "grammar-fixer"
]);

const DEV_EXTRA_SLUGS = new Set(["markdown-to-html", "qr-code-generator", "password-generator", "random-number-generator"]);
const CALC_EXTRA_SLUGS = new Set(["pomodoro-timer", "typing-speed-test"]);
const STUDENT_SLUGS = new Set(["invoice-generator"]);

const NEW_SLUGS = new Set([
  "word-counter",
  "character-counter",
  "qr-code-generator",
  "password-generator",
  "pomodoro-timer",
  "case-converter",
  "random-number-generator",
  "invoice-generator",
  "typing-speed-test",
  "readability-checker",
  "markdown-to-html"
]);

const FEATURED_SLUGS = ["heic-to-jpg", "loan-emi-calculator", "resume-ats-checker"] as const;

const POPULAR_SLUGS = new Set([
  "merge-pdf",
  "compress-pdf",
  "image-compressor",
  "json-formatter",
  "bmi-calculator",
  "ai-resume-cover-letter",
  "word-counter",
  "qr-code-generator",
  "password-generator"
]);

const FEATURED_COPY: Record<(typeof FEATURED_SLUGS)[number], string> = {
  "heic-to-jpg": "iPhone users search for this constantly. No app needed.",
  "loan-emi-calculator": "India's most complete EMI calculator with prepayment.",
  "resume-ats-checker": "Match your resume to any job description. Free."
};

function getCatalogCategory(tool: Tool): CatalogCategory {
  if (WRITING_SLUGS.has(tool.slug)) return "Writing Tools";
  if (STUDENT_SLUGS.has(tool.slug)) return "Student Tools";
  if (DEV_EXTRA_SLUGS.has(tool.slug)) return "Developer Tools";
  if (CALC_EXTRA_SLUGS.has(tool.slug)) return "Calculator Tools";
  if (tool.category === "PDF Tools") return "PDF Tools";
  if (tool.category === "Image Tools") return "Image Tools";
  if (tool.category === "AI Tools") return "AI Tools";
  if (tool.category === "SEO Tools") return "SEO Tools";
  if (tool.category === "Developer Tools") return "Developer Tools";
  if (tool.category === "Calculator Tools") return "Calculator Tools";
  if (tool.category === "Student Tools") return "Student Tools";
  if (tool.category === "Text Tools") return "Writing Tools";
  return "AI Tools";
}

function getHub(tool: Tool, catalogCategory: CatalogCategory): string {
  return CATEGORY_HUBS[catalogCategory];
}

function privacyLabel(tier: PrivacyTier): string {
  if (tier === "ai") return "✦ AI powered";
  if (tier === "hybrid") return "⚡ Hybrid";
  return "🔒 Browser only";
}

function badgeCategoryFor(catalogCategory: CatalogCategory): string {
  const map: Record<CatalogCategory, string> = {
    "PDF Tools": "PDF Tools",
    "Image Tools": "Image Tools",
    "AI Tools": "AI Tools",
    "Writing Tools": "Text Tools",
    "SEO Tools": "SEO Tools",
    "Developer Tools": "Developer Tools",
    "Calculator Tools": "Calculator Tools",
    "Student Tools": "Student Tools"
  };
  return map[catalogCategory];
}

function buildToolsWithMeta(): ToolWithMeta[] {
  return tools.map((tool) => {
    const catalogCategory = getCatalogCategory(tool);
    const privacy = getToolPrivacyTier(tool);
    return {
      slug: tool.slug,
      name: tool.title,
      shortDesc: tool.description,
      category: tool.category,
      hub: getHub(tool, catalogCategory),
      privacy,
      isNew: NEW_SLUGS.has(tool.slug),
      isFeatured: FEATURED_SLUGS.includes(tool.slug as (typeof FEATURED_SLUGS)[number]),
      isPopular: POPULAR_SLUGS.has(tool.slug) || Boolean(tool.popular),
      catalogCategory,
      badgeCategory: badgeCategoryFor(catalogCategory)
    };
  });
}

const ALL_TOOLS_META = buildToolsWithMeta();
const TOTAL_TOOLS = ALL_TOOLS_META.length;

function SearchIcon() {
  return (
    <svg className="h-[18px] w-[18px] text-text-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" strokeLinecap="round" />
    </svg>
  );
}

function FeaturedCard({ tool }: { tool: ToolWithMeta }) {
  const copy = FEATURED_COPY[tool.slug as (typeof FEATURED_SLUGS)[number]] ?? tool.shortDesc;

  return (
    <Link
      href={`/${tool.slug}`}
      prefetch={false}
      className="group relative block overflow-hidden rounded-2xl border border-[rgba(245,166,35,0.3)] bg-bg2 bg-gradient-to-br from-[rgba(245,166,35,0.06)] to-transparent p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[rgba(245,166,35,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      <div className="flex items-center gap-2">
        <ToolBadge category={tool.badgeCategory} />
        <span className="ml-auto rounded-full bg-[rgba(245,166,35,0.15)] px-2 py-0.5 text-[10px] font-bold text-gold">Featured</span>
      </div>
      <h3 className="mt-3 font-heading text-[18px] font-bold text-text">{tool.name}</h3>
      <p className="mb-4 mt-2 flex-1 text-[13px] leading-relaxed text-text-2">{copy}</p>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-text-3">{privacyLabel(tool.privacy)}</span>
        <span className="text-gold opacity-0 transition-all duration-150 group-hover:translate-x-1 group-hover:opacity-100" aria-hidden="true">
          →
        </span>
      </div>
    </Link>
  );
}

function ToolGrid({ items }: { items: ToolWithMeta[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((tool) => (
        <ToolCard
          key={tool.slug}
          slug={tool.slug}
          name={tool.name}
          desc={tool.shortDesc}
          category={tool.badgeCategory}
          privacy={privacyLabel(tool.privacy)}
          variant="compact"
          isNew={tool.isNew}
          isPopular={tool.isPopular}
          accentColor={CATEGORY_COLORS[tool.catalogCategory]}
        />
      ))}
    </div>
  );
}

function CategoryHeader({
  category,
  count,
  showViewAll = true
}: {
  category: CatalogCategory;
  count: number;
  showViewAll?: boolean;
}) {
  return (
    <div className="mb-4 mt-8 flex items-center gap-2 first:mt-0 sm:mt-10 sm:gap-3">
      <Link
        href={CATEGORY_HUBS[category]}
        className="flex min-h-[44px] flex-1 items-center gap-2 sm:flex-none"
      >
        <span className="h-6 w-1 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[category] }} aria-hidden="true" />
        <h2 className="font-heading text-[15px] font-bold text-text sm:text-[18px]">{category}</h2>
        <span className="rounded-full border border-border bg-bg3 px-2.5 py-0.5 text-[11px] font-semibold text-text-3">
          {count} tools
        </span>
      </Link>
      <span className="hidden flex-1 sm:block" />
      {showViewAll ? (
        <GhostButton href={CATEGORY_HUBS[category]} className="hidden sm:inline-flex">
          View all →
        </GhostButton>
      ) : null}
    </div>
  );
}

export default function AllToolsPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    setSearchQuery(searchParams.get("q") ?? "");
    setActiveCategory(searchParams.get("cat") ?? "all");
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (activeCategory !== "all") params.set("cat", activeCategory);
    const next = params.toString();
    const current = searchParams.toString();
    if (next !== current) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
  }, [debouncedQuery, activeCategory, pathname, router, searchParams]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: TOTAL_TOOLS };
    for (const cat of CATALOG_ORDER) counts[cat] = 0;
    for (const tool of ALL_TOOLS_META) counts[tool.catalogCategory] += 1;
    return counts;
  }, []);

  const searchResults = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    return ALL_TOOLS_META.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.shortDesc.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q)
    );
  }, [debouncedQuery]);

  const groupedByCategory = useMemo(() => {
    return CATALOG_ORDER.map((category) => ({
      category,
      tools: ALL_TOOLS_META.filter((t) => t.catalogCategory === category)
    })).filter((group) => group.tools.length > 0);
  }, []);

  const categoryTools = useMemo(() => {
    if (activeCategory === "all") return ALL_TOOLS_META;
    return ALL_TOOLS_META.filter((t) => t.catalogCategory === activeCategory);
  }, [activeCategory]);

  const featuredTools = useMemo(
    () => FEATURED_SLUGS.map((slug) => ALL_TOOLS_META.find((t) => t.slug === slug)).filter((t): t is ToolWithMeta => Boolean(t)),
    []
  );

  const browserOnlyCount = useMemo(
    () => ALL_TOOLS_META.filter((t) => t.privacy === "local" || t.privacy === "client").length,
    []
  );

  const showSpotlight = !debouncedQuery && activeCategory === "all";
  const isSearching = debouncedQuery.length > 0;
  const isCategoryFilter = !isSearching && activeCategory !== "all";

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    if (value) setActiveCategory("all");
  }

  function handleCategoryClick(category: string) {
    setSearchQuery("");
    setDebouncedQuery("");
    setActiveCategory(category);
  }

  return (
    <main className="min-h-screen bg-bg pt-[60px]">
      {/* Zone 1 — Hero */}
      <section className="relative flex w-full flex-col items-center overflow-hidden px-4 pb-10 pt-10 text-center sm:px-6 md:py-16 md:pt-[60px]">
        <div
          className="pointer-events-none absolute left-1/2 top-0 hidden h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-gold opacity-[0.08] blur-[120px] md:block"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(245,166,35,0.25)] bg-[rgba(245,166,35,0.1)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.06em] text-gold sm:px-4 sm:text-[11px] sm:tracking-widest">
            {TOTAL_TOOLS} tools · free · no signup
          </span>
          <h1 className="mb-3 font-heading text-[clamp(26px,5vw,52px)] font-extrabold leading-tight tracking-tight text-text">
            All free tools in one place
          </h1>
          <p className="mx-auto mb-8 max-w-lg text-[14px] text-text-2 sm:text-[17px]">
            PDF, image, AI, writing, SEO, developer, and calculator tools. No signup. No upload for file tools. Just open and use.
          </p>

          <div className="relative mx-auto mb-6 w-full sm:max-w-xl">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={`Search ${TOTAL_TOOLS} tools — try "pdf", "compress", "emi"...`}
              className="min-h-[48px] w-full rounded-xl border border-border-hi bg-bg3 py-3.5 pl-12 pr-10 text-[16px] text-text placeholder:text-text-3 focus:border-gold focus:outline-none focus:ring-2 focus:ring-[rgba(245,166,35,0.15)] sm:pr-4 sm:text-[15px]"
              aria-label="Search tools"
            />
            {searchQuery.length > 0 ? (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-4 top-1/2 flex h-[44px] w-[44px] -translate-y-1/2 items-center justify-center text-[16px] text-text-3 transition hover:text-text"
                aria-label="Clear search"
              >
                ×
              </button>
            ) : null}
            {searchQuery.length > 0 ? (
              <p className="mt-2 text-[12px] text-text-3">
                {searchResults.length} tools match &ldquo;{searchQuery}&rdquo;
              </p>
            ) : null}
          </div>

          <div className="scrollbar-hide -mx-4 mt-4 flex gap-2 overflow-x-auto whitespace-nowrap px-4 pb-2 sm:-mx-6 sm:px-6 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0">
            <button
              type="button"
              onClick={() => handleCategoryClick("all")}
              className={`flex min-h-[40px] shrink-0 items-center rounded-full px-4 text-[13px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                activeCategory === "all"
                  ? "bg-gold font-bold text-[#0a0a0f]"
                  : "border border-border bg-bg3 text-text-2 hover:border-gold hover:text-text"
              }`}
            >
              All tools <span className="ml-1 opacity-70">{categoryCounts.all}</span>
            </button>
            {CATALOG_ORDER.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryClick(category)}
                className={`flex min-h-[40px] shrink-0 items-center rounded-full px-4 text-[13px] font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  activeCategory === category
                    ? "bg-gold font-bold text-[#0a0a0f]"
                    : "border border-border bg-bg3 text-text-2 hover:border-gold hover:text-text"
                }`}
              >
                {category} <span className="ml-1 opacity-70">{categoryCounts[category]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Zone 2 — Featured Spotlight */}
      {showSpotlight ? (
        <section className="container mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="text-sm text-gold" aria-hidden="true">
              ✦
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gold">Featured</span>
            <span className="h-px flex-1 bg-gradient-to-r from-[rgba(245,166,35,0.3)] to-transparent" aria-hidden="true" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {featuredTools.map((tool) => (
              <FeaturedCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Zone 3 — Stats bar */}
      {showSpotlight ? (
        <section className="border-y border-border bg-bg2 py-5">
          <div className="container mx-auto grid max-w-6xl grid-cols-3 gap-2 px-4 sm:grid-cols-5 sm:px-6">
            {[
              { value: String(TOTAL_TOOLS), label: "Free tools" },
              { value: "8", label: "Tool categories" },
              { value: "0", label: "Signups needed" },
              { value: `~${browserOnlyCount}`, label: "Browser-only tools", hideMobile: true },
              { value: "100%", label: "Free forever", hideMobile: true }
            ].map((stat) => (
              <div
                key={stat.label}
                className={`py-4 text-center ${"hideMobile" in stat && stat.hideMobile ? "hidden sm:block" : ""}`}
              >
                <p className="font-heading text-[18px] font-extrabold text-gold sm:text-[22px]">{stat.value}</p>
                <p className="mt-0.5 text-[10px] font-medium text-text-3 sm:text-[11px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Zone 4 — Tool catalog */}
      <section className="container mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {isSearching ? (
          <>
            <p className="mb-5 text-[14px] font-medium text-text-2">
              {searchResults.length} results for &ldquo;{debouncedQuery}&rdquo;
            </p>
            {searchResults.length > 0 ? (
              <ToolGrid items={searchResults} />
            ) : (
              <div className="px-4 py-12 text-center sm:py-16">
                <p className="text-[40px] sm:text-[48px]" aria-hidden="true">
                  🔍
                </p>
                <p className="mt-4 font-heading text-[18px] font-bold text-text sm:text-[20px]">No tools found for &ldquo;{debouncedQuery}&rdquo;</p>
                <p className="mt-2 text-[13px] text-text-2 sm:text-[14px]">
                  Try &ldquo;pdf&rdquo;, &ldquo;compress&rdquo;, &ldquo;calculator&rdquo;, or browse by category below.
                </p>
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="mt-6 flex min-h-[44px] items-center justify-center text-sm font-medium text-text-2 transition hover:text-gold"
                >
                  Clear search
                </button>
              </div>
            )}
          </>
        ) : isCategoryFilter ? (
          <>
            <div className="mb-6 flex items-center gap-3">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: CATEGORY_COLORS[activeCategory as CatalogCategory] }}
                aria-hidden="true"
              />
              <h2 className="font-heading text-[20px] font-bold text-text">{activeCategory}</h2>
              <span className="text-[14px] text-text-3">{categoryTools.length} tools</span>
            </div>
            <ToolGrid items={categoryTools} />
          </>
        ) : (
          groupedByCategory.map((group) => (
            <div key={group.category}>
              <CategoryHeader category={group.category} count={group.tools.length} />
              <ToolGrid items={group.tools} />
            </div>
          ))
        )}
      </section>

      {/* Zone 5 — Bottom CTA */}
      {!isSearching ? (
        <section className="container mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-bg2 p-8 text-center sm:p-10">
            <div
              className="pointer-events-none absolute left-1/2 top-0 h-[150px] w-[400px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(245,166,35,0.1)_0%,transparent_70%)]"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <h2 className="mb-2 font-heading text-[24px] font-extrabold text-text">Not finding what you need?</h2>
              <p className="mb-6 text-[14px] text-text-2">
                Suggest a tool at hello@freetoolkitapp.com — we add new tools regularly.
              </p>
              <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <PrimaryButton href="/" className="w-full min-h-[48px] sm:w-auto">
                  Go to homepage
                </PrimaryButton>
                <SecondaryButton href="/blog" className="w-full min-h-[48px] sm:w-auto">
                  Read the blog
                </SecondaryButton>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}

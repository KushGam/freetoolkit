"use client";

import { useMemo, useState } from "react";
import { ToolBadge } from "@/components/ui/ToolBadge";
import { ToolCard } from "@/components/ui/ToolCard";
import { getToolPrivacyTier } from "@/data/site-trust";
import { getTopLevelCategory, tools, type Tool } from "@/data/tools";

type FilterKey = "All" | "PDF" | "Image" | "AI" | "SEO" | "Developer" | "Calculators";

const filters: FilterKey[] = ["All", "PDF", "Image", "AI", "SEO", "Developer", "Calculators"];

function matchesFilter(tool: Tool, filter: FilterKey) {
  if (filter === "All") return true;
  if (filter === "PDF") return tool.category === "PDF Tools";
  if (filter === "Image") return tool.category === "Image Tools";
  if (filter === "AI") return tool.category === "AI Tools" || tool.category === "Student Tools" || tool.category === "Text Tools";
  if (filter === "SEO") return tool.category === "SEO Tools";
  if (filter === "Developer") return tool.category === "Developer Tools";
  if (filter === "Calculators") return tool.category === "Calculator Tools";
  return getTopLevelCategory(tool) === filter;
}

function privacyLabel(tool: Tool) {
  const tier = getToolPrivacyTier(tool);
  if (tier === "ai") return "✦ AI powered";
  if (tier === "hybrid") return "⚡ Hybrid";
  return "🔒 Browser only";
}

const groupOrder: Array<{ key: string; label: string; badgeCategory: string; match: (t: Tool) => boolean }> = [
  { key: "pdf", label: "PDF Tools", badgeCategory: "PDF Tools", match: (t) => t.category === "PDF Tools" },
  { key: "image", label: "Image Tools", badgeCategory: "Image Tools", match: (t) => t.category === "Image Tools" },
  { key: "ai", label: "AI Tools", badgeCategory: "AI Tools", match: (t) => t.category === "AI Tools" || t.category === "Student Tools" || t.category === "Text Tools" },
  { key: "seo", label: "SEO Tools", badgeCategory: "SEO Tools", match: (t) => t.category === "SEO Tools" },
  { key: "dev", label: "Developer Tools", badgeCategory: "Developer Tools", match: (t) => t.category === "Developer Tools" },
  { key: "calc", label: "Calculator Tools", badgeCategory: "Calculator Tools", match: (t) => t.category === "Calculator Tools" }
];

function SearchIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" strokeLinecap="round" />
    </svg>
  );
}

export function AllToolsSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<FilterKey>("All");

  const filtered = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return tools.filter((tool) => {
      const matchesCategory = matchesFilter(tool, filter);
      const haystack = `${tool.title} ${tool.category} ${tool.description} ${getTopLevelCategory(tool)}`.toLowerCase();
      const matchesQuery = !needle || haystack.includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [filter, query]);

  const grouped = useMemo(() => {
    return groupOrder
      .map((group) => ({
        ...group,
        tools: filtered.filter(group.match)
      }))
      .filter((group) => group.tools.length > 0);
  }, [filtered]);

  return (
    <div>
      <div className="relative mx-auto max-w-lg">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3">
          <SearchIcon />
        </span>
        <input
          id="all-tools-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search — try "heic to jpg" or "json formatter"'
          className="w-full rounded-xl border border-border-hi bg-bg3 py-3.5 pl-11 pr-4 text-sm text-text placeholder:text-text-3 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold-glow"
        />
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full px-4 py-1.5 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
              filter === item
                ? "bg-gold font-bold text-[#0a0a0f]"
                : "border border-border bg-bg3 text-text-2 hover:border-gold"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-12">
        {grouped.map((group) => (
          <section key={group.key} className="mb-14">
            <div className="mb-4 flex items-center gap-3">
              <ToolBadge category={group.badgeCategory} />
              <h2 className="font-heading text-base font-bold text-text">{group.label}</h2>
              <span className="text-[13px] text-text-3">{group.tools.length}</span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {group.tools.map((tool) => (
                <ToolCard
                  key={tool.slug}
                  slug={tool.slug}
                  name={tool.title}
                  desc={tool.description}
                  category={tool.category}
                  privacy={privacyLabel(tool)}
                />
              ))}
            </div>
          </section>
        ))}
        {!filtered.length ? (
          <p className="rounded-2xl border border-border bg-bg2 p-8 text-center text-text-2">
            No tools found. Try a broader search like PDF, image, or developer.
          </p>
        ) : null}
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { EmptyState, Input, ToolCard } from "@/components/ui";
import { getTopLevelCategory, tools, toolHref, topLevelCategories, type TopLevelCategory } from "@/data/tools";

export function AllToolsSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<TopLevelCategory | "All">("All");
  const filtered = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return tools.filter((tool) => {
      const topLevelCategory = getTopLevelCategory(tool);
      const matchesCategory = category === "All" || topLevelCategory === category;
      const matchesQuery = !needle || `${tool.title} ${tool.category} ${topLevelCategory} ${tool.description}`.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur">
        <label className="sr-only" htmlFor="all-tools-search">Search all tools</label>
        <Input
          id="all-tools-search"
          type="search"
          className="min-h-14 rounded-2xl text-base"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search AI, everyday, PDF, image, student, or developer tools..."
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm">
        {(["All", ...topLevelCategories] as Array<TopLevelCategory | "All">).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-full border px-4 py-2 text-sm font-bold transition ${category === item ? "border-brand-200 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-700"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-500">{filtered.length} tool{filtered.length === 1 ? "" : "s"} found</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => <ToolCard key={tool.slug} title={tool.title} description={tool.description} href={toolHref(tool)} category={tool.category} badge={tool.badge} />)}
      </div>
      {!filtered.length ? <div className="mt-6"><EmptyState title="No tools found" description="Try a broader search like PDF, image, GPA, text, or developer." /></div> : null}
    </div>
  );
}

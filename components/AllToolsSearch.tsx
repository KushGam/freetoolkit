"use client";

import { useMemo, useState } from "react";
import { ToolCard } from "@/components/ui";
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
      <input
        className="min-h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-base font-semibold shadow-[0_18px_45px_rgba(15,23,42,0.07)] outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search everyday, student, AI, or developer tools..."
      />
      <div className="mt-4 flex flex-wrap gap-2">
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
    </div>
  );
}

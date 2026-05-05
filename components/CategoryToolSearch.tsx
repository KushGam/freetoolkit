"use client";

import { useMemo, useState } from "react";
import { ToolCard } from "@/components/ui";
import { toolHref, type Tool } from "@/data/tools";

export function CategoryToolSearch({ tools }: { tools: Tool[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return tools;
    return tools.filter((tool) => `${tool.title} ${tool.description} ${tool.category}`.toLowerCase().includes(needle));
  }, [query, tools]);

  return (
    <div className="mt-8">
      <label className="sr-only" htmlFor="category-tool-search">Search this category</label>
      <input
        id="category-tool-search"
        className="min-h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.06)] outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search tools..."
        type="search"
      />
      <p className="mt-3 text-sm font-semibold text-slate-500">{filtered.length} tool{filtered.length === 1 ? "" : "s"} in this category</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => <ToolCard key={tool.slug} title={tool.title} description={tool.description} href={toolHref(tool)} category={tool.category} badge={tool.badge} />)}
      </div>
    </div>
  );
}

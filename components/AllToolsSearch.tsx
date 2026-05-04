"use client";

import { useMemo, useState } from "react";
import { ToolCard } from "@/components/ui";
import { tools } from "@/data/tools";

export function AllToolsSearch({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const filtered = useMemo(() => {
    const needle = query.toLowerCase().trim();
    if (!needle) return tools;
    return tools.filter((tool) => `${tool.title} ${tool.category} ${tool.description}`.toLowerCase().includes(needle));
  }, [query]);

  return (
    <div>
      <input
        className="min-h-14 w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 text-base font-semibold shadow-[0_18px_45px_rgba(15,23,42,0.07)] outline-none placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search image, PDF, and student tools..."
      />
      <p className="mt-3 text-sm font-semibold text-slate-500">{filtered.length} tool{filtered.length === 1 ? "" : "s"} found</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => <ToolCard key={tool.slug} title={tool.title} description={tool.description} href={`/${tool.slug}`} category={tool.category} />)}
      </div>
    </div>
  );
}

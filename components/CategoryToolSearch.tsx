"use client";

import { useMemo, useState } from "react";
import { EmptyState, Input, ToolCard } from "@/components/ui";
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
      <Input
        id="category-tool-search"
        className="min-h-14 rounded-2xl text-base"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search tools..."
        type="search"
      />
      <p className="mt-3 text-sm font-semibold text-slate-500">{filtered.length} tool{filtered.length === 1 ? "" : "s"} in this category</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => <ToolCard key={tool.slug} title={tool.title} description={tool.description} href={toolHref(tool)} category={tool.category} badge={tool.badge} />)}
      </div>
      {!filtered.length ? <div className="mt-6"><EmptyState title="No tools found in this category" description="Try a shorter keyword or browse the cards above after clearing search." /></div> : null}
    </div>
  );
}

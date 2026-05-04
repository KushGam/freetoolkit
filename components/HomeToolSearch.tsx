"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { tools } from "@/data/tools";

export function HomeToolSearch() {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return tools.filter((tool) => `${tool.title} ${tool.category} ${tool.description}`.toLowerCase().includes(needle)).slice(0, 4);
  }, [query]);

  return (
    <div className="relative z-10 mt-8 max-w-2xl">
      <label className="sr-only" htmlFor="home-tool-search">Search tools</label>
      <form action="/all-tools" className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_22px_50px_rgba(15,23,42,0.10)] sm:flex-row">
        <input
          id="home-tool-search"
          name="q"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools..."
          autoComplete="off"
          className="min-h-12 min-w-0 flex-1 rounded-xl bg-slate-50 px-4 text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-brand-100"
        />
        <button className="min-h-12 rounded-xl bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-brand-700" type="submit">
          Search
        </button>
      </form>
      {query.trim() ? (
        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          {matches.length ? (
            <div className="grid gap-2">
              {matches.map((tool) => (
                <Link key={tool.slug} href={`/${tool.slug}`} className="group flex items-center justify-between gap-4 rounded-xl px-3 py-3 hover:bg-brand-50">
                  <span>
                    <span className="block text-sm font-black text-slate-950 group-hover:text-brand-700">{tool.title}</span>
                    <span className="block text-xs font-semibold text-slate-500">{tool.category}</span>
                  </span>
                  <span className="text-sm font-black text-slate-300 group-hover:text-brand-700">→</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="px-3 py-2 text-sm font-semibold text-slate-500">No matching tools yet. Try “PDF”, “image”, “GPA”, or “word”.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}

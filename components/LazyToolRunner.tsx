"use client";

import dynamic from "next/dynamic";

const ToolRunner = dynamic(() => import("@/components/ToolRunner").then((module) => module.ToolRunner), {
  ssr: false,
  loading: () => <div className="min-h-64 rounded-2xl bg-slate-50" />
});

export function LazyToolRunner({ slug }: { slug: string }) {
  return <ToolRunner slug={slug} />;
}

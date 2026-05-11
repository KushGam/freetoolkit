"use client";

import dynamic from "next/dynamic";

const ToolRunner = dynamic(() => import("@/components/ToolRunner").then((module) => module.ToolRunner), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm font-semibold text-slate-600">
      Loading interactive tool workspace...
    </div>
  )
});

export function LazyToolRunner({ slug }: { slug: string }) {
  return <ToolRunner slug={slug} />;
}

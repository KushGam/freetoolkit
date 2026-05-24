"use client";

import dynamic from "next/dynamic";

const ToolRunner = dynamic(() => import("@/components/ToolRunner"), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl border border-white/[0.08] bg-surface-card px-4 py-5 text-sm font-semibold text-ink-muted">
      Loading interactive tool workspace...
    </div>
  )
});

export function LazyToolRunner({ slug }: { slug: string }) {
  return <ToolRunner slug={slug} />;
}

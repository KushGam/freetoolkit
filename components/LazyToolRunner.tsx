"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ToolRunner = dynamic(() => import("@/components/ToolRunner"), {
  ssr: false,
  loading: () => <ToolRunnerPlaceholder />
});

function ToolRunnerPlaceholder() {
  return (
    <div className="rounded-2xl border border-border bg-bg3 px-4 py-5 text-sm font-semibold text-text-2">
      Loading interactive tool workspace...
    </div>
  );
}

export function LazyToolRunner({ slug }: { slug: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ToolRunnerPlaceholder />;
  }

  return <ToolRunner slug={slug} />;
}

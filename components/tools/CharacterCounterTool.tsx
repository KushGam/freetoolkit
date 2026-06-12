"use client";

import { useMemo, useState } from "react";
import { SecondaryButton, Textarea } from "@/components/ui";
import { countWords } from "@/lib/text-analysis";

const PLATFORMS = [
  { name: "Twitter/X", limit: 280 },
  { name: "Instagram caption", limit: 2200 },
  { name: "SMS", limit: 160 },
  { name: "Meta description", limit: 155 },
  { name: "Meta title", limit: 60 },
  { name: "LinkedIn post", limit: 3000 },
  { name: "YouTube title", limit: 100 }
];

function barColor(pct: number, over: boolean) {
  if (over) return "bg-red-500";
  if (pct >= 90) return "bg-amber-500";
  return "bg-emerald-500";
}

export function CharacterCounterTool() {
  const [text, setText] = useState("");
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const words = countWords(text);
  const lines = text ? text.split(/\n/).length : 0;

  const bars = useMemo(
    () =>
      PLATFORMS.map((p) => {
        const pct = (chars / p.limit) * 100;
        return { ...p, pct: Math.min(100, pct), over: chars > p.limit };
      }),
    [chars]
  );

  return (
    <div>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type your text here..." className="min-h-48" />
      <div className="mt-4">
        <SecondaryButton onClick={() => setText("")}>Clear</SecondaryButton>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total characters", chars],
          ["Without spaces", charsNoSpaces],
          ["Words", words],
          ["Lines", lines]
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-2xl border border-white/[0.08] bg-surface-card p-4">
            <p className="text-xs font-black uppercase tracking-wide text-ink-muted">{label as string}</p>
            <p className="mt-2 text-2xl font-black text-ink-primary">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 space-y-4">
        {bars.map((bar) => (
          <div key={bar.name}>
            <div className="mb-1 flex justify-between text-sm font-semibold text-ink-secondary">
              <span>{bar.name}</span>
              <span className={bar.over ? "text-red-400" : ""}>
                {chars} / {bar.limit}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-card">
              <div className={`h-full rounded-full transition-all ${barColor(bar.pct, bar.over)}`} style={{ width: `${bar.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

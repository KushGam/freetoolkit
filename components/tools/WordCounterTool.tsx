"use client";

import { useMemo, useState } from "react";
import { Button, SecondaryButton, Textarea } from "@/components/ui";
import { countParagraphs, countSentences, countWords, keywordFrequency } from "@/lib/text-analysis";

export function WordCounterTool() {
  const [text, setText] = useState("");
  const [limitEnabled, setLimitEnabled] = useState(false);
  const [charLimit, setCharLimit] = useState(280);

  const words = countWords(text);
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = countSentences(text);
  const paragraphs = countParagraphs(text);
  const readingMin = words ? Math.ceil(words / 238) : 0;
  const keywords = useMemo(() => keywordFrequency(text), [text]);
  const overLimit = limitEnabled && chars > charLimit;
  const limitPct = limitEnabled && charLimit ? Math.min(100, (chars / charLimit) * 100) : 0;

  const stats = [
    ["Words", words],
    ["Characters", chars],
    ["Without spaces", charsNoSpaces],
    ["Sentences", sentences],
    ["Paragraphs", paragraphs],
    ["Reading time", words ? `${readingMin} min read` : "0 min read"]
  ];

  return (
    <div>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type your text here..." className="min-h-48" />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-ink-secondary">
          <input type="checkbox" checked={limitEnabled} onChange={(e) => setLimitEnabled(e.target.checked)} />
          Character limit
        </label>
        {limitEnabled ? (
          <input
            type="number"
            min={1}
            value={charLimit}
            onChange={(e) => setCharLimit(Number(e.target.value) || 280)}
            className="w-24 rounded-xl border border-white/[0.08] bg-surface-card px-3 py-2 text-sm text-ink-primary"
          />
        ) : null}
        <SecondaryButton onClick={() => setText("")}>Clear</SecondaryButton>
      </div>
      {limitEnabled ? (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs font-semibold text-ink-muted">
            <span>{chars} / {charLimit} characters</span>
            <span className={overLimit ? "text-red-400" : ""}>{overLimit ? "Over limit" : "Within limit"}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-card">
            <div className={`h-full rounded-full transition-all ${overLimit ? "bg-red-500" : limitPct >= 90 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${limitPct}%` }} />
          </div>
        </div>
      ) : null}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(([label, value]) => (
          <div key={label as string} className="rounded-2xl border border-white/[0.08] bg-surface-card p-4">
            <p className="text-xs font-black uppercase tracking-wide text-ink-muted">{label as string}</p>
            <p className="mt-2 text-2xl font-black text-ink-primary">{value}</p>
          </div>
        ))}
      </div>
      {keywords.length ? (
        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-surface-card p-4">
          <p className="text-xs font-black uppercase tracking-wide text-ink-muted">Top keywords</p>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="text-left text-ink-muted">
                <th className="pb-2">Word</th>
                <th className="pb-2">Count</th>
                <th className="pb-2">Density</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map(({ word, count }) => (
                <tr key={word} className="border-t border-white/[0.06] text-ink-secondary">
                  <td className="py-2 font-semibold">{word}</td>
                  <td className="py-2">{count}</td>
                  <td className="py-2">{words ? ((count / words) * 100).toFixed(1) : 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

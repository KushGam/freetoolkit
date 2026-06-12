"use client";

import { useState } from "react";
import { Button, Input, SecondaryButton, Textarea } from "@/components/ui";
import { secureRandomInt } from "@/lib/text-analysis";

type Tab = "range" | "multiple" | "dice" | "list";

function pickUnique(min: number, max: number, count: number) {
  const pool = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const results: number[] = [];
  for (let i = 0; i < count && pool.length; i++) {
    const idx = secureRandomInt(0, pool.length - 1);
    results.push(pool.splice(idx, 1)[0]);
  }
  return results;
}

function D6Face({ value }: { value: number }) {
  const dots: Record<number, number[]> = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
  };
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="rounded-lg border border-white/[0.12] bg-white">
      {dots[value]?.map((i) => (
        <circle key={i} cx={(i % 3) * 16 + 16} cy={Math.floor(i / 3) * 16 + 16} r="4" fill="#111" />
      ))}
    </svg>
  );
}

export function RandomNumberGeneratorTool() {
  const [tab, setTab] = useState<Tab>("range");
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(5);
  const [allowDupes, setAllowDupes] = useState(false);
  const [diceType, setDiceType] = useState(6);
  const [diceCount, setDiceCount] = useState(1);
  const [listText, setListText] = useState("");
  const [pickN, setPickN] = useState(1);
  const [result, setResult] = useState<number | null>(null);
  const [results, setResults] = useState<number[]>([]);
  const [history, setHistory] = useState<number[]>([]);
  const [listPick, setListPick] = useState<string[]>([]);

  function addHistory(n: number) {
    setHistory((h) => [n, ...h].slice(0, 10));
  }

  function generateRange() {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    const n = secureRandomInt(lo, hi);
    setResult(n);
    addHistory(n);
    setResults([]);
  }

  function generateMultiple() {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    const n = Math.max(1, count);
    if (!allowDupes && n > hi - lo + 1) return;
    const out = allowDupes ? Array.from({ length: n }, () => secureRandomInt(lo, hi)) : pickUnique(lo, hi, n);
    setResults(out);
    setResult(null);
  }

  function rollDice() {
    const sides = diceType;
    const rolls = Array.from({ length: Math.min(10, Math.max(1, diceCount)) }, () => secureRandomInt(1, sides));
    setResults(rolls);
    setResult(null);
  }

  function pickList(single: boolean) {
    const items = listText.split(/\n/).map((l) => l.trim()).filter(Boolean);
    if (!items.length) return;
    const n = single ? 1 : Math.min(pickN, items.length);
    const pool = [...items];
    const picked: string[] = [];
    for (let i = 0; i < n; i++) {
      const idx = secureRandomInt(0, pool.length - 1);
      picked.push(pool.splice(idx, 1)[0]);
    }
    setListPick(picked);
  }

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "range", label: "Number Range" },
    { id: "multiple", label: "Multiple Numbers" },
    { id: "dice", label: "Dice Roll" },
    { id: "list", label: "List Picker" }
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded-xl px-3 py-2 text-sm font-semibold ${tab === t.id ? "bg-gold text-[#0a0a0f]" : "border border-white/[0.08] bg-surface-card text-ink-secondary"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "range" ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-bold text-ink-secondary">Min <Input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} /></label>
          <label className="text-sm font-bold text-ink-secondary">Max <Input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} /></label>
          <Button onClick={generateRange}>Generate</Button>
        </div>
      ) : null}
      {tab === "multiple" ? (
        <div className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm font-bold text-ink-secondary">Min <Input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} /></label>
            <label className="text-sm font-bold text-ink-secondary">Max <Input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} /></label>
            <label className="text-sm font-bold text-ink-secondary">How many? <Input type="number" min={1} value={count} onChange={(e) => setCount(Number(e.target.value))} /></label>
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold text-ink-secondary">
            <input type="checkbox" checked={allowDupes} onChange={(e) => setAllowDupes(e.target.checked)} /> Allow duplicates
          </label>
          <Button onClick={generateMultiple}>Generate</Button>
        </div>
      ) : null}
      {tab === "dice" ? (
        <div className="mt-4 space-y-3">
          <label className="text-sm font-bold text-ink-secondary">
            Dice type
            <select className="input-dark mt-2 w-full" value={diceType} onChange={(e) => setDiceType(Number(e.target.value))}>
              {[4, 6, 8, 10, 12, 20, 100].map((d) => (
                <option key={d} value={d}>d{d}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-bold text-ink-secondary">Number of dice <Input type="number" min={1} max={10} value={diceCount} onChange={(e) => setDiceCount(Number(e.target.value))} /></label>
          <Button onClick={rollDice}>Roll</Button>
        </div>
      ) : null}
      {tab === "list" ? (
        <div className="mt-4 space-y-3">
          <Textarea value={listText} onChange={(e) => setListText(e.target.value)} placeholder="Enter items, one per line" />
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => pickList(true)}>Pick 1 random</Button>
            <Input type="number" min={1} className="w-24" value={pickN} onChange={(e) => setPickN(Number(e.target.value))} />
            <Button onClick={() => pickList(false)}>Pick N random</Button>
          </div>
        </div>
      ) : null}
      {result !== null ? (
        <div className="mt-6 rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-8 text-center">
          <p className="text-5xl font-black text-ink-primary">{result}</p>
        </div>
      ) : null}
      {results.length ? (
        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-surface-card p-5">
          <p className="text-sm font-bold text-ink-muted">Results {tab === "dice" ? `(total: ${results.reduce((a, b) => a + b, 0)})` : ""}</p>
          <div className="mt-3 flex flex-wrap gap-3">
            {results.map((r, i) => (
              <span key={`${r}-${i}`} className="inline-flex items-center rounded-xl bg-surface-section px-4 py-2 text-lg font-black text-ink-primary">
                {tab === "dice" && diceType === 6 ? <D6Face value={r} /> : r}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {listPick.length ? (
        <div className="mt-6 rounded-2xl border border-gold/30 bg-gold-glow p-5">
          <p className="text-sm font-bold text-gold">Picked</p>
          <ul className="mt-2 space-y-1 text-ink-primary">
            {listPick.map((item) => (
              <li key={item} className="font-semibold">{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {history.length && tab === "range" ? (
        <div className="mt-6">
          <p className="text-xs font-black uppercase text-ink-muted">Last 10 results</p>
          <p className="mt-2 text-sm text-ink-secondary">{history.join(", ")}</p>
        </div>
      ) : null}
      <SecondaryButton className="mt-4" onClick={() => { setResult(null); setResults([]); setListPick([]); setHistory([]); }}>
        Clear
      </SecondaryButton>
    </div>
  );
}

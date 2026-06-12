"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, SecondaryButton } from "@/components/ui";

const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?/";

function scorePassword(length: number, pools: number) {
  if (length < 8) return "Very Weak";
  const score = (length >= 12 ? 1 : 0) + (length >= 16 ? 1 : 0) + (length >= 20 ? 1 : 0) + pools;
  if (score <= 2) return "Weak";
  if (score <= 4) return "Fair";
  if (score <= 6) return "Strong";
  return "Very Strong";
}

function generatePassword(length: number, upper: boolean, lower: boolean, numbers: boolean, symbols: boolean) {
  const pools = [upper ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "", lower ? "abcdefghijklmnopqrstuvwxyz" : "", numbers ? "0123456789" : "", symbols ? SYMBOLS : ""].filter(Boolean);
  if (!pools.length) return "";
  const all = pools.join("");
  const bytes = new Uint32Array(length);
  crypto.getRandomValues(bytes);
  let result = Array.from(bytes, (b) => all[b % all.length]).join("");
  const required = [upper ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "", lower ? "abcdefghijklmnopqrstuvwxyz" : "", numbers ? "0123456789" : "", symbols ? SYMBOLS : ""].filter(Boolean);
  required.forEach((pool, i) => {
    if (i < result.length) {
      const rb = new Uint32Array(1);
      crypto.getRandomValues(rb);
      result = result.slice(0, i) + pool[rb[0] % pool.length] + result.slice(i + 1);
    }
  });
  return result;
}

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [batch, setBatch] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const pools = [upper, lower, numbers, symbols].filter(Boolean).length;
  const strength = password ? scorePassword(length, pools) : "";

  const generate = useCallback(() => {
    if (!pools) {
      setError("Choose at least one character type.");
      return;
    }
    setError("");
    setPassword(generatePassword(length, upper, lower, numbers, symbols));
    setBatch([]);
  }, [length, upper, lower, numbers, symbols, pools]);

  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial password on mount only
  }, []);

  async function copy() {
    if (!password) return;
    await navigator.clipboard?.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function generateBatch() {
    if (!pools) {
      setError("Choose at least one character type.");
      return;
    }
    setError("");
    setBatch(Array.from({ length: 5 }, () => generatePassword(length, upper, lower, numbers, symbols)));
  }

  return (
    <div>
      <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5">
        <p className="text-xs font-black uppercase tracking-wide text-ink-muted">Generated password</p>
        <p className="mt-2 break-all font-mono text-2xl font-black text-ink-primary">{password || "—"}</p>
        {strength ? <p className="mt-2 text-sm font-bold text-indigo-400">Strength: {strength}</p> : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={generate}>Generate new</Button>
        <SecondaryButton onClick={() => void copy()} disabled={!password}>
          {copied ? "Copied!" : "Copy"}
        </SecondaryButton>
        <SecondaryButton onClick={generateBatch}>Generate 5 passwords</SecondaryButton>
      </div>
      <label className="mt-5 block text-sm font-bold text-ink-secondary">
        Length: {length}
        <input className="mt-2 w-full accent-gold" type="range" min={8} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} />
      </label>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          ["Uppercase letters (A–Z)", upper, setUpper],
          ["Lowercase letters (a–z)", lower, setLower],
          ["Numbers (0–9)", numbers, setNumbers],
          ["Symbols (!@#$…)", symbols, setSymbols]
        ].map(([label, checked, setter]) => (
          <label key={label as string} className="rounded-2xl border border-white/[0.08] bg-surface-card p-4 text-sm font-bold text-ink-secondary">
            <input className="mr-2" type="checkbox" checked={checked as boolean} onChange={(e) => (setter as (v: boolean) => void)(e.target.checked)} />
            {label as string}
          </label>
        ))}
      </div>
      {batch.length ? (
        <ul className="mt-5 space-y-2">
          {batch.map((p) => (
            <li key={p} className="break-all rounded-xl bg-surface-card p-3 font-mono text-sm text-ink-secondary">
              {p}
            </li>
          ))}
        </ul>
      ) : null}
      <p className="mt-4 text-xs font-semibold text-emerald-400">Generated using crypto.getRandomValues() — never sent to any server.</p>
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}

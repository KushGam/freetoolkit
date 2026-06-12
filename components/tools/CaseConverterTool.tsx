"use client";

import { useMemo, useState } from "react";
import { SecondaryButton, Textarea } from "@/components/ui";
import { countWords } from "@/lib/text-analysis";

type CaseMode = "upper" | "lower" | "title" | "sentence" | "camel" | "pascal" | "snake" | "kebab";

function toTitleCase(value: string) {
  return value.toLowerCase().replace(/\b[a-z0-9]/gi, (c) => c.toUpperCase());
}

function toSentenceCase(value: string) {
  return value.toLowerCase().replace(/(^\s*[a-z])|([.!?]\s+[a-z])/gi, (m) => m.toUpperCase());
}

function wordsToParts(value: string) {
  return value.trim().split(/[\s_\-\n]+/).filter(Boolean);
}

function convert(mode: CaseMode, input: string) {
  if (!input) return "";
  if (mode === "upper") return input.toUpperCase();
  if (mode === "lower") return input.toLowerCase();
  if (mode === "title") return toTitleCase(input);
  if (mode === "sentence") return toSentenceCase(input);
  const parts = wordsToParts(input).map((w) => w.replace(/[^a-zA-Z0-9]/g, ""));
  if (mode === "camel") return parts.map((w, i) => (i ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase())).join("");
  if (mode === "pascal") return parts.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("");
  if (mode === "snake") return parts.map((w) => w.toLowerCase()).join("_");
  return parts.map((w) => w.toLowerCase()).join("-");
}

const MODES: Array<{ id: CaseMode; label: string }> = [
  { id: "upper", label: "UPPER CASE" },
  { id: "lower", label: "lower case" },
  { id: "title", label: "Title Case" },
  { id: "sentence", label: "Sentence case" },
  { id: "camel", label: "camelCase" },
  { id: "pascal", label: "PascalCase" },
  { id: "snake", label: "snake_case" },
  { id: "kebab", label: "kebab-case" }
];

export function CaseConverterTool() {
  const [text, setText] = useState("");
  const [active, setActive] = useState<CaseMode | null>(null);
  const words = useMemo(() => countWords(text), [text]);
  const chars = text.length;

  function apply(mode: CaseMode) {
    setText(convert(mode, text));
    setActive(mode);
  }

  return (
    <div>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste your text here..." className="min-h-48" />
      <div className="mt-4 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => apply(m.id)}
            disabled={!text}
            className={`rounded-xl px-3 py-2 text-xs font-bold sm:text-sm ${active === m.id ? "bg-gold text-[#0a0a0f]" : "border border-white/[0.08] bg-surface-card text-ink-secondary"} disabled:opacity-40`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <SecondaryButton onClick={() => navigator.clipboard?.writeText(text)} disabled={!text}>
          Copy
        </SecondaryButton>
        <SecondaryButton onClick={() => { setText(""); setActive(null); }}>Clear</SecondaryButton>
      </div>
      <p className="mt-3 text-sm text-ink-muted">{words} words · {chars} characters</p>
    </div>
  );
}

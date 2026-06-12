"use client";

import { useEffect, useState } from "react";
import { Button, SecondaryButton, Textarea } from "@/components/ui";

const SAMPLE = `# Markdown Demo

## Features
- **Bold** and *italic* text
- \`inline code\` and fenced blocks
- [Links](https://example.com)

> Blockquote for emphasis

| Col A | Col B |
|-------|-------|
| One   | Two   |

---

\`\`\`js
console.log("Hello");
\`\`\`
`;

export function MarkdownToHtmlTool() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const [view, setView] = useState<"preview" | "html">("preview");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function convert() {
      if (!markdown.trim()) {
        setHtml("");
        return;
      }
      try {
        const { marked } = await import("marked");
        const out = await marked.parse(markdown, { gfm: true, breaks: true });
        if (!cancelled) {
          setHtml(typeof out === "string" ? out : String(out));
          setError("");
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Conversion failed.");
      }
    }
    void convert();
    return () => {
      cancelled = true;
    };
  }, [markdown]);

  function downloadHtml() {
    const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>export</title></head><body>${html}</body></html>`;
    const blob = new Blob([doc], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Button onClick={() => setMarkdown(SAMPLE)}>Sample Markdown</Button>
        <SecondaryButton onClick={() => { setMarkdown(""); setHtml(""); }}>Clear</SecondaryButton>
        <SecondaryButton onClick={() => navigator.clipboard?.writeText(html)} disabled={!html}>
          Copy HTML
        </SecondaryButton>
        <SecondaryButton onClick={downloadHtml} disabled={!html}>
          Download .html
        </SecondaryButton>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <p className="mb-2 text-xs font-black uppercase text-ink-muted">Markdown</p>
          <Textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} className="min-h-80 font-mono text-sm" placeholder="# Heading..." />
          <p className="mt-2 text-xs text-ink-muted">{markdown.length} characters</p>
        </div>
        <div>
          <div className="mb-2 flex gap-2">
            <button type="button" onClick={() => setView("preview")} className={`rounded-lg px-3 py-1 text-sm font-semibold ${view === "preview" ? "bg-gold text-[#0a0a0f]" : "text-ink-secondary"}`}>
              Preview
            </button>
            <button type="button" onClick={() => setView("html")} className={`rounded-lg px-3 py-1 text-sm font-semibold ${view === "html" ? "bg-gold text-[#0a0a0f]" : "text-ink-secondary"}`}>
              HTML
            </button>
          </div>
          {view === "preview" ? (
            <div className="prose-site min-h-80 rounded-xl border border-white/[0.08] bg-surface-card p-4" dangerouslySetInnerHTML={{ __html: html }} />
          ) : (
            <Textarea readOnly value={html} className="min-h-80 font-mono text-xs" />
          )}
        </div>
      </div>
      {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
    </div>
  );
}

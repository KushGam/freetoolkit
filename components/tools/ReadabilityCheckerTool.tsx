"use client";

import { useState } from "react";
import { Button, SecondaryButton, Textarea } from "@/components/ui";
import { complexWordCount, countParagraphs, countSentences, countSyllables, countWords, polysyllableCount, totalSyllables } from "@/lib/text-analysis";

type Scores = {
  flesch: number;
  fleschLabel: string;
  fleschColor: string;
  fkGrade: number;
  fog: number;
  smog: number;
  words: number;
  sentences: number;
  paragraphs: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  suggestions: string[];
};

function fleschLabel(score: number) {
  if (score >= 90) return "Very Easy";
  if (score >= 80) return "Easy";
  if (score >= 70) return "Fairly Easy";
  if (score >= 60) return "Standard";
  if (score >= 50) return "Fairly Difficult";
  if (score >= 30) return "Difficult";
  return "Very Difficult";
}

function fleschColor(score: number) {
  if (score >= 60) return "text-emerald-400";
  if (score >= 30) return "text-amber-400";
  return "text-red-400";
}

function analyze(text: string): Scores | null {
  const words = countWords(text);
  const sentences = countSentences(text);
  if (words < 10 || sentences < 1) return null;

  const syllables = totalSyllables(text);
  const avgWordsPerSentence = words / sentences;
  const avgSyllablesPerWord = syllables / words;
  const complex = complexWordCount(text);
  const poly = polysyllableCount(text);

  const flesch = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  const fkGrade = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
  const fog = 0.4 * (avgWordsPerSentence + 100 * (complex / words));
  const smog = 3 + Math.sqrt(poly * (30 / sentences));

  const suggestions: string[] = [];
  if (fkGrade > 12) suggestions.push(`Consider shortening sentences (current avg: ${avgWordsPerSentence.toFixed(1)} words).`);
  if (avgSyllablesPerWord > 1.7) suggestions.push("Use simpler words where possible.");
  if (avgWordsPerSentence > 20) suggestions.push("Break up long sentences for easier reading.");

  return {
    flesch: Math.max(0, Math.min(100, flesch)),
    fleschLabel: fleschLabel(flesch),
    fleschColor: fleschColor(flesch),
    fkGrade: Math.max(0, fkGrade),
    fog: Math.max(0, fog),
    smog: Math.max(0, smog),
    words,
    sentences,
    paragraphs: countParagraphs(text),
    avgWordsPerSentence,
    avgSyllablesPerWord,
    suggestions
  };
}

export function ReadabilityCheckerTool() {
  const [text, setText] = useState("");
  const [scores, setScores] = useState<Scores | null>(null);

  function check() {
    setScores(analyze(text));
  }

  return (
    <div>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your text here — minimum 100 words for accurate scores" className="min-h-48" />
      <div className="mt-4 flex gap-3">
        <Button onClick={check}>Check Readability</Button>
        <SecondaryButton onClick={() => { setText(""); setScores(null); }}>Clear</SecondaryButton>
      </div>
      {scores ? (
        <div className="mt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5">
              <p className="text-xs font-black uppercase text-ink-muted">Flesch Reading Ease</p>
              <p className={`mt-2 text-3xl font-black ${scores.fleschColor}`}>{scores.flesch.toFixed(1)}</p>
              <p className="text-sm text-ink-secondary">{scores.fleschLabel}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5">
              <p className="text-xs font-black uppercase text-ink-muted">Flesch-Kincaid Grade</p>
              <p className="mt-2 text-3xl font-black text-ink-primary">Grade {scores.fkGrade.toFixed(1)}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5">
              <p className="text-xs font-black uppercase text-ink-muted">Gunning Fog Index</p>
              <p className="mt-2 text-3xl font-black text-ink-primary">{scores.fog.toFixed(1)}</p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5">
              <p className="text-xs font-black uppercase text-ink-muted">SMOG Grade</p>
              <p className="mt-2 text-3xl font-black text-ink-primary">{scores.smog.toFixed(1)}</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-4 text-sm text-ink-secondary">
            <p>Words: {scores.words} · Sentences: {scores.sentences} · Paragraphs: {scores.paragraphs}</p>
            <p className="mt-1">Avg words/sentence: {scores.avgWordsPerSentence.toFixed(1)} · Avg syllables/word: {scores.avgSyllablesPerWord.toFixed(2)}</p>
          </div>
          {scores.suggestions.length ? (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
              <p className="text-xs font-black uppercase text-amber-400">Suggestions</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-secondary">
                {scores.suggestions.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : text.length > 20 ? (
        <p className="mt-4 text-sm text-ink-muted">Add more text (100+ words recommended) and click Check Readability.</p>
      ) : null}
    </div>
  );
}

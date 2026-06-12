"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, SecondaryButton } from "@/components/ui";

const PARAGRAPHS = [
  "Productivity begins with small habits repeated every day. When you sit down to work, remove distractions and focus on one task at a time. Clear goals help you measure progress and stay motivated through long projects.",
  "Technology connects people across continents in seconds. Modern browsers run powerful tools that once required desktop software. Learning keyboard shortcuts and typing efficiently saves hours each week for students and professionals.",
  "Nature offers quiet lessons in patience and balance. Trees grow slowly but stand for decades. Rivers find paths around obstacles without forcing their way. A short walk outside can reset your mind before difficult work.",
  "Cooking simple meals at home is faster than many people expect. Fresh ingredients, a sharp knife, and a hot pan are enough for a satisfying dinner. Planning meals ahead reduces waste and makes grocery shopping easier.",
  "Travel broadens perspective even when destinations are nearby. New streets, languages, and customs remind us how large the world is. Packing light, arriving early, and keeping copies of documents prevent common travel stress."
];

const DURATIONS = [1, 2, 3, 5];

function rating(wpm: number) {
  if (wpm < 30) return "Beginner";
  if (wpm < 50) return "Average";
  if (wpm < 70) return "Good";
  if (wpm < 100) return "Fast";
  return "Expert";
}

export function TypingSpeedTestTool() {
  const [duration, setDuration] = useState(1);
  const [paragraph, setParagraph] = useState(PARAGRAPHS[0]);
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [errors, setErrors] = useState(0);
  const startTime = useRef<number | null>(null);

  const target = paragraph;
  const correctChars = useMemo(() => {
    let c = 0;
    for (let i = 0; i < typed.length; i++) if (typed[i] === target[i]) c++;
    return c;
  }, [typed, target]);

  const grossWpm = useMemo(() => {
    if (!started || !startTime.current) return 0;
    const elapsed = (duration * 60 - timeLeft) / 60;
    if (elapsed <= 0) return 0;
    return Math.round((typed.length / 5) / elapsed);
  }, [typed.length, timeLeft, duration, started]);

  const accuracy = typed.length ? Math.round((correctChars / typed.length) * 100) : 100;
  const netWpm = Math.round(grossWpm * (accuracy / 100));

  const reset = useCallback((newDuration?: number) => {
    const d = newDuration ?? duration;
    setParagraph(PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)]);
    setTyped("");
    setStarted(false);
    setFinished(false);
    setTimeLeft(d * 60);
    setErrors(0);
    startTime.current = null;
  }, [duration]);

  useEffect(() => {
    if (!started || finished) return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setFinished(true);
          setStarted(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [started, finished]);

  function onType(value: string) {
    if (finished) return;
    if (!started) {
      setStarted(true);
      startTime.current = Date.now();
    }
    let err = 0;
    for (let i = 0; i < value.length; i++) if (value[i] !== target[i]) err++;
    setErrors(err);
    setTyped(value);
  }

  const mm = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const ss = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {DURATIONS.map((d) => (
          <button key={d} type="button" onClick={() => { setDuration(d); reset(d); }} className={`rounded-xl px-4 py-2 text-sm font-semibold ${duration === d ? "bg-gold text-[#0a0a0f]" : "border border-white/[0.08] bg-surface-card text-ink-secondary"}`}>
            {d} min
          </button>
        ))}
      </div>
      {!finished ? (
        <>
          <p className="mt-4 rounded-xl border border-white/[0.08] bg-surface-card p-4 text-sm leading-relaxed text-ink-secondary">
            {target.split("").map((ch, i) => (
              <span key={i} className={i < typed.length ? (typed[i] === ch ? "text-emerald-400" : "text-red-400 bg-red-500/10") : i === typed.length ? "underline decoration-gold" : ""}>
                {ch}
              </span>
            ))}
          </p>
          <textarea
            className="input-dark mt-4 min-h-24 w-full"
            value={typed}
            onChange={(e) => onType(e.target.value)}
            placeholder="Start typing here…"
            disabled={finished}
          />
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-ink-secondary">
            <span>Time: {mm}:{ss}</span>
            <span>Gross WPM: {grossWpm}</span>
            <span>Accuracy: {accuracy}%</span>
            <span>Errors: {errors}</span>
          </div>
        </>
      ) : (
        <div className="mt-6 rounded-2xl border border-gold/30 bg-gold-glow p-6">
          <p className="text-xs font-black uppercase text-gold">Results</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <p>Gross WPM: <strong>{grossWpm}</strong></p>
            <p>Net WPM: <strong>{netWpm}</strong></p>
            <p>Accuracy: <strong>{accuracy}%</strong></p>
            <p>Errors: <strong>{errors}</strong></p>
            <p>Characters typed: <strong>{typed.length}</strong></p>
            <p>Rating: <strong>{rating(netWpm)}</strong></p>
          </div>
          <Button className="mt-4" onClick={() => reset()}>Try Again</Button>
        </div>
      )}
      <SecondaryButton className="mt-4" onClick={() => reset()}>Reset test</SecondaryButton>
    </div>
  );
}

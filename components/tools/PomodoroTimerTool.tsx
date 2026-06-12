"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Input, SecondaryButton } from "@/components/ui";

type Mode = "work" | "short" | "long";

function playBeep() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.value = 0.15;
    osc.start();
    setTimeout(() => {
      osc.stop();
      void ctx.close();
    }, 400);
  } catch {
    // Audio may be blocked until user interaction
  }
}

export function PomodoroTimerTool() {
  const [workMin, setWorkMin] = useState(25);
  const [shortMin, setShortMin] = useState(5);
  const [longMin, setLongMin] = useState(15);
  const [mode, setMode] = useState<Mode>("work");
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [todaySessions, setTodaySessions] = useState(0);
  const [autoStart, setAutoStart] = useState(false);
  const originalTitle = useRef("");

  const modeMinutes = mode === "work" ? workMin : mode === "short" ? shortMin : longMin;
  const total = modeMinutes * 60;

  const switchMode = useCallback(
    (next: Mode, autoRun = false) => {
      setMode(next);
      setSeconds((next === "work" ? workMin : next === "short" ? shortMin : longMin) * 60);
      if (autoRun) setRunning(true);
      else setRunning(false);
    },
    [workMin, shortMin, longMin]
  );

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds((s) => {
        if (s > 1) return s - 1;
        playBeep();
        if (mode === "work") {
          const nextCount = sessions + 1;
          setSessions(nextCount);
          setTodaySessions((d) => d + 1);
          const nextMode: Mode = nextCount % 4 === 0 ? "long" : "short";
          switchMode(nextMode, autoStart);
          return (nextMode === "long" ? longMin : shortMin) * 60;
        }
        switchMode("work", autoStart);
        return workMin * 60;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, mode, sessions, autoStart, switchMode, workMin, shortMin, longMin]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!originalTitle.current) originalTitle.current = document.title;
    const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    const label = mode === "work" ? "Work" : mode === "short" ? "Short Break" : "Long Break";
    document.title = running ? `${mm}:${ss} — ${label}` : originalTitle.current;
    return () => {
      document.title = originalTitle.current;
    };
  }, [seconds, running, mode]);

  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");
  const progress = total ? ((total - seconds) / total) * 100 : 0;
  const sessionLabel = `Session ${(sessions % 4) + 1} of 4`;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {([
          ["work", "Work", workMin],
          ["short", "Short Break", shortMin],
          ["long", "Long Break", longMin]
        ] as const).map(([id, label, min]) => (
          <button
            key={id}
            type="button"
            onClick={() => switchMode(id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${mode === id ? "bg-gold text-[#0a0a0f]" : "border border-white/[0.08] bg-surface-card text-ink-secondary"}`}
          >
            {label} ({min}m)
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-sm font-bold text-ink-secondary">Work min <Input type="number" min={1} value={workMin} onChange={(e) => setWorkMin(Number(e.target.value) || 25)} /></label>
        <label className="text-sm font-bold text-ink-secondary">Short break <Input type="number" min={1} value={shortMin} onChange={(e) => setShortMin(Number(e.target.value) || 5)} /></label>
        <label className="text-sm font-bold text-ink-secondary">Long break <Input type="number" min={1} value={longMin} onChange={(e) => setLongMin(Number(e.target.value) || 15)} /></label>
      </div>
      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-surface-card p-8 text-center">
        <p className="text-sm font-black uppercase tracking-wide text-gold">{sessionLabel}</p>
        <p className="mt-2 text-6xl font-black tabular-nums text-ink-primary">{mm}:{ss}</p>
        <div className="mx-auto mt-5 h-3 max-w-md overflow-hidden rounded-full bg-surface-section">
          <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button onClick={() => setRunning(true)}>Start</Button>
          <SecondaryButton onClick={() => setRunning(false)}>Pause</SecondaryButton>
          <SecondaryButton onClick={() => { setRunning(false); switchMode(mode); setSessions(0); }}>Reset</SecondaryButton>
        </div>
        <label className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink-secondary">
          <input type="checkbox" checked={autoStart} onChange={(e) => setAutoStart(e.target.checked)} />
          Auto-start next session
        </label>
        <p className="mt-3 text-sm text-ink-muted">Completed today: {todaySessions} pomodoros</p>
      </div>
    </div>
  );
}

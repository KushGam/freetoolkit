"use client";

import { useMemo, useState } from "react";
import { Button, Input, SecondaryButton, Select } from "@/components/ui";

const breakOptions = [0, 15, 30, 45, 60, 90];
const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type DayRow = {
  enabled: boolean;
  day: string;
  start: string;
  end: string;
  breakMins: number;
};

function calculateHours(start: string, end: string, breakMins: number): number {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let startMins = sh * 60 + sm;
  let endMins = eh * 60 + em;
  if (endMins <= startMins) endMins += 24 * 60; // overnight shift
  const worked = endMins - startMins - breakMins;
  return Math.max(0, worked / 60);
}

function formatHours(decimal: number): string {
  const h = Math.floor(decimal);
  const m = Math.round((decimal - h) * 60);
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

function emptyWeek(): DayRow[] {
  return dayNames.map((day, index) => ({
    enabled: index < 5,
    day,
    start: "09:00",
    end: "17:00",
    breakMins: 30
  }));
}

function ResultBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-words text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

export function ShiftHoursCalculator() {
  const [singleStart, setSingleStart] = useState("09:00");
  const [singleEnd, setSingleEnd] = useState("17:00");
  const [singleBreak, setSingleBreak] = useState(30);
  const [rows, setRows] = useState<DayRow[]>(emptyWeek);
  const [hourlyRate, setHourlyRate] = useState("");
  const [copied, setCopied] = useState(false);

  const singleTotal = calculateHours(singleStart, singleEnd, singleBreak);
  const weeklyTotal = useMemo(
    () => rows.reduce((total, row) => total + (row.enabled ? calculateHours(row.start, row.end, row.breakMins) : 0), 0),
    [rows]
  );
  const rate = Number(hourlyRate);
  const grossPay = Number.isFinite(rate) && rate > 0 ? weeklyTotal * rate : 0;

  function updateRow(index: number, next: Partial<DayRow>) {
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, ...next } : row)));
  }

  async function copySummary() {
    const lines = [
      "Shift Hours Calculator summary",
      `Single shift: ${formatHours(singleTotal)}`,
      `Weekly total: ${formatHours(weeklyTotal)}`,
      grossPay ? `Estimated gross pay (before tax): $${grossPay.toFixed(2)} AUD` : "",
      "",
      ...rows
        .filter((row) => row.enabled)
        .map((row) => `${row.day}: ${row.start} to ${row.end}, break ${row.breakMins} mins, ${formatHours(calculateHours(row.start, row.end, row.breakMins))}`)
    ].filter(Boolean);

    await navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  function resetAll() {
    setSingleStart("09:00");
    setSingleEnd("17:00");
    setSingleBreak(30);
    setRows(emptyWeek());
    setHourlyRate("");
    setCopied(false);
  }

  return (
    <div className="grid gap-6">
      <section>
        <h3 className="text-lg font-black tracking-tight text-slate-950">Single shift</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="text-sm font-bold text-slate-700">Start time <Input className="mt-2" type="time" value={singleStart} onChange={(event) => setSingleStart(event.target.value)} /></label>
          <label className="text-sm font-bold text-slate-700">End time <Input className="mt-2" type="time" value={singleEnd} onChange={(event) => setSingleEnd(event.target.value)} /></label>
          <label className="text-sm font-bold text-slate-700">
            Break duration
            <Select className="mt-2" value={singleBreak} onChange={(event) => setSingleBreak(Number(event.target.value))}>
              {breakOptions.map((mins) => <option key={mins} value={mins}>{mins} minutes</option>)}
            </Select>
          </label>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ResultBox label="Single shift total" value={formatHours(singleTotal)} />
          <ResultBox label="Decimal hours" value={singleTotal.toFixed(2)} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-lg font-black tracking-tight text-slate-950">Weekly timesheet</h3>
        <div className="mt-4 grid gap-3">
          {rows.map((row, index) => {
            const rowHours = row.enabled ? calculateHours(row.start, row.end, row.breakMins) : 0;
            return (
              <div key={row.day} className={`grid gap-3 rounded-2xl border p-3 transition md:grid-cols-[72px_1fr_1fr_1fr_96px] md:items-center ${row.enabled ? "border-slate-200 bg-slate-50" : "border-slate-100 bg-slate-50/60 opacity-60"}`}>
                <label className="flex items-center gap-2 text-sm font-black text-slate-700">
                  <input className="h-4 w-4 accent-brand-600" type="checkbox" checked={row.enabled} onChange={(event) => updateRow(index, { enabled: event.target.checked })} />
                  {row.day}
                </label>
                <Input type="time" value={row.start} disabled={!row.enabled} onChange={(event) => updateRow(index, { start: event.target.value })} />
                <Input type="time" value={row.end} disabled={!row.enabled} onChange={(event) => updateRow(index, { end: event.target.value })} />
                <Select value={row.breakMins} disabled={!row.enabled} onChange={(event) => updateRow(index, { breakMins: Number(event.target.value) })}>
                  {breakOptions.map((mins) => <option key={mins} value={mins}>{mins} min break</option>)}
                </Select>
                <p className="rounded-xl bg-white px-3 py-2 text-sm font-black text-slate-800 shadow-sm">{formatHours(rowHours)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-black tracking-tight text-slate-950">Pay estimator</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-slate-700">Hourly rate ($ AUD) <Input className="mt-2" type="number" min={0} step={0.01} value={hourlyRate} onChange={(event) => setHourlyRate(event.target.value)} placeholder="30.00" /></label>
          <ResultBox label="Estimated gross pay (before tax)" value={grossPay ? `$${grossPay.toFixed(2)} AUD` : "$0.00 AUD"} />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <ResultBox label="Total hours" value={formatHours(weeklyTotal)} />
        <ResultBox label="Gross pay" value={grossPay ? `$${grossPay.toFixed(2)} AUD` : "Add hourly rate"} />
        <ResultBox label="Enabled days" value={`${rows.filter((row) => row.enabled).length} days`} />
      </section>

      <div className="flex flex-wrap gap-3">
        <Button onClick={copySummary}>{copied ? "Copied" : "Copy summary"}</Button>
        <SecondaryButton onClick={resetAll}>Reset all</SecondaryButton>
      </div>
    </div>
  );
}

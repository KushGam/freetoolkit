"use client";

import { useMemo, useState } from "react";
import { Button, Input, SecondaryButton } from "@/components/ui";

type LoanTypeKey = "home" | "car" | "personal" | "education" | "lap" | "gold";

type ScheduleRow = {
  month: number;
  year: number;
  openingBalance: number;
  emi: number;
  principal: number;
  interest: number;
  closingBalance: number;
};

type YearSummary = {
  year: number;
  principalPaid: number;
  interestPaid: number;
  balanceAtYearEnd: number;
};

const LOAN_TYPES: Record<
  LoanTypeKey,
  {
    label: string;
    defaultAmount: number;
    defaultRate: number;
    defaultYears: number;
    minAmount: number;
    maxAmount: number;
    minRate: number;
    maxRate: number;
    minYears: number;
    maxYears: number;
  }
> = {
  home: {
    label: "Home Loan",
    defaultAmount: 5000000,
    defaultRate: 8.65,
    defaultYears: 20,
    minAmount: 500000,
    maxAmount: 50000000,
    minRate: 7,
    maxRate: 12,
    minYears: 5,
    maxYears: 30
  },
  car: {
    label: "Car Loan",
    defaultAmount: 800000,
    defaultRate: 9.5,
    defaultYears: 5,
    minAmount: 100000,
    maxAmount: 5000000,
    minRate: 7,
    maxRate: 15,
    minYears: 1,
    maxYears: 7
  },
  personal: {
    label: "Personal Loan",
    defaultAmount: 500000,
    defaultRate: 13,
    defaultYears: 3,
    minAmount: 50000,
    maxAmount: 4000000,
    minRate: 10,
    maxRate: 24,
    minYears: 1,
    maxYears: 5
  },
  education: {
    label: "Education Loan",
    defaultAmount: 1500000,
    defaultRate: 10,
    defaultYears: 7,
    minAmount: 100000,
    maxAmount: 7500000,
    minRate: 8,
    maxRate: 15,
    minYears: 3,
    maxYears: 15
  },
  lap: {
    label: "LAP",
    defaultAmount: 2500000,
    defaultRate: 10,
    defaultYears: 10,
    minAmount: 500000,
    maxAmount: 50000000,
    minRate: 8,
    maxRate: 14,
    minYears: 3,
    maxYears: 20
  },
  gold: {
    label: "Gold Loan",
    defaultAmount: 200000,
    defaultRate: 8,
    defaultYears: 2,
    minAmount: 10000,
    maxAmount: 5000000,
    minRate: 7,
    maxRate: 12,
    minYears: 1,
    maxYears: 3
  }
};

const BANKS = [
  { name: "SBI", home: 8.5, car: 9.15, personal: 11.45 },
  { name: "HDFC Bank", home: 8.6, car: 9.4, personal: 11.0 },
  { name: "ICICI Bank", home: 8.75, car: 9.3, personal: 10.85 },
  { name: "Kotak Mahindra", home: 8.7, car: 9.5, personal: 10.99 },
  { name: "Axis Bank", home: 8.75, car: 9.25, personal: 11.25 },
  { name: "PNB", home: 8.55, car: 9.2, personal: 12.0 },
  { name: "Bank of Baroda", home: 8.4, car: 9.1, personal: 12.5 }
] as const;

function formatINR(n: number): string {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatINRFull(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function calcEmi(principal: number, annualRate: number, years: number): number {
  const months = Math.max(1, Math.round(years * 12));
  if (principal <= 0) return 0;
  const r = annualRate / 12 / 100;
  if (!r) return principal / months;
  const factor = (1 + r) ** months;
  return (principal * r * factor) / (factor - 1);
}

function buildSchedule(principal: number, annualRate: number, years: number): { emi: number; rows: ScheduleRow[] } {
  const emi = calcEmi(principal, annualRate, years);
  const r = annualRate / 12 / 100;
  let balance = principal;
  const rows: ScheduleRow[] = [];
  const maxMonths = Math.ceil(years * 12) + 24;

  for (let m = 1; m <= maxMonths && balance > 0.5; m++) {
    const opening = balance;
    const interest = r * balance;
    let principalPart = emi - interest;
    if (principalPart > balance) principalPart = balance;
    const closing = Math.max(0, balance - principalPart);
    rows.push({
      month: m,
      year: Math.ceil(m / 12),
      openingBalance: opening,
      emi,
      principal: principalPart,
      interest,
      closingBalance: closing
    });
    balance = closing;
  }

  return { emi, rows };
}

function principalFromEmi(emi: number, annualRate: number, years: number): number {
  const months = Math.max(1, Math.round(years * 12));
  const r = annualRate / 12 / 100;
  if (!r) return emi * months;
  const factor = (1 + r) ** months;
  return (emi * (factor - 1)) / (r * factor);
}

function formatTenure(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y && m) return `${y} years ${m} months`;
  if (y) return `${y} years`;
  return `${m} months`;
}

function bankRateForLoanType(bank: (typeof BANKS)[number], loanType: LoanTypeKey): number {
  if (loanType === "car") return bank.car;
  if (loanType === "personal") return bank.personal;
  return bank.home;
}

function simulatePrepayment(
  principal: number,
  annualRate: number,
  years: number,
  prepayAmount: number,
  prepayMonth: number,
  recurring: boolean
) {
  const base = buildSchedule(principal, annualRate, years);
  const emi = base.emi;
  const r = annualRate / 12 / 100;
  let balance = principal;
  let totalInterest = 0;
  let month = 0;
  const maxMonths = 600;

  while (balance > 0.5 && month < maxMonths) {
    month += 1;
    const interest = r * balance;
    totalInterest += interest;
    let principalPart = emi - interest;
    if (principalPart > balance) principalPart = balance;
    balance -= principalPart;

    const shouldPrepay = recurring
      ? month >= prepayMonth && (month - prepayMonth) % 12 === 0
      : month === prepayMonth;
    if (shouldPrepay && prepayAmount > 0) {
      balance = Math.max(0, balance - prepayAmount);
    }
  }

  const originalMonths = base.rows.length;
  const originalInterest = base.rows.reduce((sum, row) => sum + row.interest, 0);
  const monthsSaved = Math.max(0, originalMonths - month);
  const interestSaved = Math.max(0, originalInterest - totalInterest);

  const remainingAfterPrepay = Math.max(0, originalMonths - prepayMonth);
  const reducedEmi =
    remainingAfterPrepay > 0
      ? calcEmi(Math.max(0, base.rows[prepayMonth - 1]?.closingBalance ?? principal) - prepayAmount, annualRate, remainingAfterPrepay / 12)
      : emi;
  const emiSaved = Math.max(0, emi - reducedEmi);

  return {
    originalMonths,
    originalInterest,
    newMonths: month,
    newInterest: totalInterest,
    monthsSaved,
    interestSaved,
    emiSaved,
    emi
  };
}

function yearWiseSummary(rows: ScheduleRow[]): YearSummary[] {
  const map = new Map<number, YearSummary>();
  for (const row of rows) {
    const existing = map.get(row.year) ?? { year: row.year, principalPaid: 0, interestPaid: 0, balanceAtYearEnd: 0 };
    existing.principalPaid += row.principal;
    existing.interestPaid += row.interest;
    existing.balanceAtYearEnd = row.closingBalance;
    map.set(row.year, existing);
  }
  return Array.from(map.values()).sort((a, b) => a.year - b.year);
}

function downloadCSV(data: ScheduleRow[]) {
  const headers = ["Month", "Year", "Opening Balance", "EMI", "Principal", "Interest", "Closing Balance"];
  const rows = data.map((r) =>
    [r.month, r.year, r.openingBalance.toFixed(2), r.emi.toFixed(2), r.principal.toFixed(2), r.interest.toFixed(2), r.closingBalance.toFixed(2)].join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "emi-schedule.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function CollapsibleSection({
  title,
  defaultOpen = false,
  children
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mt-6 rounded-2xl border border-white/[0.08] bg-surface-card">
      <button
        type="button"
        className="flex min-h-[44px] w-full items-center justify-between gap-3 px-5 py-4 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-sm font-black text-ink-primary">{title}</span>
        <span className="text-lg text-ink-muted" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? <div className="border-t border-white/[0.08] px-5 py-4">{children}</div> : null}
    </div>
  );
}

function DonutChart({ principal, interest, total }: { principal: number; interest: number; total: number }) {
  const principalPct = total > 0 ? (principal / total) * 100 : 50;
  const cx = 80;
  const cy = 80;
  const r = 60;
  const circumference = 2 * Math.PI * r;
  const principalLen = (principalPct / 100) * circumference;
  const interestLen = circumference - principalLen;

  return (
    <div className="flex flex-col items-center">
      <svg width="100%" viewBox="0 0 160 160" className="mx-auto my-4 max-w-[180px] sm:max-w-[200px]">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={24}
          strokeDasharray={`${principalLen} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={24}
          strokeDasharray={`${interestLen} ${circumference}`}
          strokeDashoffset={-principalLen}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="currentColor" className="text-[10px] font-bold text-ink-primary">
          Total
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="currentColor" className="text-[9px] text-ink-muted">
          {formatINR(total)}
        </text>
      </svg>
      <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs font-bold text-ink-secondary">
        <span>
          <span className="mr-1.5 inline-block h-3 w-3 rounded-sm bg-blue-500" />
          Principal
        </span>
        <span>
          <span className="mr-1.5 inline-block h-3 w-3 rounded-sm bg-amber-500" />
          Interest
        </span>
      </div>
    </div>
  );
}

export function LoanEmiCalculator() {
  const [loanType, setLoanType] = useState<LoanTypeKey>("home");
  const config = LOAN_TYPES[loanType];
  const [amount, setAmount] = useState(config.defaultAmount);
  const [rate, setRate] = useState(config.defaultRate);
  const [years, setYears] = useState(config.defaultYears);
  const [salary, setSalary] = useState(0);
  const [prepayAmount, setPrepayAmount] = useState(200000);
  const [prepayMonth, setPrepayMonth] = useState(12);
  const [recurringPrepay, setRecurringPrepay] = useState(false);
  const [prepayResult, setPrepayResult] = useState<ReturnType<typeof simulatePrepayment> | null>(null);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  function selectLoanType(key: LoanTypeKey) {
    const c = LOAN_TYPES[key];
    setLoanType(key);
    setAmount(c.defaultAmount);
    setRate(c.defaultRate);
    setYears(c.defaultYears);
    setPrepayResult(null);
  }

  const schedule = useMemo(() => buildSchedule(amount, rate, years), [amount, rate, years]);
  const { emi, rows } = schedule;
  const totalInterest = rows.reduce((sum, row) => sum + row.interest, 0);
  const totalPayable = amount + totalInterest;
  const interestPct = amount > 0 ? ((totalInterest / amount) * 100).toFixed(1) : "0";
  const ratio = amount > 0 ? (totalInterest / amount).toFixed(1) : "0";
  const yearSummary = useMemo(() => yearWiseSummary(rows), [rows]);

  const bankComparisons = useMemo(() => {
    const results = BANKS.map((bank) => {
      const bankRate = bankRateForLoanType(bank, loanType);
      const bankEmi = calcEmi(amount, bankRate, years);
      const bankSchedule = buildSchedule(amount, bankRate, years);
      const bankInterest = bankSchedule.rows.reduce((s, r) => s + r.interest, 0);
      const bankTotal = amount + bankInterest;
      return { bank: bank.name, rate: bankRate, emi: bankEmi, totalInterest: bankInterest, totalPayable: bankTotal };
    });
    results.sort((a, b) => a.emi - b.emi);
    const lowestEmi = results[0]?.emi ?? 0;
    return results.map((r) => ({ ...r, diff: r.emi - lowestEmi }));
  }, [amount, years, loanType]);

  const maxEmi = salary * 0.4;
  const borderlineEmi = salary * 0.5;
  const affordabilityStatus =
    salary <= 0
      ? null
      : emi <= maxEmi
        ? "affordable"
        : emi <= borderlineEmi
          ? "borderline"
          : "risky";
  const safeLoanAmount = principalFromEmi(maxEmi, rate, years);

  const displayedRows = showFullSchedule ? rows : rows.slice(0, 12);

  return (
    <div>
      <div className="scrollbar-hide -mx-4 mb-4 flex gap-2 overflow-x-auto whitespace-nowrap px-4 pb-1 sm:-mx-6 sm:px-6">
        {(Object.keys(LOAN_TYPES) as LoanTypeKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => selectLoanType(key)}
            className={`flex min-h-[40px] shrink-0 items-center whitespace-nowrap rounded-lg border px-4 py-2 text-[13px] font-black transition ${
              loanType === key
                ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-300"
                : "border-white/[0.08] bg-surface-section text-ink-muted hover:text-ink-primary"
            }`}
          >
            {LOAN_TYPES[key].label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5">
        <div>
          <label className="text-[13px] font-bold text-ink-secondary sm:text-[14px]">
            Loan amount — {formatINR(amount)}
            <Input
              className="mt-2 text-[16px] sm:text-sm"
              type="number"
              min={config.minAmount}
              max={config.maxAmount}
              value={amount}
              onChange={(e) => setAmount(Math.min(config.maxAmount, Math.max(config.minAmount, Number(e.target.value) || 0)))}
            />
          </label>
          <input
            className="mt-3 h-2 w-full cursor-pointer accent-indigo-500"
            type="range"
            min={config.minAmount}
            max={config.maxAmount}
            step={config.maxAmount > 1000000 ? 50000 : 5000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-[13px] font-bold text-ink-secondary sm:text-[14px]">
            Annual interest rate (%)
            <Input
              className="mt-2 text-[16px] sm:text-sm"
              type="number"
              step={0.01}
              min={config.minRate}
              max={config.maxRate}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </label>
          <label className="text-[13px] font-bold text-ink-secondary sm:text-[14px]">
            Tenure (years)
            <Input
              className="mt-2 text-[16px] sm:text-sm"
              type="number"
              step={0.5}
              min={config.minYears}
              max={config.maxYears}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </label>
        </div>
        <input
          className="h-2 w-full cursor-pointer accent-indigo-500"
          type="range"
          min={config.minYears}
          max={config.maxYears}
          step={0.5}
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
        />
      </div>

      <CollapsibleSection title="Current Indian Bank Rates (2026)">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[500px] w-full text-left text-[12px] sm:text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-xs font-black uppercase tracking-wide text-ink-muted">
                <th className="px-2 py-2">Bank</th>
                <th className="px-2 py-2">Home Loan</th>
                <th className="px-2 py-2">Car Loan</th>
                <th className="px-2 py-2">Personal Loan</th>
                <th className="px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {BANKS.map((bank) => (
                <tr key={bank.name} className="border-b border-white/[0.06]">
                  <td className="px-2 py-2.5 font-bold text-ink-primary">{bank.name}</td>
                  <td className="px-2 py-2.5 text-ink-secondary">{bank.home.toFixed(2)}%</td>
                  <td className="px-2 py-2.5 text-ink-secondary">{bank.car.toFixed(2)}%</td>
                  <td className="px-2 py-2.5 text-ink-secondary">{bank.personal.toFixed(2)}%</td>
                  <td className="px-2 py-2.5">
                    <SecondaryButton
                      className="!w-auto min-h-[44px] px-3 py-1.5 text-xs sm:w-auto"
                      onClick={() => setRate(bankRateForLoanType(bank, loanType))}
                    >
                      Use this rate
                    </SecondaryButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs leading-5 text-ink-muted">
          Rates as of early 2026. Actual rates vary by CIBIL score, loan amount, and bank policy. Always verify with your bank before applying.
        </p>
      </CollapsibleSection>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-3 shadow-sm sm:p-4">
          <p className="text-[11px] font-black uppercase tracking-wide text-amber-400 sm:text-xs">Monthly EMI</p>
          <p className="mt-2 text-[18px] font-black text-gold sm:text-[22px] md:text-3xl">{formatINRFull(emi)}</p>
          <p className="mt-1 text-[11px] text-ink-muted sm:text-xs">Fixed for entire tenure</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-3 shadow-sm sm:p-4">
          <p className="text-[11px] font-black uppercase tracking-wide text-ink-muted sm:text-xs">Total Interest Payable</p>
          <p className="mt-2 text-[18px] font-black text-ink-primary sm:text-[22px]">{formatINR(totalInterest)}</p>
          <p className="mt-1 text-[11px] text-ink-muted sm:text-xs">{interestPct}% of principal</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-3 shadow-sm sm:p-4">
          <p className="text-[11px] font-black uppercase tracking-wide text-ink-muted sm:text-xs">Total Payable</p>
          <p className="mt-2 text-[18px] font-black text-ink-primary sm:text-[22px]">{formatINR(totalPayable)}</p>
          <p className="mt-1 text-[11px] text-ink-muted sm:text-xs">Principal + Interest</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-3 shadow-sm sm:p-4">
          <p className="text-[11px] font-black uppercase tracking-wide text-ink-muted sm:text-xs">Interest to Principal</p>
          <p className="mt-2 text-[18px] font-black text-ink-primary sm:text-[22px]">
            {ratio} : 1
          </p>
          <p className="mt-1 text-[11px] text-ink-muted sm:text-xs">You pay ₹{ratio} interest per ₹1 borrowed</p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <DonutChart principal={amount} interest={totalInterest} total={totalPayable} />
      </div>

      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-surface-card p-5">
        <p className="text-sm font-black text-ink-primary">Can I afford this loan?</p>
        <label className="mt-3 block text-[13px] font-bold text-ink-secondary sm:text-[14px]">
          Monthly take-home salary (₹)
          <Input className="mt-2 text-[16px] sm:text-sm" type="number" min={0} value={salary || ""} onChange={(e) => setSalary(Number(e.target.value) || 0)} placeholder="e.g. 120000" />
        </label>
        {salary > 0 ? (
          <div className="mt-4 flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-3">
            <div className="rounded-xl border border-white/[0.08] bg-surface-section p-4">
              <p className="text-xs font-black uppercase text-ink-muted">Recommended max EMI (40%)</p>
              <p className="mt-1 text-xl font-black text-ink-primary">{formatINRFull(maxEmi)}</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-surface-section p-4">
              <p className="text-xs font-black uppercase text-ink-muted">Your calculated EMI</p>
              <p className="mt-1 text-xl font-black text-ink-primary">{formatINRFull(emi)}</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-surface-section p-4 sm:col-span-2">
              <p className="text-xs font-black uppercase text-ink-muted">Status</p>
              <p className="mt-1 text-[13px] font-black sm:text-[14px]">
                {affordabilityStatus === "affordable" ? (
                  <span className="text-emerald-400">✅ Affordable (EMI &lt; 40% salary)</span>
                ) : affordabilityStatus === "borderline" ? (
                  <span className="text-amber-400">⚠️ Borderline (40–50%)</span>
                ) : (
                  <span className="text-red-400">❌ Risky (EMI &gt; 50% salary)</span>
                )}
              </p>
            </div>
            <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-4 sm:col-span-2">
              <p className="text-xs font-black uppercase text-indigo-400">Safe borrow amount (40% rule)</p>
              <p className="mt-1 text-2xl font-black text-ink-primary">{formatINR(safeLoanAmount)}</p>
            </div>
          </div>
        ) : null}
      </div>

      <CollapsibleSection title="Prepayment Analysis">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <label className="w-full text-[13px] font-bold text-ink-secondary sm:text-[14px]">
            Prepayment amount (₹)
            <Input className="mt-2 text-[16px] sm:text-sm" type="number" min={0} value={prepayAmount} onChange={(e) => setPrepayAmount(Number(e.target.value) || 0)} />
          </label>
          <label className="w-full text-[13px] font-bold text-ink-secondary sm:text-[14px]">
            At month number
            <Input className="mt-2 text-[16px] sm:text-sm" type="number" min={1} value={prepayMonth} onChange={(e) => setPrepayMonth(Math.max(1, Number(e.target.value) || 1))} />
          </label>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm font-bold text-ink-secondary">
          <input
            className="h-4 w-4 accent-indigo-500"
            type="checkbox"
            checked={recurringPrepay}
            onChange={(e) => setRecurringPrepay(e.target.checked)}
          />
          Recurring annual prepayment (every 12 months from first payment month)
        </label>
        <Button
          className="mt-4 w-full min-h-[44px] sm:w-auto"
          onClick={() => setPrepayResult(simulatePrepayment(amount, rate, years, prepayAmount, prepayMonth, recurringPrepay))}
        >
          Calculate Savings
        </Button>
        {prepayResult ? (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.08] bg-surface-section p-4">
              <p className="text-xs font-black uppercase text-ink-muted">Months saved</p>
              <p className="mt-1 font-black text-ink-primary">
                {prepayResult.monthsSaved} months ({formatTenure(prepayResult.monthsSaved)})
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-surface-section p-4">
              <p className="text-xs font-black uppercase text-ink-muted">Total interest saved</p>
              <p className="mt-1 font-black text-emerald-400">{formatINR(prepayResult.interestSaved)}</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-surface-section p-4">
              <p className="text-xs font-black uppercase text-ink-muted">New loan tenure</p>
              <p className="mt-1 font-black text-ink-primary">{formatTenure(prepayResult.newMonths)}</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-surface-section p-4">
              <p className="text-xs font-black uppercase text-ink-muted">EMI saved per month (if tenure kept)</p>
              <p className="mt-1 font-black text-ink-primary">{formatINRFull(prepayResult.emiSaved)}</p>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-surface-section p-4 sm:col-span-2">
              <p className="text-xs font-black uppercase text-ink-muted">Before / after</p>
              <p className="mt-2 text-sm text-ink-secondary">
                Without prepayment: Total interest {formatINR(prepayResult.originalInterest)}, Tenure {formatTenure(prepayResult.originalMonths)}
              </p>
              <p className="mt-1 text-sm text-ink-secondary">
                With prepayment: Total interest {formatINR(prepayResult.newInterest)}, Tenure {formatTenure(prepayResult.newMonths)}
              </p>
              <p className="mt-2 text-sm font-black text-emerald-400">
                You save {formatINR(prepayResult.interestSaved)} in interest, finish {prepayResult.monthsSaved} months early
              </p>
            </div>
          </div>
        ) : null}
      </CollapsibleSection>

      <div className="mt-6 rounded-2xl border border-white/[0.08] bg-surface-card p-5">
        <p className="text-sm font-black text-ink-primary">Year-wise summary (ITR / Section 24)</p>
        <div className="w-full overflow-x-auto">
          <table className="min-w-[400px] w-full text-left text-[11px] sm:text-[12px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-xs font-black uppercase tracking-wide text-ink-muted">
                <th className="px-2 py-2">Year</th>
                <th className="px-2 py-2">Principal Paid</th>
                <th className="px-2 py-2">Interest Paid</th>
                <th className="px-2 py-2">Balance at Year End</th>
              </tr>
            </thead>
            <tbody>
              {yearSummary.map((y) => (
                <tr key={y.year} className="border-b border-white/[0.06]">
                  <td className="px-2 py-2 font-bold text-ink-primary">{y.year}</td>
                  <td className="px-2 py-2 text-ink-secondary">{formatINRFull(y.principalPaid)}</td>
                  <td className="px-2 py-2 text-ink-secondary">{formatINRFull(y.interestPaid)}</td>
                  <td className="px-2 py-2 text-ink-secondary">{formatINRFull(y.balanceAtYearEnd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CollapsibleSection title="Month-by-Month Schedule">
        <div className="w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="min-w-[640px] w-full text-left text-[11px] sm:text-[12px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-xs font-black uppercase tracking-wide text-ink-muted">
                <th className="px-2 py-2">Month</th>
                <th className="px-2 py-2">Year</th>
                <th className="px-2 py-2">Opening</th>
                <th className="px-2 py-2">EMI</th>
                <th className="px-2 py-2">Principal</th>
                <th className="px-2 py-2">Interest</th>
                <th className="px-2 py-2">Closing</th>
              </tr>
            </thead>
            <tbody>
              {displayedRows.map((row) => (
                <tr key={row.month} className="border-b border-white/[0.06]">
                  <td className="px-2 py-2 text-ink-primary">{row.month}</td>
                  <td className="px-2 py-2 text-ink-secondary">{row.year}</td>
                  <td className="px-2 py-2 text-ink-secondary">{formatINRFull(row.openingBalance)}</td>
                  <td className="px-2 py-2 text-ink-secondary">{formatINRFull(row.emi)}</td>
                  <td className="px-2 py-2 text-ink-secondary">{formatINRFull(row.principal)}</td>
                  <td className="px-2 py-2 text-ink-secondary">{formatINRFull(row.interest)}</td>
                  <td className="px-2 py-2 text-ink-secondary">{formatINRFull(row.closingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <SecondaryButton className="w-full min-h-[44px] sm:w-auto" onClick={() => setShowFullSchedule((v) => !v)}>
            {showFullSchedule ? "Show first 12 months" : "Show full schedule"}
          </SecondaryButton>
          <SecondaryButton className="w-full min-h-[44px] sm:w-auto" onClick={() => downloadCSV(rows)}>
            Download CSV
          </SecondaryButton>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Compare Across Banks">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[560px] w-full text-left text-[11px] sm:text-[12px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-xs font-black uppercase tracking-wide text-ink-muted">
                <th className="px-2 py-2">Bank</th>
                <th className="px-2 py-2">Rate</th>
                <th className="px-2 py-2">Monthly EMI</th>
                <th className="px-2 py-2">Total Interest</th>
                <th className="px-2 py-2">Total Payable</th>
                <th className="px-2 py-2">Diff vs Lowest</th>
                <th className="px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {bankComparisons.map((row, i) => (
                <tr
                  key={row.bank}
                  className={`border-b border-white/[0.06] ${i === 0 ? "bg-emerald-500/10" : ""}`}
                >
                  <td className="sticky left-0 z-10 bg-bg2 px-2 py-2.5 font-bold text-ink-primary sm:static sm:bg-transparent">{row.bank}</td>
                  <td className="px-2 py-2.5 text-ink-secondary">{row.rate.toFixed(2)}%</td>
                  <td className="px-2 py-2.5 font-bold text-ink-primary">{formatINRFull(row.emi)}</td>
                  <td className="px-2 py-2.5 text-ink-secondary">{formatINR(row.totalInterest)}</td>
                  <td className="px-2 py-2.5 text-ink-secondary">{formatINR(row.totalPayable)}</td>
                  <td className="px-2 py-2.5 text-ink-secondary">
                    {row.diff === 0 ? "Lowest" : `+${formatINRFull(row.diff)}/mo`}
                  </td>
                  <td className="px-2 py-2.5">
                    <SecondaryButton className="!w-auto min-h-[44px] px-3 py-1.5 text-xs sm:w-auto" onClick={() => setRate(row.rate)}>
                      Use this rate
                    </SecondaryButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleSection>
    </div>
  );
}

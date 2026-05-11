import Link from "next/link";
import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Section({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("py-12 sm:py-16", className)}>{children}</section>;
}

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-b from-brand-500 via-brand-600 to-brand-700 px-5 py-3 text-sm font-bold text-white shadow-[0_16px_34px_rgba(127,29,29,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_42px_rgba(127,29,29,0.3)] focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50 sm:w-auto",
        className
      )}
      {...props}
    />
  );
}

export function SecondaryButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-100 hover:bg-brand-50 hover:text-brand-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50 sm:w-auto",
        className
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "min-h-12 w-full rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 focus:shadow-[0_12px_26px_rgba(127,29,29,0.12)]",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "min-h-12 w-full rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-4 py-3 text-sm font-medium text-slate-900 shadow-sm outline-none transition-all duration-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-64 w-full max-w-full resize-y rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 text-sm font-medium leading-7 text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 [overflow-wrap:anywhere]",
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-slate-200/90 bg-gradient-to-b from-white/95 to-slate-50/90 p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-200 hover:shadow-[0_20px_44px_rgba(15,23,42,0.12)]", className)}>
      {children}
    </div>
  );
}

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex w-fit items-center rounded-full border border-slate-200 bg-gradient-to-b from-white to-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm", className)}>
      {children}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  badges,
  className
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  badges?: string[];
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#fef2f2,transparent_40%),radial-gradient(circle_at_top_right,#ffffff,transparent_34%),linear-gradient(180deg,#ffffff,#fafafa)] p-6 text-center shadow-[0_28px_75px_rgba(15,23,42,0.08)] sm:p-9 lg:p-12", className)}>
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
      {eyebrow ? <Badge className="mx-auto border-brand-100 bg-white/85 text-[11px] font-black uppercase tracking-wide text-brand-700">{eyebrow}</Badge> : null}
      <h1 className="mx-auto mt-5 max-w-4xl break-words font-display text-4xl font-extrabold tracking-tight text-slate-950 [overflow-wrap:anywhere] sm:text-5xl lg:text-6xl">{title}</h1>
      {description ? <div className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">{description}</div> : null}
      {badges?.length ? (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {badges.map((badge) => <Badge key={badge}>{badge}</Badge>)}
        </div>
      ) : null}
    </section>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 text-center">
      <p className="text-base font-bold tracking-tight text-slate-950">{title}</p>
      {description ? <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p> : null}
    </div>
  );
}

export function ResultCard({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={cn("bg-gradient-to-b from-white to-slate-50/80", className)}>
      {title ? <h3 className="text-sm font-black uppercase tracking-wide text-brand-600">{title}</h3> : null}
      <div className={cn(title && "mt-3")}>{children}</div>
    </Card>
  );
}

const toolIcons: Record<string, string> = {
  "Image Tools": "IMG",
  "PDF Tools": "PDF",
  "Student Tools": "GPA",
  "AI Tools": "AI",
  "Calculator Tools": "CAL",
  "Text Tools": "TXT",
  "Developer Tools": "DEV",
  "Security Tools": "SEC",
  "SEO Tools": "SEO",
  "Social Media Tools": "SOC"
};

export function ToolCard({
  title,
  description,
  href,
  category,
  badge
}: {
  title: string;
  description: string;
  href: string;
  category?: string;
  badge?: string;
}) {
  return (
    <Link href={href} className="group flex h-full min-h-60 flex-col rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/95 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_22px_45px_rgba(15,23,42,0.14)] focus:outline-none focus:ring-4 focus:ring-brand-100">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-b from-brand-50 to-brand-100 text-[11px] font-black text-brand-700 ring-1 ring-brand-100">
          {category ? toolIcons[category] ?? "TOOL" : "TOOL"}
        </div>
        <span className="text-xl font-black text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-600" aria-hidden="true">→</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {category ? <p className="w-fit rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-slate-600">{category}</p> : null}
        {badge ? <p className="w-fit rounded-full bg-brand-50 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-brand-700 ring-1 ring-brand-100">{badge}</p> : null}
      </div>
      <h3 className="mt-3 font-display text-lg font-extrabold tracking-tight text-slate-950 group-hover:text-brand-700">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{description}</p>
    </Link>
  );
}

export function CategoryCard({
  title,
  description,
  href,
  icon,
  tools
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
  tools: string[];
}) {
  return (
    <Link href={href} className="group rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/95 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_22px_45px_rgba(15,23,42,0.14)] focus:outline-none focus:ring-4 focus:ring-brand-100">
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b from-brand-50 to-brand-100 text-xs font-black text-brand-700 ring-1 ring-brand-100">
          {icon}
        </span>
        <span className="text-xl font-black text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-600" aria-hidden="true">→</span>
      </div>
      <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      <div className="mt-5 grid gap-2">
        {tools.map((tool) => (
          <span key={tool} className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">
            {tool}
          </span>
        ))}
      </div>
    </Link>
  );
}

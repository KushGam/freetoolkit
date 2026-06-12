import Link from "next/link";
import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { ToolCard as DesignToolCard } from "@/components/ui/ToolCard";
import { cn } from "@/lib/utils";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Section({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cn("py-12 sm:py-16", className)}>{children}</section>;
}

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("btn-primary w-full sm:w-auto", className)} {...props} />;
}

export function SecondaryButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("btn-secondary w-full sm:w-auto", className)} {...props} />;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("input-dark", className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("input-dark", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn("input-dark min-h-64 resize-y leading-7 [overflow-wrap:anywhere]", className)}
      {...props}
    />
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("surface-card p-5 shadow-card", className)}>{children}</div>;
}

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border border-white/[0.08] bg-surface-section px-3 py-1.5 text-xs font-medium text-ink-muted",
        className
      )}
    >
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
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-section p-6 shadow-glow sm:p-10",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(129,140,248,0.1),transparent_55%)]" />
      <div className="relative">
        {eyebrow ? <Badge className="text-ink-muted">{eyebrow}</Badge> : null}
        <h1 className="mt-4 max-w-4xl break-words text-3xl font-semibold tracking-tight text-ink-primary sm:text-4xl lg:text-5xl [overflow-wrap:anywhere]">
          {title}
        </h1>
        {description ? <div className="mt-4 max-w-3xl text-base leading-8 text-ink-secondary sm:text-lg">{description}</div> : null}
        {badges?.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge key={badge}>{badge}</Badge>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/15 bg-surface-section p-6 text-center">
      <p className="text-base font-semibold text-ink-primary">{title}</p>
      {description ? <p className="mt-2 text-sm text-ink-muted">{description}</p> : null}
    </div>
  );
}

export function ResultCard({ title, children, className }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <Card className={className}>
      {title ? <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{title}</h3> : null}
      <div className={cn(title && "mt-3")}>{children}</div>
    </Card>
  );
}

const toolIcons: Record<string, string> = {
  "Image Tools": "IMG",
  "PDF Tools": "PDF",
  "AI Tools": "AI",
  "Calculator Tools": "CAL",
  "Developer Tools": "DEV",
  "SEO Tools": "SEO"
};

export function ToolCard({
  title,
  description,
  href,
  category,
  badge: _badge
}: {
  title: string;
  description: string;
  href: string;
  category?: string;
  badge?: string;
}) {
  return (
    <DesignToolCard
      slug={href.replace(/^\//, "")}
      name={title}
      desc={description}
      category={category ?? "Tool"}
    />
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
    <Link
      href={href}
      prefetch={false}
      className="group block rounded-xl border border-white/[0.08] bg-surface-card p-6 shadow-card transition hover:border-indigo-400/25 hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/[0.08] bg-surface-section text-xs font-semibold text-ink-muted">
          {icon}
        </span>
        <span className="text-lg text-ink-muted transition group-hover:text-indigo-400" aria-hidden="true">
          →
        </span>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-ink-primary">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-ink-muted">{description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {tools.map((tool) => (
          <span key={tool} className="rounded-md bg-surface-section px-2.5 py-1 text-xs text-ink-muted">
            {tool}
          </span>
        ))}
      </div>
    </Link>
  );
}

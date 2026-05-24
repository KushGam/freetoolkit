export function GamingDisclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`rounded-2xl border border-white/[0.08] bg-surface-card ${compact ? "p-4" : "p-5"} shadow-sm`}>
      <p className="text-xs font-black uppercase tracking-wide text-indigo-400">Gaming tools note</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">
        freetoolkitapp is an independent tools platform and is not affiliated with, endorsed by, or sponsored by the respective game developers or publishers.
      </p>
    </section>
  );
}

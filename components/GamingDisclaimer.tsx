export function GamingDisclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white ${compact ? "p-4" : "p-5"} shadow-sm`}>
      <p className="text-xs font-black uppercase tracking-wide text-brand-600">Gaming tools note</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        FreeToolKit is an independent tools platform and is not affiliated with, endorsed by, or sponsored by the respective game developers or publishers.
      </p>
    </section>
  );
}

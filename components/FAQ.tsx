export function FAQ({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <section className="mt-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Helpful answers</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-primary">Frequently asked questions</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <details key={item.question} className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 transition open:border-white/20 open:bg-white/[0.04]">
            <summary className="cursor-pointer text-base font-medium text-ink-primary">{item.question}</summary>
            <p className="mt-3 text-sm leading-7 text-ink-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

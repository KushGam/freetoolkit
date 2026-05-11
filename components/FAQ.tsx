export function FAQ({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <section className="mt-12">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Helpful answers</p>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-950">Frequently asked questions</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <details key={item.question} className="group rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-all duration-200 open:border-brand-200 open:shadow-[0_18px_40px_rgba(127,29,29,0.12)]">
            <summary className="cursor-pointer font-display text-base font-semibold text-slate-950">{item.question}</summary>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

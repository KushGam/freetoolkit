export function FAQ({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <section className="mt-12">
      <p className="text-sm font-black uppercase tracking-wide text-brand-600">Helpful answers</p>
      <h2 className="mt-2 text-2xl font-black text-slate-950">Frequently asked questions</h2>
      <div className="mt-5 grid gap-3">
        {items.map((item) => (
          <details key={item.question} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition open:border-brand-200 open:shadow-[0_18px_40px_rgba(37,99,235,0.08)]">
            <summary className="cursor-pointer text-base font-extrabold text-slate-900">{item.question}</summary>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

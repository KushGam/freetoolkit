import { SectionHeader } from "@/components/ui/SectionHeader";

export function FAQ({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <section className="mt-12">
      <SectionHeader eyebrow="FAQ" title="Frequently asked questions" align="left" />
      <div className="mt-6">
        {items.map((item) => (
          <div key={item.question} className="mb-3 rounded-xl border border-border bg-bg3 p-5">
            <h3 className="text-[15px] font-semibold text-text">{item.question}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-text-2">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

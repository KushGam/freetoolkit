import { ToolCard } from "@/components/ui";
import { toolHref, type Tool } from "@/data/tools";

export function RelatedTools({ tools }: { tools: Tool[] }) {
  return (
    <section className="mt-12">
      <p className="text-sm font-black uppercase tracking-wide text-brand-600">Keep going</p>
      <h2 className="mt-2 text-2xl font-black text-slate-950">Related tools</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} title={tool.title} description={tool.description} href={toolHref(tool)} badge={tool.badge} />
        ))}
      </div>
    </section>
  );
}

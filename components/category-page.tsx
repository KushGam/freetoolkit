import { AdSlot } from "@/components/AdSlot";
import { ToolCard } from "@/components/ui";
import { getToolsByCategory, toolHref, type ToolCategory } from "@/data/tools";

export function CategoryPage({ category, intro }: { category: ToolCategory; intro: string }) {
  const categoryTools = getToolsByCategory(category);
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_36%),linear-gradient(180deg,#ffffff,#f8fafc)] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="w-fit rounded-full border border-brand-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-wide text-brand-700">Free browser tools</p>
        <h1 className="mt-4 text-4xl font-black text-slate-950">{category}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{intro}</p>
      </section>
      <AdSlot size="leaderboard" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryTools.map((tool) => <ToolCard key={tool.slug} title={tool.title} description={tool.description} href={toolHref(tool)} category={tool.category} badge={tool.badge} />)}
      </div>
      <section className="prose-lite mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2>About these {category.toLowerCase()}</h2>
        <p>
          These free tools are built for everyday work on phones, tablets, and desktops. Each page includes useful instructions, privacy-friendly copy, and related internal links so you can move between tasks quickly.
        </p>
        <p>
          FreeToolKit does not require accounts or paid API keys. Image and PDF tools use browser-side processing where possible, while student tools calculate results instantly on the page.
        </p>
      </section>
    </main>
  );
}

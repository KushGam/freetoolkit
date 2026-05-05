import { AdSlot } from "@/components/AdSlot";
import { CategoryToolSearch } from "@/components/CategoryToolSearch";
import { getToolsByCategory, type ToolCategory } from "@/data/tools";

export function CategoryPage({ category, intro }: { category: ToolCategory; intro: string }) {
  const categoryTools = getToolsByCategory(category);
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_36%),radial-gradient(circle_at_top_right,#e0e7ff,transparent_30%),linear-gradient(180deg,#ffffff,#f8fafc)] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-9">
        <p className="w-fit rounded-full border border-brand-100 bg-white/85 px-4 py-2 text-xs font-black uppercase tracking-wide text-brand-700 shadow-sm">Free browser tools</p>
        <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{category}</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">{intro}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {["No signup", "Fast", "Mobile friendly"].map((item) => (
            <span key={item} className="rounded-full border border-slate-200 bg-white/85 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm">{item}</span>
          ))}
        </div>
      </section>
      <AdSlot size="leaderboard" priority />
      <CategoryToolSearch tools={categoryTools} />
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

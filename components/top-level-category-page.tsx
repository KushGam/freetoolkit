import Link from "next/link";
import { CategoryToolSearch } from "@/components/CategoryToolSearch";
import {
  getToolsByTopLevelCategory,
  topLevelCategoryIntros,
  topLevelCategoryOldLinks,
  type TopLevelCategory
} from "@/data/tools";

const categoryBadges: Record<TopLevelCategory, string[]> = {
  Everyday: ["Images", "PDFs", "Text", "Calculators"],
  Student: ["Grades", "GPA", "Attendance", "Study"],
  "AI Tools": ["Resume", "Cover letter", "Career", "Productivity"],
  Developer: ["JSON", "URLs", "UUIDs", "Base64"]
};

export function TopLevelCategoryPage({ category }: { category: TopLevelCategory }) {
  const categoryTools = getToolsByTopLevelCategory(category);
  const oldLinks = topLevelCategoryOldLinks[category];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_36%),radial-gradient(circle_at_top_right,#e0e7ff,transparent_30%),linear-gradient(180deg,#ffffff,#f8fafc)] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-9">
        <p className="w-fit rounded-full border border-brand-100 bg-white/85 px-4 py-2 text-xs font-black uppercase tracking-wide text-brand-700 shadow-sm">FreeToolKit category</p>
        <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{category}</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">{topLevelCategoryIntros[category]}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {categoryBadges[category].map((item) => (
            <span key={item} className="rounded-full border border-slate-200 bg-white/85 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm">{item}</span>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-950">Related sections</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">Older category pages still work and remain useful for focused browsing.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {oldLinks.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CategoryToolSearch tools={categoryTools} />

      <section className="prose-lite mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2>About {category.toLowerCase()} tools</h2>
        <p>
          This category collects related FreeToolKit utilities into one cleaner browsing experience. Every card links to an existing tool page, so existing URLs and tool functionality continue working exactly as before.
        </p>
        <p>
          FreeToolKit is designed for fast, no-signup workflows on mobile and desktop. Use the search box above to filter this category, or open <Link href="/all-tools">All Tools</Link> to browse the full directory.
        </p>
      </section>
    </main>
  );
}

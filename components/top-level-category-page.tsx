import Link from "next/link";
import { CategoryToolSearch } from "@/components/CategoryToolSearch";
import { Card, Container, PageHeader } from "@/components/ui";
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
    <main>
      <Container className="max-w-6xl py-10 sm:py-12">
      <PageHeader eyebrow="FreeToolKit category" title={category} description={topLevelCategoryIntros[category]} badges={categoryBadges[category]} />

      <Card className="mt-8 p-5">
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
      </Card>

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
      </Container>
    </main>
  );
}

import Link from "next/link";
import { CategoryToolSearch } from "@/components/CategoryToolSearch";
import { FAQ } from "@/components/FAQ";
import { RelatedBlogPosts } from "@/components/RelatedBlogPosts";
import { Card, Container, PageHeader, ToolCard } from "@/components/ui";
import { getBlogPostsBySlugs } from "@/data/blog";
import { topLevelCategorySeo } from "@/data/seo";
import { getBlogSlugsForCategory, getClustersForCategory } from "@/data/tool-relations";
import {
  getTool,
  getToolsByTopLevelCategory,
  topLevelCategoryIntros,
  topLevelCategoryOldLinks,
  toolHref,
  type TopLevelCategory
} from "@/data/tools";

const categoryBadges: Record<TopLevelCategory, string[]> = {
  Everyday: ["Text", "Calculators", "QR", "Security"],
  "AI Tools": ["Writing", "Resume", "Captions", "Productivity"],
  Student: ["Grades", "GPA", "Attendance", "Study"],
  Developer: ["JSON", "URLs", "UUIDs", "Base64"],
  "PDF & Image": ["PDF", "Images", "Converters", "Browser-based"],
  "SEO Tools": ["Meta", "SERP", "Schema", "Crawling"],
  "Social Media Tools": ["Captions", "Hashtags", "Bios", "Counters"]
};

export function TopLevelCategoryPage({ category }: { category: TopLevelCategory }) {
  const categoryTools = getToolsByTopLevelCategory(category);
  const oldLinks = topLevelCategoryOldLinks[category];
  const seo = topLevelCategorySeo[category];
  const featuredGuides = getBlogPostsBySlugs(getBlogSlugsForCategory(category, 4));
  const featuredTools = getClustersForCategory(category)
    .flatMap((cluster) => cluster.toolSlugs)
    .map((slug) => getTool(slug))
    .filter((tool): tool is NonNullable<ReturnType<typeof getTool>> => Boolean(tool))
    .slice(0, 6);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: seo.faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Container className="max-w-6xl py-10 sm:py-12">
      <PageHeader eyebrow="FreeToolKit productivity category" title={category} description={topLevelCategoryIntros[category]} badges={categoryBadges[category]} />

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

      {featuredTools.length ? (
        <section className="mt-10">
          <p className="text-sm font-black uppercase tracking-wide text-brand-600">Featured tools</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-950">Start with the core {category.toLowerCase()} workflows</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.slug} title={tool.title} description={tool.description} href={toolHref(tool)} category={tool.category} badge={tool.badge} />
            ))}
          </div>
        </section>
      ) : null}

      <CategoryToolSearch tools={categoryTools} />
      <RelatedBlogPosts posts={featuredGuides} title={`Featured ${category.toLowerCase()} guides`} />

      <section className="prose-lite mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2>About {category.toLowerCase()} tools</h2>
        {seo.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p>
          FreeToolKit is designed for fast, no-signup workflows on mobile and desktop. Use the search box above to filter this category, or open <Link href="/all-tools">All Tools</Link> to browse the full directory of free AI and everyday productivity tools.
        </p>
      </section>
      <FAQ items={seo.faqs} />
      </Container>
    </main>
  );
}

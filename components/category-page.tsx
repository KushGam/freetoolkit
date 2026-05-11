import { CategoryToolSearch } from "@/components/CategoryToolSearch";
import { FAQ } from "@/components/FAQ";
import { RelatedBlogPosts } from "@/components/RelatedBlogPosts";
import { Container, PageHeader, ToolCard } from "@/components/ui";
import { getBlogPostsBySlugs } from "@/data/blog";
import { categorySeo } from "@/data/seo";
import { getBlogSlugsForCategory, getClustersForCategory } from "@/data/tool-relations";
import { getTool, getToolsByCategory, toolHref, type ToolCategory } from "@/data/tools";

export function CategoryPage({ category, intro }: { category: ToolCategory; intro: string }) {
  const categoryTools = getToolsByCategory(category);
  const seo = categorySeo[category];
  const featuredGuides = getBlogPostsBySlugs(getBlogSlugsForCategory(category, 4));
  const featuredTools = getClustersForCategory(category)
    .flatMap((cluster) => cluster.toolSlugs)
    .map((slug) => getTool(slug))
    .filter((tool): tool is NonNullable<ReturnType<typeof getTool>> => Boolean(tool))
    .slice(0, 6);
  const faqSchema = seo?.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seo.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer }
        }))
      }
    : null;
  return (
    <main>
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null}
      <Container className="max-w-6xl py-10 sm:py-12">
      <PageHeader eyebrow="Free browser tools" title={category} description={seo?.intro ?? intro} badges={["No signup", "Fast", "Mobile friendly"]} />
      {featuredTools.length ? (
        <section className="mt-10">
          <p className="text-sm font-black uppercase tracking-wide text-brand-600">Featured tools</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-950">Start with the most useful {category.toLowerCase()}</h2>
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
        <h2>About these {category.toLowerCase()}</h2>
        {(seo?.body ?? [
          "These free tools are built for everyday work on phones, tablets, and desktops. Each page includes useful instructions, privacy-friendly copy, and related internal links so you can move between tasks quickly.",
          "FreeToolKit does not require accounts or paid API keys. Image and PDF tools use browser-side processing where possible, while student tools calculate results instantly on the page."
        ]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </section>
      {seo?.faqs?.length ? <FAQ items={seo.faqs} /> : null}
      </Container>
    </main>
  );
}

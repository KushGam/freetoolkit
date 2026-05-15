import Link from "next/link";
import { CategoryToolSearch } from "@/components/CategoryToolSearch";
import { FAQ } from "@/components/FAQ";
import { GamingDisclaimer } from "@/components/GamingDisclaimer";
import { RelatedBlogPosts } from "@/components/RelatedBlogPosts";
import { Container, PageHeader, ToolCard } from "@/components/ui";
import { getBlogPostsBySlugs } from "@/data/blog";
import { categorySeo } from "@/data/seo";
import { getBlogSlugsForCategory, getClustersForCategory } from "@/data/tool-relations";
import { categoryRoutes, getTool, getToolsByCategory, getTopLevelCategory, topLevelCategoryRoutes, toolHref, type ToolCategory } from "@/data/tools";
import { isToolIndexedForSearch } from "@/data/indexing-policy";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/schema";

export function CategoryPage({ category, intro, hubNote }: { category: ToolCategory; intro: string; hubNote?: string }) {
  const categoryTools = getToolsByCategory(category);
  const seo = categorySeo[category];
  const featuredGuides = getBlogPostsBySlugs(getBlogSlugsForCategory(category, 4));
  const featuredTools = getClustersForCategory(category)
    .flatMap((cluster) => cluster.toolSlugs)
    .map((slug) => getTool(slug))
    .filter((tool): tool is NonNullable<ReturnType<typeof getTool>> => Boolean(tool))
    .filter((tool) => isToolIndexedForSearch(tool.slug))
    .slice(0, 6);
  const faqSchema = seo?.faqs?.length ? buildFaqSchema(seo.faqs) : null;
  const topLevelRoute = categoryTools[0] ? topLevelCategoryRoutes[getTopLevelCategory(categoryTools[0])] : "/all-tools";
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: category, href: topLevelRoute },
    { name: category, href: categoryRoutes[category] }
  ]);
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null}
      <Container className="max-w-6xl py-10 sm:py-12">
      <PageHeader eyebrow="Free browser tools" title={category} description={seo?.intro ?? intro} badges={["No signup", "Fast", "Mobile friendly"]} />
      {hubNote ? (
        <section className="mt-8 rounded-2xl border border-brand-100 bg-brand-50/80 p-5 text-sm leading-relaxed text-slate-700">
          <p className="font-semibold text-slate-900">Where to start</p>
          <p className="mt-2">{hubNote}</p>
        </section>
      ) : null}
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
      {category === "Gaming Tools" ? <div className="mt-8"><GamingDisclaimer /></div> : null}
      <CategoryToolSearch tools={categoryTools} />
      <RelatedBlogPosts posts={featuredGuides} title={`Featured ${category.toLowerCase()} guides`} />
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-brand-600">Broader section</p>
        <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-slate-950">Explore the full workflow path</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          This category is part of a broader hub for related tasks. Use the links below to move between hubs, tools, and practical guides without losing context.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={topLevelRoute} className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            Broader hub
          </Link>
          <Link href="/all-tools" className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            All tools
          </Link>
          <Link href="/blog" className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            Related guides
          </Link>
        </div>
      </section>
      <section className="prose-lite mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2>About these {category.toLowerCase()}</h2>
        {(seo?.body ?? [
          "These free tools are built for everyday work on phones, tablets, and desktops. Each page includes useful instructions, privacy-friendly copy, and related internal links so you can move between tasks quickly.",
          "FreeToolKit does not require accounts, subscriptions, or complicated setup. Image and PDF tools use browser-side processing where possible, while student tools calculate results instantly on the page."
        ]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </section>
      {seo?.faqs?.length ? <FAQ items={seo.faqs} /> : null}
      </Container>
    </main>
  );
}

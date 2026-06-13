import type { Metadata } from "next";
import Link from "next/link";
import { Card, Container, PageHeader } from "@/components/ui";
import { blogHref, getIndexedBlogPosts } from "@/data/blog";
import { getToolsByTopLevelCategory, topLevelCategories, topLevelCategoryRoutes, toolHref, type TopLevelCategory } from "@/data/tools";
import { isToolIndexedForSearch } from "@/data/indexing-policy";
import { canonicalUrl, siteUrl } from "@/lib/utils";
import { indexRobots } from "@/lib/seo-robots";
import { withoutBrandSuffix } from "@/lib/schema";

export const metadata: Metadata = {
  title: withoutBrandSuffix("Site map | freetoolkitapp"),
  description:
    "Browse every freetoolkitapp category hub, featured legal pages, blog guides, and links into the full tool directory for crawlers and visitors.",
  alternates: { canonical: canonicalUrl("/sitemap") },
  robots: indexRobots
};

const staticLinks: Array<{ href: string; label: string; description: string; external?: boolean }> = [
  { href: "/", label: "Home", description: "Product overview and search" },
  { href: "/all-tools", label: "All tools", description: "Searchable directory" },
  { href: "/blog", label: "Blog", description: "Guides and tutorials" },
  { href: "/about", label: "About", description: "Mission and editorial standards" },
  { href: "/contact", label: "Contact", description: "Feedback and support email" },
  { href: "/privacy-policy", label: "Privacy Policy", description: "Data, cookies, and ads" },
  { href: "/terms", label: "Terms of Use", description: "Acceptable use and liability" },
  { href: "/disclaimer", label: "Disclaimer", description: "AI and calculator disclaimers" },
  { href: `${siteUrl}/sitemap.xml`, label: "XML sitemap (for search engines)", description: "Machine-readable URL list", external: true }
];

export default function HtmlSitemapPage() {
  return (
    <main className="mesh-bg min-h-screen">
      <Container className="max-w-5xl py-12 sm:py-16">
        <PageHeader
          eyebrow="Navigation"
          title="Site map"
          description="A structured map of freetoolkitapp pages. Use it to discover categories, legal information, guides, and deep links into free tools."
          badges={["Internal links", "SEO friendly", "Mobile layout"]}
        />

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="font-display text-xl font-bold text-ink-primary">Core pages</h2>
            <ul className="mt-4 grid gap-3 text-sm">
              {staticLinks.map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <a href={item.href} className="font-bold text-indigo-400 hover:text-ink-primary" rel="noopener noreferrer">
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="font-bold text-indigo-400 hover:text-ink-primary">
                      {item.label}
                    </Link>
                  )}
                  <p className="text-ink-muted">{item.description}</p>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <h2 className="font-display text-xl font-bold text-ink-primary">Blog guides</h2>
            <ul className="mt-4 grid max-h-[28rem] gap-2 overflow-y-auto text-sm">
              {getIndexedBlogPosts().map((post) => (
                <li key={post.slug}>
                  <Link href={blogHref(post)} className="font-semibold text-indigo-400 hover:text-ink-primary">
                    {post.title}
                  </Link>
                  <span className="text-ink-muted"> — {post.category}</span>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {topLevelCategories.map((category) => (
          <CategoryToolList key={category} category={category} />
        ))}
      </Container>
    </main>
  );
}

function CategoryToolList({ category }: { category: TopLevelCategory }) {
  const tools = getToolsByTopLevelCategory(category).filter((tool) => isToolIndexedForSearch(tool.slug));
  const hub = topLevelCategoryRoutes[category];
  return (
    <section className="mt-10 rounded-[1.75rem] border border-white/[0.08] bg-surface-card p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-ink-primary">{category}</h2>
          <p className="mt-1 text-xs font-semibold text-ink-muted">Listing search-indexed tools. All utilities (including previews) remain in the full directory.</p>
        </div>
        <Link href={hub} className="text-sm font-bold text-indigo-400 hover:text-ink-primary">
          Open category hub →
        </Link>
      </div>
      <ul className="mt-5 columns-1 gap-x-10 text-sm sm:columns-2 lg:columns-3">
        {tools.map((tool) => (
          <li key={tool.slug} className="break-inside-avoid py-1">
            <Link href={toolHref(tool)} className="text-ink-secondary hover:text-indigo-400">
              {tool.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

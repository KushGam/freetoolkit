import type { Metadata } from "next";
import Link from "next/link";
import { Card, Container, PageHeader } from "@/components/ui";
import { blogHref, blogPosts } from "@/data/blog";
import { getToolsByTopLevelCategory, topLevelCategories, topLevelCategoryRoutes, toolHref, type TopLevelCategory } from "@/data/tools";
import { isToolIndexedForSearch } from "@/data/indexing-policy";
import { canonicalUrl, siteUrl } from "@/lib/utils";
import { withoutBrandSuffix } from "@/lib/schema";

export const metadata: Metadata = {
  title: withoutBrandSuffix("Site map | FreeToolKit"),
  description:
    "Browse every FreeToolKit category hub, featured legal pages, blog guides, and links into the full tool directory for crawlers and visitors.",
  alternates: { canonical: canonicalUrl("/sitemap") },
  robots: { index: true, follow: true }
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
    <main>
      <Container className="max-w-5xl py-12 sm:py-16">
        <PageHeader
          eyebrow="Navigation"
          title="Site map"
          description="A structured map of FreeToolKit pages. Use it to discover categories, legal information, guides, and deep links into free tools."
          badges={["Internal links", "SEO friendly", "Mobile layout"]}
        />

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="font-display text-xl font-bold text-slate-950">Core pages</h2>
            <ul className="mt-4 grid gap-3 text-sm">
              {staticLinks.map((item) => (
                <li key={item.href}>
                  {item.external ? (
                    <a href={item.href} className="font-bold text-brand-700 hover:text-brand-900" rel="noopener noreferrer">
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="font-bold text-brand-700 hover:text-brand-900">
                      {item.label}
                    </Link>
                  )}
                  <p className="text-slate-600">{item.description}</p>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-6">
            <h2 className="font-display text-xl font-bold text-slate-950">Blog guides</h2>
            <ul className="mt-4 grid max-h-[28rem] gap-2 overflow-y-auto text-sm">
              {blogPosts.map((post) => (
                <li key={post.slug}>
                  <Link href={blogHref(post)} className="font-semibold text-brand-700 hover:text-brand-900">
                    {post.title}
                  </Link>
                  <span className="text-slate-500"> — {post.category}</span>
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
    <section className="mt-10 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-950">{category}</h2>
          <p className="mt-1 text-xs font-semibold text-slate-500">Listing search-indexed tools. All utilities (including previews) remain in the full directory.</p>
        </div>
        <Link href={hub} className="text-sm font-bold text-brand-700 hover:text-brand-900">
          Open category hub →
        </Link>
      </div>
      <ul className="mt-5 columns-1 gap-x-10 text-sm sm:columns-2 lg:columns-3">
        {tools.map((tool) => (
          <li key={tool.slug} className="break-inside-avoid py-1">
            <Link href={toolHref(tool)} className="text-slate-700 hover:text-brand-700">
              {tool.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

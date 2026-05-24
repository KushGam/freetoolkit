import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorByline } from "@/components/AuthorByline";
import { FAQ } from "@/components/FAQ";
import { RelatedBlogPosts } from "@/components/RelatedBlogPosts";
import { Badge, Container, PageHeader, ToolCard } from "@/components/ui";
import { blogHref, blogPosts, getBlogFaqs, getBlogPost, getBlogRelatedToolLinks, getRelatedBlogPosts } from "@/data/blog";
import { isBlogIndexedForSearch } from "@/data/indexing-policy";
import { categoryRoutes } from "@/data/tools";
import { buildBlogPostingSchema, buildBreadcrumbSchema, buildFaqSchema, withoutBrandSuffix } from "@/lib/schema";
import { canonicalUrl } from "@/lib/utils";

type BlogPostPageProps = {
  params: { slug: string };
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${date}T00:00:00Z`));
}

const blogCategoryRouteMap: Record<string, string> = {
  "PDF Guides": categoryRoutes["PDF Tools"],
  "Image Guides": categoryRoutes["Image Tools"],
  "Student Guides": categoryRoutes["Student Tools"],
  "Productivity Guides": "/calculators",
  "Text Guides": categoryRoutes["Text Tools"],
  "Security Guides": categoryRoutes["Security Tools"],
  "Gaming Guides": categoryRoutes["Gaming Tools"]
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};

  const canonical = canonicalUrl(blogHref(post));
  const indexed = isBlogIndexedForSearch(post.slug);

  return {
    title: withoutBrandSuffix(`${post.title} | freetoolkitapp Blog`),
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical },
    robots: indexed ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonical,
      siteName: "freetoolkitapp",
      type: "article",
      publishedTime: post.publishedAt,
      tags: post.keywords
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description
    }
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const relatedTools = getBlogRelatedToolLinks(post);
  const relatedPosts = getRelatedBlogPosts(post);
  const faqs = getBlogFaqs(post);
  const articleSchema = buildBlogPostingSchema({
    title: post.title,
    description: post.description,
    href: blogHref(post),
    publishedAt: post.publishedAt,
    keywords: post.keywords,
    section: post.category
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: blogHref(post) }
  ]);
  const faqSchema = buildFaqSchema(faqs);
  const contextLinks = [
    ...relatedTools.slice(0, 4).map((tool) => ({ label: tool.title, href: tool.href })),
    { label: post.category, href: blogCategoryRouteMap[post.category] ?? "/all-tools" },
    ...relatedPosts.slice(0, 2).map((related) => ({ label: related.title, href: blogHref(related) }))
  ];

  const linkifyParagraph = (paragraph: string) => {
    const lowerParagraph = paragraph.toLowerCase();
    const match = contextLinks.find((item) => lowerParagraph.includes(item.label.toLowerCase()));
    if (!match) return paragraph;

    const startIndex = lowerParagraph.indexOf(match.label.toLowerCase());
    const endIndex = startIndex + match.label.length;
    return (
      <>
        {paragraph.slice(0, startIndex)}
        <Link href={match.href} className="font-semibold text-indigo-400 transition hover:text-ink-primary">
          {paragraph.slice(startIndex, endIndex)}
        </Link>
        {paragraph.slice(endIndex)}
      </>
    );
  };

  return (
    <main className="mesh-bg min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Container className="max-w-5xl py-10">
        <Link href="/blog" className="text-sm font-black text-indigo-400 transition hover:text-ink-primary">
          ← Back to blog
        </Link>

        <PageHeader
          className="mt-5 text-left"
          eyebrow={post.category}
          title={post.title}
          description={post.description}
          badges={[formatDate(post.publishedAt), post.readingTime]}
        />
        <AuthorByline publishedAt={post.publishedAt} />

        <div className="mt-10 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-indigo-400">Contents</p>
              <nav className="mt-3 grid gap-2" aria-label="Table of contents">
                {post.content.map((section) => (
                  <a key={section.heading} href={`#${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`} className="text-sm font-bold leading-6 text-ink-muted hover:text-indigo-400">
                    {section.heading}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
          <article className="max-w-3xl">
            {post.content.map((section) => (
              <section key={section.heading} id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")} className="scroll-mt-24 mt-10 first:mt-0">
                <h2 className="font-display text-3xl font-bold tracking-tight text-ink-primary">{section.heading}</h2>
                <div className="mt-4 space-y-5">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-8 text-ink-secondary">
                      {linkifyParagraph(paragraph)}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </article>
        </div>

        <RelatedBlogPosts posts={relatedPosts} />
        <FAQ items={faqs} />

        {relatedTools.length ? (
          <section className="mt-14 border-t border-white/[0.08] pt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge className="border-indigo-400/20 bg-indigo-500/10 text-[11px] font-black uppercase tracking-wide text-indigo-400">Related tools</Badge>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink-primary">Try the tools mentioned in this guide</h2>
              </div>
              <Link href="/all-tools" className="text-sm font-black text-indigo-400 transition hover:text-ink-primary">
                See all tools →
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTools.map((tool) => (
                <ToolCard key={tool.slug} title={tool.title} description={tool.description} href={tool.href} category={tool.category} badge={tool.badge} />
              ))}
            </div>
          </section>
        ) : null}
        <section className="mt-10 rounded-2xl border border-white/[0.08] bg-surface-card p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-wide text-indigo-400">Continue the workflow</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href={blogCategoryRouteMap[post.category] ?? "/all-tools"} className="pill-link">
              Explore category tools
            </Link>
            <Link href="/all-tools" className="pill-link">
              Browse all tools
            </Link>
            <Link href="/blog" className="pill-link">
              More guides
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}

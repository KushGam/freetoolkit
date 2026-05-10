import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RelatedBlogPosts } from "@/components/RelatedBlogPosts";
import { Badge, Container, PageHeader, ToolCard } from "@/components/ui";
import { blogHref, blogPosts, getBlogPost, getBlogRelatedToolLinks, getRelatedBlogPosts } from "@/data/blog";
import { canonicalUrl, siteUrl } from "@/lib/utils";

type BlogPostPageProps = {
  params: { slug: string };
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${date}T00:00:00Z`));
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};

  const canonical = canonicalUrl(blogHref(post));

  return {
    title: `${post.title} | FreeToolKit Blog`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonical,
      siteName: "FreeToolKit",
      type: "article",
      publishedTime: post.publishedAt,
      tags: post.keywords
    }
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const relatedTools = getBlogRelatedToolLinks(post);
  const relatedPosts = getRelatedBlogPosts(post);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "FreeToolKit"
    },
    publisher: {
      "@type": "Organization",
      name: "FreeToolKit"
    },
    mainEntityOfPage: canonicalUrl(blogHref(post)),
    keywords: post.keywords.join(", ")
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: canonicalUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl(blogHref(post)) }
    ]
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Container className="max-w-5xl py-10">
        <Link href="/blog" className="text-sm font-black text-brand-700 transition hover:text-brand-900">
          ← Back to blog
        </Link>

        <PageHeader
          className="mt-5 text-left"
          eyebrow={post.category}
          title={post.title}
          description={post.description}
          badges={[formatDate(post.publishedAt), post.readingTime]}
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-black uppercase tracking-wide text-brand-600">Contents</p>
              <nav className="mt-3 grid gap-2" aria-label="Table of contents">
                {post.content.map((section) => (
                  <a key={section.heading} href={`#${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`} className="text-sm font-bold leading-6 text-slate-600 hover:text-brand-700">
                    {section.heading}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
          <article className="max-w-3xl">
            {post.content.map((section) => (
              <section key={section.heading} id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")} className="scroll-mt-24 mt-10 first:mt-0">
                <h2 className="font-display text-3xl font-bold tracking-tight text-slate-950">{section.heading}</h2>
                <div className="mt-4 space-y-5">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-base leading-8 text-slate-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </article>
        </div>

        <RelatedBlogPosts posts={relatedPosts} />

        {relatedTools.length ? (
          <section className="mt-14 border-t border-slate-200 pt-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Badge className="border-brand-100 bg-brand-50 text-[11px] font-black uppercase tracking-wide text-brand-700">Related tools</Badge>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-950">Try the tools mentioned in this guide</h2>
              </div>
              <Link href="/all-tools" className="text-sm font-black text-brand-700 transition hover:text-brand-900">
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
      </Container>
    </main>
  );
}

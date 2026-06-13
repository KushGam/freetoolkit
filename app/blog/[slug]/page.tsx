import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FAQ } from "@/components/FAQ";
import { RelatedBlogPosts } from "@/components/RelatedBlogPosts";
import { ToolCard } from "@/components/ui";
import { blogHref, blogPosts, getBlogFaqs, getBlogPost, getBlogRelatedToolLinks, getRelatedBlogPosts } from "@/data/blog";
import { isBlogIndexedForSearch } from "@/data/indexing-policy";
import { categoryRoutes } from "@/data/tools";
import { founder } from "@/data/site-trust";
import { buildBlogPostingSchema, buildBreadcrumbSchema, buildFaqSchema, withoutBrandSuffix } from "@/lib/schema";
import { canonicalUrl } from "@/lib/utils";
import { indexRobots, noindexRobots } from "@/lib/seo-robots";

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
  "Gaming Guides": categoryRoutes["Gaming Tools"],
  "Calculator Guides": categoryRoutes["Calculator Tools"],
  "Developer Guides": categoryRoutes["Developer Tools"],
  "SEO Guides": categoryRoutes["SEO Tools"]
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
    robots: indexed ? indexRobots : noindexRobots,
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
        <Link href={match.href} className="font-semibold text-gold transition hover:brightness-110">
          {paragraph.slice(startIndex, endIndex)}
        </Link>
        {paragraph.slice(endIndex)}
      </>
    );
  };

  return (
    <main className="min-h-screen bg-bg pt-[60px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="border-b border-border px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <Link href="/blog" className="text-sm font-medium text-text-2 transition hover:text-gold">
            ← Back to blog
          </Link>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.08em] text-gold">{post.category}</p>
          <h1 className="mt-3 font-heading text-[clamp(28px,4vw,42px)] font-extrabold tracking-tight text-text">{post.title}</h1>
          <p className="mt-4 text-[13px] text-text-3">
            {founder.name} · {formatDate(post.publishedAt)} · {post.readingTime}
          </p>
        </div>
      </header>

      <article className="prose-site mx-auto max-w-2xl px-6 py-12">
        {post.content.map((section) => (
          <section
            key={section.heading}
            id={section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}
            className="scroll-mt-24 mt-10 first:mt-0"
          >
            <h2>{section.heading}</h2>
            <div className="space-y-5">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{linkifyParagraph(paragraph)}</p>
              ))}
            </div>
          </section>
        ))}
      </article>

      <div className="mx-auto max-w-2xl px-6 pb-16">
        <RelatedBlogPosts posts={relatedPosts} />
        <FAQ items={faqs} />

        {relatedTools.length ? (
          <section className="mt-14 border-t border-border pt-10">
            <h2 className="font-heading text-2xl font-bold text-text">Try the tools mentioned in this guide</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {relatedTools.map((tool) => (
                <ToolCard key={tool.slug} title={tool.title} description={tool.description} href={tool.href} category={tool.category} badge={tool.badge} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10 rounded-2xl border border-border bg-bg2 p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-text-3">Continue the workflow</p>
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
      </div>
    </main>
  );
}

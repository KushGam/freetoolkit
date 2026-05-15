import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, Container, PageHeader } from "@/components/ui";
import { blogHref, blogPosts } from "@/data/blog";
import { isBlogIndexedForSearch } from "@/data/indexing-policy";
import { canonicalUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FreeToolKit Blog | Free Tool Guides for PDFs, Images, AI, and Daily Work",
  description: "Read practical FreeToolKit guides for PDF workflows, image optimization, student tools, writing utilities, gaming helpers, online security, and everyday productivity.",
  keywords: ["FreeToolKit blog", "online tool guides", "PDF guides", "image tool guides", "student tools", "productivity tools"],
  alternates: { canonical: canonicalUrl("/blog") },
  openGraph: {
    title: "FreeToolKit Blog | Practical Guides for Free Online Tools",
    description: "Helpful guides for using free browser-based tools for PDFs, images, writing, study, security, and daily productivity.",
    url: canonicalUrl("/blog"),
    siteName: "FreeToolKit",
    type: "website"
  }
};

const indexedBlogPosts = blogPosts.filter((post) => isBlogIndexedForSearch(post.slug));
const categories = Array.from(new Set(indexedBlogPosts.map((post) => post.category)));

export default function BlogPage() {
  return (
    <main>
      <Container className="max-w-7xl py-10">
        <PageHeader
          eyebrow="FreeToolKit guides"
          title="Practical guides for free online tools"
          description="Learn how to handle common PDF, image, writing, study, gaming, security, and productivity tasks with simple browser-based workflows."
          badges={categories}
        />

        <section className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-brand-600">Latest articles</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950">Tool guides and workflow tips</h2>
            </div>
            <Link href="/all-tools" className="text-sm font-black text-brand-700 transition hover:text-brand-900">
              Browse all tools →
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {indexedBlogPosts.map((post) => (
              <Link key={post.slug} href={blogHref(post)} className="group block h-full focus:outline-none focus:ring-4 focus:ring-brand-100">
                <Card className="flex h-full flex-col p-6 group-hover:-translate-y-1 group-hover:border-brand-200">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="border-brand-100 bg-brand-50 text-[11px] font-black uppercase tracking-wide text-brand-700">{post.category}</Badge>
                    <span className="text-xs font-bold text-slate-500">{post.readingTime}</span>
                  </div>
                  <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-slate-950 group-hover:text-brand-700">{post.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{post.description}</p>
                  <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
                    <time className="text-xs font-bold text-slate-500" dateTime={post.publishedAt}>
                      {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${post.publishedAt}T00:00:00Z`))}
                    </time>
                    <span className="text-sm font-black text-brand-700 transition group-hover:translate-x-1">Read guide →</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}

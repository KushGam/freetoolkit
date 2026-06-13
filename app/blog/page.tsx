import type { Metadata } from "next";
import Link from "next/link";
import { blogHref, blogPosts } from "@/data/blog";
import { isBlogIndexedForSearch } from "@/data/indexing-policy";
import { canonicalUrl } from "@/lib/utils";
import { indexRobots } from "@/lib/seo-robots";

export const metadata: Metadata = {
  title: "FreeToolKit Blog | Free Tool Guides — PDF, Image, AI, India",
  description:
    "Practical guides for PDF tools, image converters, EMI calculators, resume writing, and productivity tools. Free, no signup.",
  keywords: ["freetoolkitapp blog", "online tool guides", "PDF guides", "image tool guides", "student tools", "productivity tools"],
  alternates: { canonical: canonicalUrl("/blog") },
  robots: indexRobots,
  openGraph: {
    title: "freetoolkitapp Blog | Practical Guides for Free Online Tools",
    description: "Helpful guides for using free browser-based tools for PDFs, images, writing, study, security, and daily productivity.",
    url: canonicalUrl("/blog"),
    siteName: "freetoolkitapp",
    type: "website"
  }
};

const indexedBlogPosts = blogPosts.filter((post) => isBlogIndexedForSearch(post.slug));

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-bg pt-[60px]">
      <header className="border-b border-border bg-bg2 px-6 py-16 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gold">Blog &amp; Guides</p>
        <h1 className="mt-2 font-heading text-[42px] font-extrabold tracking-tight text-text">Learn the fastest workflows</h1>
        <p className="mx-auto mt-3 max-w-xl text-[17px] text-text-2">
          Practical guides for PDF, image, AI, SEO, and developer tools.
        </p>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {indexedBlogPosts.map((post) => (
            <Link
              key={post.slug}
              href={blogHref(post)}
              className="group flex flex-col rounded-2xl border border-border bg-bg2 p-6 transition-all hover:border-border-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-gold">{post.category}</p>
              <h2 className="mb-2 text-[15px] font-semibold leading-snug text-text">{post.title}</h2>
              <p className="mb-4 flex-1 text-[13px] leading-relaxed text-text-2">{post.description}</p>
              <p className="text-[11px] text-text-3">{post.readingTime}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

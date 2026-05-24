import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { HomeSeoContent } from "@/components/HomeSeoContent";
import { HomeToolSearch } from "@/components/HomeToolSearch";
import { HomeTrustStrip } from "@/components/HomeTrustStrip";
import { Badge, Card, CategoryCard, Container, ToolCard } from "@/components/ui";
import { blogHref, blogPosts } from "@/data/blog";
import { isToolIndexedForSearch } from "@/data/indexing-policy";
import { getToolsByTopLevelCategory, tools, toolHref, topLevelCategories, topLevelCategoryRoutes, type Tool, type TopLevelCategory } from "@/data/tools";
import { canonicalUrl, siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Modern AI Productivity Toolkit | PDF, Image & SEO Tools",
  description: "Free browser tools for AI writing, PDFs, images, SEO metadata, developer utilities, and calculators. Curated for quality—no signup required.",
  keywords: ["free online tools", "AI tools", "PDF tools", "image tools", "SEO tools", "productivity tools", "developer tools"],
  alternates: { canonical: canonicalUrl("/") },
  openGraph: {
    title: "freetoolkitapp — Modern AI Productivity Toolkit",
    description: "Curated free tools for AI writing, PDFs, images, SEO, developers, and everyday calculations.",
    url: siteUrl,
    siteName: "freetoolkitapp",
    type: "website"
  }
};

const popularSlugs = [
  "merge-pdf",
  "compress-pdf",
  "image-compressor",
  "ai-resume-cover-letter",
  "pdf-to-word",
  "grammar-fixer"
];

const recentlyAddedSlugs = [
  "meta-tag-generator",
  "open-graph-generator",
  "robots-txt-generator",
  "sitemap-generator",
  "schema-markup-generator",
  "resume-ats-checker"
];

const secondaryPopularSlugs = [
  "split-pdf",
  "pdf-to-jpg",
  "webp-converter",
  "bmi-calculator",
  "json-formatter",
  "paraphrasing-tool"
];

const heroTools = [
  {
    title: "Merge PDF",
    copy: "Combine documents in your browser",
    icon: "PDF",
    href: "/merge-pdf"
  },
  {
    title: "Image Compressor",
    copy: "Shrink photos before upload",
    icon: "IMG",
    href: "/image-compressor"
  },
  {
    title: "AI Resume Writer",
    copy: "Draft resumes & cover letters",
    icon: "AI",
    href: "/ai-resume-cover-letter"
  }
];

const categoryDetails: Record<TopLevelCategory, { href: string; icon: string; description: string }> = {
  "AI Tools": {
    href: topLevelCategoryRoutes["AI Tools"],
    icon: "AI",
    description: "Resume writing, grammar, essays, study notes, summarizing, paraphrasing, and interview prep."
  },
  "PDF & Image": {
    href: topLevelCategoryRoutes["PDF & Image"],
    icon: "DOC",
    description: "Merge, split, compress, convert, resize, crop, and watermark PDFs and images."
  },
  "SEO Tools": {
    href: topLevelCategoryRoutes["SEO Tools"],
    icon: "SEO",
    description: "Meta tags, Open Graph, robots.txt, sitemaps, SERP previews, slugs, and schema markup."
  },
  Developer: {
    href: topLevelCategoryRoutes.Developer,
    icon: "DEV",
    description: "JSON, regex, JWT, SQL, URL encoding, Base64, and cURL-to-fetch conversion."
  },
  Calculators: {
    href: topLevelCategoryRoutes.Calculators,
    icon: "CAL",
    description: "BMI, loan EMI, percentages, discounts, age, interest, units, and scientific math."
  }
};

const trustBadges = ["No signup", "Browser-based", "Founder-led", "Curated quality"];

const whyCards = [
  {
    title: "Focused catalog",
    copy: "About 60 high-traffic tools instead of hundreds of thin utilities—better depth, clearer topical authority."
  },
  {
    title: "Private by design",
    copy: "File tools run in your browser where possible. AI tools use only the text or image needed for your request."
  },
  {
    title: "No signup",
    copy: "Open a tool, finish the job, and leave. No account wall or dashboard required."
  },
  {
    title: "Editorial depth",
    copy: "Each tool page includes how-to steps, FAQs, use cases, and links to related workflows."
  }
];

const homeFaqs = [
  ["Is freetoolkitapp free to use?", "Yes. All curated tools are free with no signup required."],
  ["Are my files uploaded?", "Many PDF and image tools process files locally in your browser. AI tools send only the text or image needed to generate results."],
  [
    "What tools are most popular?",
    "Merge PDF, Compress PDF, Image Compressor, PDF to Word, AI Resume Writer, and Grammar Fixer are common starting points."
  ],
  ["Does freetoolkitapp work on mobile?", "Yes. Layouts and controls are built for phones, tablets, and desktops."],
  ["Can I use these tools for work or study?", "Yes—for documents, applications, content workflows, calculations, and developer tasks. Always review AI outputs before submitting."]
];

function pickIndexedTools(slugs: string[]) {
  return slugs
    .map((slug) => tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is Tool => tool !== undefined)
    .filter((tool) => isToolIndexedForSearch(tool.slug));
}

export default function HomePage() {
  const trendingTools = pickIndexedTools(popularSlugs);
  const popularTools = pickIndexedTools(secondaryPopularSlugs);
  const recentlyAddedTools = pickIndexedTools(recentlyAddedSlugs);
  const latestPosts = blogPosts
    .filter((post) => post.slug !== "valorant-sensitivity-guide" && post.slug !== "palworld-breeding-guide")
    .slice(0, 3);

  return (
    <main className="mesh-bg overflow-hidden">
      <section className="relative border-b border-white/10">
        <Container className="grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_400px] lg:py-24">
          <div className="max-w-4xl text-center lg:text-left">
            <Badge className="mx-auto lg:mx-0">Modern AI productivity toolkit · no signup</Badge>
            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-gradient sm:text-5xl lg:mx-0 lg:text-6xl">
              PDF, image &amp; AI tools — curated for quality
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg lg:mx-0">
              Merge and compress PDFs, optimize images, draft AI resumes, fix grammar, and ship SEO metadata — about 60 deep tools, not hundreds of thin pages.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:justify-start">
              <Link href="/all-tools" className="btn-primary text-center">
                Browse all tools
              </Link>
              <Link href="/pdf-image" className="btn-secondary text-center">
                PDF &amp; Image hub
              </Link>
            </div>
            <div className="mx-auto mt-6 text-left lg:mx-0">
              <HomeToolSearch />
            </div>
            <HomeTrustStrip />
            <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2 lg:mx-0 lg:justify-start">
              {trustBadges.map((badge) => (
                <span key={badge} className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-ink-muted">
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto hidden w-full max-w-md lg:block">
            <div className="glass-panel overflow-hidden rounded-2xl p-5 shadow-glow">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Start fast</p>
                <Link href="/all-tools" className="text-xs text-ink-muted hover:text-ink-secondary">
                  All tools →
                </Link>
              </div>
              <div className="grid gap-2">
                {heroTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.05]"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[10px] font-semibold text-ink-muted">
                      {tool.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-ink-secondary group-hover:text-white">{tool.title}</span>
                      <span className="block text-xs text-ink-muted">{tool.copy}</span>
                    </span>
                    <span className="ml-auto text-ink-muted group-hover:text-ink-secondary" aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="max-w-6xl py-10">
        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Trending now</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-ink-primary sm:text-4xl">High-traffic productivity tools</h2>
            </div>
            <Link href="/all-tools" className="text-sm font-medium text-ink-muted transition hover:text-ink-secondary">
              View all tools →
            </Link>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trendingTools.map((tool) => (
              <ToolCard key={tool!.slug} title={tool!.title} description={tool!.description} href={toolHref(tool!)} category={tool!.category} badge={tool!.badge} />
            ))}
          </div>
        </section>

        <AdSlot type="responsive" />

        <section className="mt-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-400">Platform categories</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">Browse by Category</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {topLevelCategories.map((category) => {
              const details = categoryDetails[category];
              const categoryTools = getToolsByTopLevelCategory(category)
                .filter((tool) => isToolIndexedForSearch(tool.slug))
                .slice(0, 3);
              return (
                <CategoryCard key={category} title={category} description={details.description} href={details.href} icon={details.icon} tools={categoryTools.map((tool) => tool.title)} />
              );
            })}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-400">Popular tools</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">Quick tools people use every day</h2>
            </div>
            <Link href="/calculators" className="text-sm font-medium text-ink-muted transition hover:text-ink-secondary">
              Browse calculators →
            </Link>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <ToolCard key={tool!.slug} title={tool!.title} description={tool!.description} href={toolHref(tool!)} category={tool!.category} badge={tool!.badge} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-400">Recently added</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">Fresh utilities worth bookmarking</h2>
            </div>
            <Link href="/all-tools" className="text-sm font-medium text-ink-muted transition hover:text-ink-secondary">
              Browse directory →
            </Link>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentlyAddedTools.map((tool) => (
              <ToolCard key={tool!.slug} title={tool!.title} description={tool!.description} href={toolHref(tool!)} category={tool!.category} badge={tool!.badge} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-400">Trust basics</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">Why freetoolkitapp?</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((card, index) => (
              <Card key={card.title} className="p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface-section text-xs font-semibold text-indigo-400">0{index + 1}</span>
                <h3 className="mt-4 text-lg font-bold tracking-tight text-ink-primary">{card.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-muted">{card.copy}</p>
              </Card>
            ))}
          </div>
        </section>

        <HomeSeoContent />

        <section className="mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-400">Latest guides</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">Learn the fastest tool workflows</h2>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-indigo-400 hover:text-ink-primary">
              Read the blog →
            </Link>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {latestPosts.map((post) => (
              <Link key={post.slug} href={blogHref(post)} className="group block h-full focus:outline-none focus:ring-4 focus:ring-indigo-400/30">
                <Card className="flex h-full flex-col p-6  group-hover:border-indigo-400/30">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-400">{post.category}</p>
                  <h3 className="mt-3 text-lg font-bold tracking-tight text-ink-primary group-hover:text-indigo-400">{post.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-ink-muted">{post.description}</p>
                  <p className="mt-4 text-xs font-bold text-ink-muted">{post.readingTime}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-400">FAQ</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">Questions about freetoolkitapp</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {homeFaqs.map(([question, answer]) => (
              <Card key={question} className="p-6">
                <h3 className="text-base font-bold tracking-tight text-ink-primary">{question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{answer}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-surface-card to-surface-main p-6 text-center shadow-glow sm:p-10">
          <h2 className="font-display text-3xl font-bold tracking-tight text-ink-primary sm:text-4xl">Start with a free tool now</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
            Pick a popular tool and finish your next PDF, image, or writing task in a few clicks.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/merge-pdf" className="btn-primary">Merge PDF</Link>
            <Link href="/image-compressor" className="btn-secondary">Compress an Image</Link>
            <Link href="/ai-resume-cover-letter" className="btn-secondary">Draft a Resume</Link>
          </div>
        </section>
      </Container>
    </main>
  );
}

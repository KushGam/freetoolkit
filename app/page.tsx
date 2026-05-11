import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { HomeToolSearch } from "@/components/HomeToolSearch";
import { Badge, Card, CategoryCard, Container, ToolCard } from "@/components/ui";
import { blogHref, blogPosts } from "@/data/blog";
import { getToolsByTopLevelCategory, tools, toolHref, topLevelCategories, topLevelCategoryRoutes, type TopLevelCategory } from "@/data/tools";
import { canonicalUrl, siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Free AI & Everyday Productivity Tools",
  description: "Use 138 free browser-based tools for AI writing, PDFs, images, resumes, SEO, social media, calculators, student work, text cleanup, security, and developer utilities.",
  keywords: ["free online tools", "AI tools", "PDF tools", "image tools", "student tools", "productivity tools", "developer tools"],
  alternates: { canonical: canonicalUrl("/") },
  openGraph: {
    title: "FreeToolKit — Free AI & Everyday Productivity Tools",
    description: "Fast free tools for AI writing, PDFs, images, resumes, calculators, students, developers, and everyday browser tasks.",
    url: siteUrl,
    siteName: "FreeToolKit",
    type: "website"
  }
};

const popularSlugs = [
  "ai-resume-cover-letter",
  "image-to-pdf",
  "ai-image-to-word",
  "ai-text-summarizer",
  "qr-code-generator",
  "pdf-to-word"
];

const secondaryPopularSlugs = [
  "image-compressor",
  "merge-pdf",
  "pdf-to-jpg",
  "qr-code-generator",
  "discount-calculator",
  "bmi-calculator"
];

const heroTools = [
  {
    title: "Image Compressor",
    copy: "Reduce image size in seconds",
    icon: "IMG",
    href: "/image-compressor"
  },
  {
    title: "Merge PDF",
    copy: "Combine documents privately",
    icon: "PDF",
    href: "/merge-pdf"
  },
  {
    title: "GPA Calculator",
    copy: "Plan academic results",
    icon: "GPA",
    href: "/gpa-calculator"
  }
];

const categoryDetails: Record<TopLevelCategory, { href: string; icon: string; description: string }> = {
  Everyday: {
    href: topLevelCategoryRoutes.Everyday,
    icon: "DAY",
    description: "Fast calculators, text cleanup, QR codes, passwords, and daily browser productivity tools."
  },
  "AI Tools": {
    href: topLevelCategoryRoutes["AI Tools"],
    icon: "AI",
    description: "AI writing, summarizing, resume, captions, hashtags, and productivity assistants."
  },
  Student: {
    href: topLevelCategoryRoutes.Student,
    icon: "EDU",
    description: "GPA, grades, attendance, study notes, writing checks, and student calculators."
  },
  Developer: {
    href: topLevelCategoryRoutes.Developer,
    icon: "DEV",
    description: "JSON, URL encoding, UUID, Base64, and quick web utilities for developers."
  },
  "PDF & Image": {
    href: topLevelCategoryRoutes["PDF & Image"],
    icon: "DOC",
    description: "Convert, compress, merge, edit, unlock, and prepare PDFs and images in your browser."
  },
  "SEO Tools": {
    href: topLevelCategoryRoutes["SEO Tools"],
    icon: "SEO",
    description: "Create meta tags, SERP previews, robots.txt, sitemaps, slugs, and schema markup."
  },
  "Social Media Tools": {
    href: topLevelCategoryRoutes["Social Media Tools"],
    icon: "SOC",
    description: "Prepare captions, hashtags, bios, tags, counters, and formatted social post copy."
  }
};

const trustBadges = ["No signup", "Browser-based", "Free", "Fast"];

const whyCards = [
  {
    title: "Fast",
    copy: "Open the page, complete the task, and keep moving. The interface is designed for quick repeat workflows."
  },
  {
    title: "Private",
    copy: "File tools run in your browser where possible, and AI tools use a protected generation flow."
  },
  {
    title: "No signup",
    copy: "No account wall, no unnecessary dashboard, and no payment step for everyday productivity tasks."
  },
  {
    title: "Browser-based",
    copy: "Many image, PDF, calculator, text, and developer tools work directly on your device."
  }
];

const homeFaqs = [
  ["Is FreeToolKit free to use?", "Yes. FreeToolKit provides free AI and everyday productivity tools with no signup required."],
  ["Are my files uploaded?", "File tools are designed to process in your browser where supported. AI tools use only the text or image needed to generate the requested result."],
  ["What tools are most popular?", "High-value tools include AI Resume Generator, Image to PDF, AI Image to Word, PDF to Word, QR Code Generator, and Text Summarizer."],
  ["Does FreeToolKit work on mobile?", "Yes. The layout, controls, and tool cards are built for phones, tablets, and desktops."],
  ["Can I use these tools for work or study?", "Yes. The site is useful for documents, applications, assignments, content workflows, calculations, and developer tasks."]
];

export default function HomePage() {
  const trendingTools = popularSlugs.map((slug) => tools.find((tool) => tool.slug === slug)).filter(Boolean);
  const popularTools = secondaryPopularSlugs.map((slug) => tools.find((tool) => tool.slug === slug)).filter(Boolean);
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-slate-200/70 bg-[radial-gradient(circle_at_18%_8%,#fef2f2,transparent_30%),radial-gradient(circle_at_82%_18%,#ffffff,transparent_26%),linear-gradient(180deg,#ffffff_0%,#fafafa_100%)]">
        <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-20">
          <div className="max-w-4xl text-center lg:text-left">
            <Badge className="mx-auto border-brand-100 text-[11px] font-semibold uppercase tracking-wide text-brand-700 sm:text-xs lg:mx-0">
              Free AI & everyday productivity tools
            </Badge>
            <h1 className="mx-auto mt-5 max-w-4xl font-display text-4xl font-bold leading-[1.04] tracking-tight text-slate-950 sm:text-5xl lg:mx-0 lg:text-6xl">
              Free AI & Everyday Productivity Tools
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg lg:mx-0">
              Use fast browser-based tools for AI writing, resumes, PDFs, images, calculators, study workflows, and developer tasks. No signup, no clutter, just useful productivity tools.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:justify-start">
              <Link href="/all-tools" className="rounded-2xl bg-gradient-to-b from-brand-500 to-brand-700 px-6 py-3 text-center text-sm font-bold text-white shadow-[0_16px_35px_rgba(127,29,29,0.24)] transition hover:-translate-y-0.5 hover:from-brand-600 hover:to-brand-700">
                Browse All Tools
              </Link>
              <Link href="/ai-tools" className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-center text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                Explore AI Tools
              </Link>
            </div>
            <div className="mx-auto text-left">
              <HomeToolSearch />
            </div>
            <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2.5 lg:mx-0 lg:justify-start">
              {trustBadges.map((badge) => (
                <span key={badge} className="rounded-full border border-slate-200 bg-white/85 px-3.5 py-2 text-[11px] font-semibold text-slate-700 shadow-sm sm:text-xs">
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto hidden w-full max-w-md lg:block">
            <div className="absolute -left-8 top-10 h-56 w-56 rounded-full bg-brand-100/70 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-[0_30px_80px_rgba(17,24,39,0.12)] backdrop-blur">
              <div className="mb-4 flex items-center justify-between gap-4 px-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Start fast</p>
                <Link href="/all-tools" className="text-xs font-semibold text-slate-500 transition hover:text-brand-700">
                  All tools →
                </Link>
              </div>
              <div className="grid gap-3">
                {heroTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-white hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-brand-100"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-xs font-semibold text-brand-700 ring-1 ring-brand-100 transition group-hover:bg-brand-600 group-hover:text-white">
                      {tool.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-950 transition group-hover:text-brand-700">{tool.title}</span>
                      <span className="block text-sm text-slate-500">{tool.copy}</span>
                    </span>
                    <span className="ml-auto text-lg font-black text-brand-500 transition group-hover:translate-x-1" aria-hidden="true">
                      →
                    </span>
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
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Trending now</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">High-value productivity tools</h2>
            </div>
            <Link href="/all-tools" className="text-sm font-semibold text-brand-700 hover:text-brand-900">
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
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Platform categories</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Browse by Category</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {topLevelCategories.map((category) => {
              const details = categoryDetails[category];
              const categoryTools = getToolsByTopLevelCategory(category).slice(0, 3);
              return (
                <CategoryCard key={category} title={category} description={details.description} href={details.href} icon={details.icon} tools={categoryTools.map((tool) => tool.title)} />
              );
            })}
          </div>
        </section>

        <section className="mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Popular tools</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Quick tools people use every day</h2>
            </div>
            <Link href="/everyday" className="text-sm font-semibold text-brand-700 hover:text-brand-900">
              Browse everyday →
            </Link>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <ToolCard key={tool!.slug} title={tool!.title} description={tool!.description} href={toolHref(tool!)} category={tool!.category} badge={tool!.badge} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Trust basics</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Why FreeToolKit?</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((card, index) => (
              <Card key={card.title} className="p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-xs font-semibold text-brand-700">0{index + 1}</span>
                <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-950">{card.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{card.copy}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="prose-lite mt-16 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:p-8">
          <h2>Free AI and Everyday Productivity Tools</h2>
          <p>
            FreeToolKit is built as a modern productivity platform for people who need quick answers without installing extra software or creating an account. The site brings together free AI tools, PDF utilities, image converters, student calculators, writing helpers, and developer tools in one clean browser-based workspace. Instead of treating tools as a cluttered directory, FreeToolKit organizes them around real workflows: prepare a resume, convert an image, clean text, create a PDF, summarize notes, calculate a result, or format developer data.
          </p>
          <p>
            The <Link href="/ai-tools" className="font-bold text-brand-700 hover:text-brand-900">AI Tools</Link> section helps with summaries, captions, hashtags, email drafts, study notes, ATS checks, and resume support. The <Link href="/pdf-image" className="font-bold text-brand-700 hover:text-brand-900">PDF & Image</Link> section focuses on practical file workflows such as Image to PDF, PDF to Word, PDF to JPG, Merge PDF, Image Compressor, and AI Image to Word. The <Link href="/student" className="font-bold text-brand-700 hover:text-brand-900">Student</Link> section keeps grade planning, attendance, study timers, and writing checks easy to reach, while the <Link href="/developer" className="font-bold text-brand-700 hover:text-brand-900">Developer</Link> section covers JSON, Base64, URL encoding, and UUID generation.
          </p>
          <p>
            Every page is designed for fast mobile and desktop use. Inputs are large, cards are easy to scan, outputs are clear, and related tools keep the next step nearby. File tools are browser-based where possible, while AI tools use a protected generation flow with clear review steps. That balance helps FreeToolKit feel fast, trustworthy, and practical for everyday tasks, schoolwork, content creation, job applications, office documents, and lightweight technical workflows.
          </p>
          <h2>A cleaner alternative to scattered utility sites</h2>
          <p>
            Many online utility pages feel crowded, outdated, or confusing. FreeToolKit aims for a calmer SaaS-style experience: clear navigation, modern typography, concise helper text, and tool cards that explain exactly what each page does. You can search across all tools, browse focused categories, or start from trending workflows like AI Resume Generator, PDF to Word, AI Image to Word, Text Summarizer, QR Code Generator, and Image to PDF. The goal is simple: free online productivity tools that feel premium, work quickly, and remain easy to trust.
          </p>
        </section>

        <section className="mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">Latest guides</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Learn the fastest tool workflows</h2>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-brand-700 hover:text-brand-900">
              Read the blog →
            </Link>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {latestPosts.map((post) => (
              <Link key={post.slug} href={blogHref(post)} className="group block h-full focus:outline-none focus:ring-4 focus:ring-brand-100">
                <Card className="flex h-full flex-col p-6 group-hover:-translate-y-1 group-hover:border-brand-200">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{post.category}</p>
                  <h3 className="mt-3 text-lg font-bold tracking-tight text-slate-950 group-hover:text-brand-700">{post.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{post.description}</p>
                  <p className="mt-4 text-xs font-bold text-slate-500">{post.readingTime}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">FAQ</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Questions about FreeToolKit</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {homeFaqs.map(([question, answer]) => (
              <Card key={question} className="p-6">
                <h3 className="text-base font-bold tracking-tight text-slate-950">{question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{answer}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-brand-100 bg-[radial-gradient(circle_at_top_left,#fef2f2,transparent_36%),linear-gradient(135deg,#ffffff,#fafafa)] p-6 text-center shadow-[0_24px_70px_rgba(127,29,29,0.1)] sm:p-10">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Start with a free tool now</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            Pick a popular tool and finish your next image, PDF, or student task in a few clicks.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/image-compressor" className="rounded-2xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700">Compress an Image</Link>
            <Link href="/merge-pdf" className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-brand-50">Merge PDF</Link>
            <Link href="/gpa-calculator" className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-brand-50">Calculate GPA</Link>
          </div>
        </section>
      </Container>
    </main>
  );
}

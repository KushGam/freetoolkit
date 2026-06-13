import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { GhostButton, PrimaryButton, SecondaryButton } from "@/components/Buttons";
import { CategoryHubCard } from "@/components/CategoryHubCard";
import { Divider } from "@/components/ui/Divider";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ToolCard } from "@/components/ui/ToolCard";
import { canonicalUrl, siteUrl } from "@/lib/utils";
import { indexRobots } from "@/lib/seo-robots";

export const metadata: Metadata = {
  title: "Modern AI Productivity Toolkit | PDF, Image & SEO Tools",
  description: "Free browser tools for AI writing, PDFs, images, SEO metadata, developer utilities, and calculators. Curated for quality—no signup required.",
  keywords: ["free online tools", "AI tools", "PDF tools", "image tools", "SEO tools", "productivity tools", "developer tools"],
  alternates: { canonical: canonicalUrl("/") },
  robots: indexRobots,
  openGraph: {
    title: "freetoolkitapp — Modern AI Productivity Toolkit",
    description: "Curated free tools for AI writing, PDFs, images, SEO, developers, and everyday calculations.",
    url: siteUrl,
    siteName: "freetoolkitapp",
    type: "website"
  }
};

const stats = [
  { value: "69", label: "Curated tools" },
  { value: "5", label: "Tool categories" },
  { value: "0", label: "Signups needed" },
  { value: "100%", label: "Free forever" }
];

const categories = [
  {
    emoji: "🤖",
    title: "AI Tools",
    href: "/ai-tools",
    accent: "#a78bfa",
    description: "Resumes, grammar, study notes, paraphrasing.",
    tags: ["Resume Writer", "Grammar Fixer", "Study Notes"]
  },
  {
    emoji: "📄",
    title: "PDF & Image",
    href: "/pdf-image",
    accent: "#f87171",
    description: "Merge, split, compress, convert, resize.",
    tags: ["Merge PDF", "Compress", "HEIC→JPG"]
  },
  {
    emoji: "📈",
    title: "SEO Tools",
    href: "/seo-tools",
    accent: "#34d399",
    description: "Meta tags, Open Graph, schema, SERP preview.",
    tags: ["Meta Tags", "Schema", "SERP Preview"]
  },
  {
    emoji: "⌨️",
    title: "Developer",
    href: "/developer",
    accent: "#60a5fa",
    description: "JSON, regex, JWT, SQL, Base64, cURL→fetch.",
    tags: ["JSON Format", "JWT Decode", "Regex"]
  },
  {
    emoji: "🧮",
    title: "Calculators",
    href: "/calculators",
    accent: "#fbbf24",
    description: "BMI, loan EMI, percentages, age, units.",
    tags: ["EMI Calc", "BMI", "GPA"]
  }
];

const trendingTools = [
  { slug: "merge-pdf", category: "pdf", name: "Merge PDF", desc: "Combine multiple PDFs in your browser.", privacy: "🔒 Browser only", featured: false },
  { slug: "compress-pdf", category: "pdf", name: "Compress PDF", desc: "Reduce size without uploading to any server.", privacy: "🔒 No upload", featured: false },
  { slug: "heic-to-jpg", category: "img", name: "HEIC to JPG", desc: "Convert iPhone photos to JPG. No install.", privacy: "🔒 Browser only", featured: true },
  { slug: "image-compressor", category: "img", name: "Image Compressor", desc: "Compress JPG, PNG, WebP with quality slider.", privacy: "🔒 Browser only", featured: false },
  { slug: "resume-ats-checker", category: "ai", name: "Resume ATS Checker", desc: "Match resume to job description. Free.", privacy: "✦ AI powered", featured: true },
  { slug: "ai-resume-cover-letter", category: "ai", name: "AI Resume Writer", desc: "Draft tailored resumes and cover letters.", privacy: "✦ AI powered", featured: false },
  { slug: "loan-emi-calculator", category: "calc", name: "Loan EMI Calculator", desc: "Home loan EMI with prepayment. India-ready.", privacy: "⚡ Instant", featured: true },
  { slug: "json-formatter", category: "dev", name: "JSON Formatter", desc: "Format, validate, minify JSON. Zero ads.", privacy: "🔒 Client side", featured: false },
  { slug: "jwt-decoder", category: "dev", name: "JWT Decoder", desc: "Decode JWT tokens. Nothing sent to server.", privacy: "🔒 No upload", featured: false }
];

const whyCards = [
  { icon: "🎯", title: "Focused catalog", copy: "69 curated tools instead of hundreds of thin pages. Every tool earns its place." },
  { icon: "🔒", title: "Private by design", copy: "PDF and image tools run locally in your browser. Your files never leave your device." },
  { icon: "⚡", title: "No signup ever", copy: "Open a tool, finish the job, and leave. No account required." },
  { icon: "📖", title: "Editorial depth", copy: "Every tool page has how-to steps, FAQs, use cases, and related guides." }
];

const blogPosts = [
  {
    tag: "PDF Guides",
    href: "/blog/how-to-compress-pdf-files",
    title: "How to Compress PDF Files Online",
    description: "Practical ways to reduce PDF size and when browser tools help.",
    readTime: "5 min read"
  },
  {
    tag: "Image Guides",
    href: "/blog/how-to-compress-images-without-losing-quality",
    title: "Compress Images Without Losing Quality",
    description: "Reduce JPG, PNG, WebP sizes while keeping them sharp.",
    readTime: "5 min read"
  },
  {
    tag: "Image Guides",
    href: "/blog/png-vs-jpg-vs-webp",
    title: "PNG vs JPG vs WebP: Which Format?",
    description: "Compare formats so you can pick the right one every time.",
    readTime: "6 min read"
  }
];

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" strokeLinecap="round" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main className="bg-bg">
      {/* Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-[60px] text-center sm:px-6">
        <div className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block" aria-hidden="true">
          <div className="absolute -left-20 -top-32 h-[500px] w-[500px] animate-drift rounded-full bg-[#F5A623] opacity-[0.18] blur-[100px]" />
          <div className="absolute -right-16 top-10 h-[400px] w-[400px] animate-drift-alt rounded-full bg-[#7c3aed] opacity-[0.14] blur-[100px]" />
          <div className="absolute -bottom-16 left-[35%] h-[300px] w-[300px] animate-drift rounded-full bg-[#0ea5e9] opacity-[0.11] blur-[80px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-3xl">
          <span className="mb-7 inline-flex min-h-[32px] items-center gap-2 rounded-full border border-[rgba(245,166,35,0.28)] bg-[rgba(245,166,35,0.1)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-gold sm:px-4 sm:py-1.5 sm:text-[11px]">
            <span className="hidden h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gold md:inline-block" />
            69 tools · no signup · browser-first
          </span>

          <h1 className="mb-5 font-heading text-[clamp(28px,6vw,70px)] font-extrabold leading-[1.06] tracking-[-0.03em] text-text">
            The toolkit that gets
            <br />
            <span className="text-shimmer">things done</span>
          </h1>

          <p className="mx-auto mb-8 max-w-[520px] text-[15px] leading-relaxed text-text-2 sm:text-[17px]">
            PDF, image, AI, SEO, developer, and calculator tools —
            curated for quality, not quantity. Open a tool, finish the job, leave.
          </p>

          <form action="/all-tools" method="get" className="relative mx-auto mb-8 w-full sm:max-w-[480px]">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-3">
              <SearchIcon />
            </span>
            <input
              type="search"
              name="q"
              placeholder='Search — try "heic to jpg" or "json formatter"'
              autoComplete="off"
              className="min-h-[48px] w-full rounded-xl border border-border-hi bg-bg3 py-3 pl-11 pr-4 text-[16px] text-text placeholder:text-text-3 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold-glow sm:text-sm"
            />
          </form>

          <div className="mb-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <PrimaryButton href="/all-tools" className="w-full min-h-[48px] py-3 text-[15px] sm:w-auto">
              Browse all tools →
            </PrimaryButton>
            <SecondaryButton href="/pdf-image" className="w-full min-h-[48px] py-3 text-[15px] sm:w-auto">
              PDF &amp; Image hub
            </SecondaryButton>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-medium text-text-3 sm:text-[12px]">
            <span className="flex items-center gap-1.5">
              <LockIcon />
              No file uploads for PDF/image
            </span>
            <span className="flex items-center gap-1.5">
              <UserIcon />
              Founder-led by Kushal Gautam
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon />
              ~69 curated tools
            </span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-bg2 py-5 sm:py-7">
        <div className="mx-auto grid max-w-4xl grid-cols-2 px-4 sm:grid-cols-4 sm:px-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`px-4 py-5 text-center sm:px-6 sm:py-7 ${index < 2 ? "border-b border-border sm:border-b-0" : ""} ${index % 2 === 0 ? "sm:border-r sm:border-border" : ""}`}
            >
              <p className="font-heading text-[24px] font-extrabold text-gold sm:text-[30px]">{stat.value}</p>
              <p className="mt-1.5 text-[11px] font-medium text-text-3 sm:text-[12px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Categories */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Platform categories"
            title="Browse by what you need"
            subtitle="Five focused hubs — each built for depth over quantity."
          />
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {categories.map((cat) => (
              <CategoryHubCard key={cat.href} {...cat} />
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* Trending */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Trending now"
            title="Tools people use every day"
            subtitle="No filler — every tool here solves a real recurring problem."
          />
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {trendingTools.map((tool) => (
              <ToolCard key={tool.slug} {...tool} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <SecondaryButton href="/all-tools">View all 69 tools →</SecondaryButton>
          </div>
        </div>
      </section>

      <AdSlot type="responsive" />

      <Divider />

      {/* Why */}
      <section className="bg-bg2 py-20 md:py-12 lg:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader eyebrow="Why freetoolkitapp" title="Built different by design" />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((card) => (
              <div key={card.title} className="rounded-2xl border border-border bg-bg3 p-5 sm:p-7">
                <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white/[0.04] text-xl">
                  {card.icon}
                </span>
                <h3 className="mb-2 text-[15px] font-semibold text-text">{card.title}</h3>
                <p className="text-[13px] leading-relaxed text-text-2">{card.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider />

      {/* Blog */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader eyebrow="Latest guides" title="Learn the fastest workflows" />
          <div className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.href}
                href={post.href}
                className="group flex flex-col rounded-2xl border border-border bg-bg2 p-6 transition-all hover:border-border-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-gold">{post.tag}</p>
                <h3 className="mb-2 text-[15px] font-semibold leading-snug text-text">{post.title}</h3>
                <p className="mb-4 flex-1 text-[13px] leading-relaxed text-text-2">{post.description}</p>
                <p className="text-[11px] text-text-3">{post.readTime}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <GhostButton href="/blog">Read all guides →</GhostButton>
          </div>
        </div>
      </section>

      <Divider />

      {/* CTA */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-bg2 p-8 text-center sm:p-12 md:p-16">
            <div
              className="pointer-events-none absolute left-1/2 top-0 hidden h-[200px] w-[500px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(245,166,35,0.12)_0%,transparent_70%)] md:block"
              aria-hidden="true"
            />
            <div className="relative z-10">
              <h2 className="mb-3 font-heading text-[22px] font-extrabold leading-[1.1] tracking-[-0.025em] text-text sm:text-[28px] md:text-[30px]">
                Start with a free tool now
              </h2>
              <p className="relative z-10 mb-8 text-[14px] text-text-2 sm:text-[15px]">Pick a tool and finish your next task in seconds.</p>
              <div className="relative z-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <PrimaryButton href="/merge-pdf" className="w-full min-h-[48px] sm:w-auto">
                  Merge PDF
                </PrimaryButton>
                <SecondaryButton href="/image-compressor" className="w-full min-h-[48px] sm:w-auto">
                  Compress an image
                </SecondaryButton>
                <SecondaryButton href="/ai-resume-cover-letter" className="w-full min-h-[48px] sm:w-auto">
                  Draft a resume
                </SecondaryButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

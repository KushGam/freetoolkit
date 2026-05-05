import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { HomeToolSearch } from "@/components/HomeToolSearch";
import { Badge, Card, CategoryCard, Container, ToolCard } from "@/components/ui";
import { getToolsByTopLevelCategory, tools, toolHref, topLevelCategoryRoutes, type TopLevelCategory } from "@/data/tools";

const popularSlugs = [
  "image-compressor",
  "merge-pdf",
  "word-counter",
  "qr-code-generator",
  "json-formatter",
  "gpa-calculator"
];

const categoryDetails: Record<TopLevelCategory, { href: string; icon: string; description: string }> = {
  Everyday: {
    href: topLevelCategoryRoutes.Everyday,
    icon: "DAY",
    description: "Image, PDF, text, calculator, QR, password, and daily browser tools in one place."
  },
  Student: {
    href: topLevelCategoryRoutes.Student,
    icon: "EDU",
    description: "GPA, grades, attendance, word count, study planning, and student calculators."
  },
  "AI Tools": {
    href: topLevelCategoryRoutes["AI Tools"],
    icon: "AI",
    description: "AI-powered resume and cover letter support built for students and graduates."
  },
  Developer: {
    href: topLevelCategoryRoutes.Developer,
    icon: "DEV",
    description: "JSON, URL encoding, UUID, Base64, and quick web utilities for developers."
  }
};

const trustBadges = ["Free to use", "No signup required", "Works in your browser", "Mobile friendly", "Fast and secure"];

const whyCards = [
  {
    title: "No signup",
    copy: "Open a tool and start immediately. FreeToolKit avoids accounts, paywalls, and unnecessary setup."
  },
  {
    title: "Browser-based",
    copy: "Image, PDF, and student utilities are designed to run in your browser where possible."
  },
  {
    title: "Privacy-friendly",
    copy: "File tools keep processing in the browser where supported, so common tasks avoid unnecessary uploads."
  },
  {
    title: "Built for everyday tasks",
    copy: "Use it for assignments, office documents, content workflows, applications, and daily productivity."
  }
];

export default function HomePage() {
  const popularTools = popularSlugs.map((slug) => tools.find((tool) => tool.slug === slug)).filter(Boolean);

  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-slate-200/70 bg-[radial-gradient(circle_at_18%_8%,#dbeafe,transparent_30%),radial-gradient(circle_at_82%_18%,#e0e7ff,transparent_26%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-20">
          <div className="max-w-4xl text-center lg:text-left">
            <Badge className="mx-auto border-brand-100 text-[11px] font-black uppercase tracking-wide text-brand-700 sm:text-xs lg:mx-0">
              Fast, free, no-login online tools
            </Badge>
            <h1 className="mx-auto mt-5 max-w-4xl font-display text-4xl font-bold leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:mx-0 lg:text-6xl">
              Simple, Free Online Tools — All in One Place
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
              Compress images, edit PDFs, format text, calculate values, and use everyday browser-based tools — fast, free, and no signup required.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:justify-start">
              <Link href="/all-tools" className="rounded-2xl bg-gradient-to-b from-brand-500 to-brand-700 px-6 py-3 text-center text-sm font-bold text-white shadow-[0_16px_35px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:from-brand-600 hover:to-brand-700">
                Browse All Tools
              </Link>
              <Link href="/image-compressor" className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-center text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                Try Image Compressor
              </Link>
            </div>
            <div className="mx-auto text-left">
              <HomeToolSearch />
            </div>
            <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2.5 lg:mx-0 lg:justify-start">
              {trustBadges.map((badge) => (
                <span key={badge} className="rounded-full border border-slate-200 bg-white/85 px-3.5 py-2 text-[11px] font-black text-slate-700 shadow-sm sm:text-xs">
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mx-auto hidden w-full max-w-md lg:block" aria-hidden="true">
            <div className="absolute -left-8 top-10 h-56 w-56 rounded-full bg-brand-100/70 blur-3xl" />
            <div className="relative rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur">
              {[
                ["Image Compressor", "Reduce image size in seconds", "IMG"],
                ["Merge PDF", "Combine documents privately", "PDF"],
                ["GPA Calculator", "Plan academic results", "GPA"]
              ].map(([title, copy, icon]) => (
                <div key={title} className="mb-3 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 last:mb-0">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-xs font-black text-brand-700 ring-1 ring-brand-100">{icon}</span>
                  <span>
                    <span className="block text-sm font-bold text-slate-950">{title}</span>
                    <span className="block text-sm text-slate-500">{copy}</span>
                  </span>
                  <span className="ml-auto text-lg font-black text-brand-500">→</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Container className="max-w-6xl py-10">
        <AdSlot type="leaderboard" priority />

        <section className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-brand-600">Most used</p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Popular Tools</h2>
            </div>
            <Link href="/all-tools" className="text-sm font-black text-brand-700 hover:text-brand-900">
              View all tools →
            </Link>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <ToolCard key={tool!.slug} title={tool!.title} description={tool!.description} href={toolHref(tool!)} category={tool!.category} badge={tool!.badge} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-sm font-black uppercase tracking-wide text-brand-600">Tool library</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Browse by Category</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(["Everyday", "Student", "AI Tools", "Developer"] as TopLevelCategory[]).map((category) => {
              const details = categoryDetails[category];
              const categoryTools = getToolsByTopLevelCategory(category).slice(0, 5);
              return (
                <CategoryCard key={category} title={category} description={details.description} href={details.href} icon={details.icon} tools={categoryTools.map((tool) => tool.title)} />
              );
            })}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-sm font-black uppercase tracking-wide text-brand-600">Trust basics</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Why FreeToolKit?</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((card, index) => (
              <Card key={card.title} className="p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-xs font-black text-brand-700">0{index + 1}</span>
                <h3 className="mt-4 text-lg font-bold tracking-tight text-slate-950">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.copy}</p>
              </Card>
            ))}
          </div>
        </section>

        <AdSlot type="responsive" />

        <section className="prose-lite mt-16 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:p-8">
          <h2>Free Online Tools for Everyday Work and Study</h2>
          <p>
            FreeToolKit helps you complete common file, image, PDF, and student tasks without downloading extra software or creating an account. The website is built for quick daily jobs: compressing an image before upload, merging PDFs for a submission, calculating GPA before grades are finalized, checking word count, or starting a focused study session. Every tool is designed to be simple enough for beginners and practical enough for office workers, creators, students, and professionals.
          </p>
          <p>
            Many online tasks should not require a complicated dashboard. FreeToolKit keeps the experience clean and browser-based where possible, so you can open a page, use the tool, and download or copy your result. The <Link href="/everyday" className="font-bold text-brand-700 hover:text-brand-900">Everyday</Link> section includes image, PDF, text, calculator, QR, and password utilities. The <Link href="/student" className="font-bold text-brand-700 hover:text-brand-900">Student</Link> section includes GPA calculators, grade planning, attendance, a study timer, and a word counter.
          </p>
          <p>
            The site is also built with mobile users in mind. Pages use readable spacing, large controls, clear instructions, and lightweight layouts so the tools feel fast on phones, tablets, and desktops. Since there is no login required, FreeToolKit works well for quick one-time tasks and repeat productivity workflows. Sections for <Link href="/ai-tools" className="font-bold text-brand-700 hover:text-brand-900">AI Tools</Link> and <Link href="/developer" className="font-bold text-brand-700 hover:text-brand-900">Developer</Link> make it easier to find resume support, JSON formatting, URL encoding, UUID generation, and Base64 utilities. Whether you are preparing school files, cleaning up documents for work, optimizing images for a website, or drafting content with a word limit, the goal is the same: useful free tools that are easy to trust and easy to use.
          </p>
        </section>

        <section className="mt-16 rounded-[2rem] border border-brand-100 bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_36%),linear-gradient(135deg,#ffffff,#f8fafc)] p-6 text-center shadow-[0_24px_70px_rgba(37,99,235,0.10)] sm:p-10">
          <h2 className="font-display text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Start with a free tool now</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-slate-600">
            Pick a popular tool and finish your next image, PDF, or student task in a few clicks.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/image-compressor" className="rounded-2xl bg-brand-600 px-6 py-3.5 text-sm font-black text-white shadow-sm hover:bg-brand-700">Compress an Image</Link>
            <Link href="/merge-pdf" className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-800 shadow-sm hover:bg-brand-50">Merge PDF</Link>
            <Link href="/gpa-calculator" className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-800 shadow-sm hover:bg-brand-50">Calculate GPA</Link>
          </div>
        </section>
      </Container>
    </main>
  );
}

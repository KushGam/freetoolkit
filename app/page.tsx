import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { HomeToolSearch } from "@/components/HomeToolSearch";
import { ToolCard } from "@/components/ui";
import { categoryRoutes, getToolsByCategory, tools, type ToolCategory } from "@/data/tools";

const popularSlugs = [
  "image-compressor",
  "merge-pdf",
  "word-counter",
  "gpa-calculator",
  "png-to-jpg",
  "study-timer",
  "qr-code-generator",
  "password-generator",
  "percentage-calculator"
];

const categoryDetails: Record<ToolCategory, { href: string; icon: string; description: string }> = {
  "Image Tools": {
    href: categoryRoutes["Image Tools"],
    icon: "IMG",
    description: "Compress, resize, and convert images for websites, forms, documents, and sharing."
  },
  "PDF Tools": {
    href: categoryRoutes["PDF Tools"],
    icon: "PDF",
    description: "Merge, split, rotate, extract, and optimize PDFs without installing heavy software."
  },
  "Student Tools": {
    href: categoryRoutes["Student Tools"],
    icon: "GPA",
    description: "Calculate grades, count words, and stay focused with simple study utilities."
  },
  "Text Tools": {
    href: categoryRoutes["Text Tools"],
    icon: "TXT",
    description: "Format, sort, clean, deduplicate, and generate text for writing, data cleanup, and publishing."
  },
  "Developer Tools": {
    href: categoryRoutes["Developer Tools"],
    icon: "DEV",
    description: "Format JSON, encode URLs, generate UUIDs, convert Base64, and create QR codes."
  },
  "Calculator Tools": {
    href: categoryRoutes["Calculator Tools"],
    icon: "CAL",
    description: "Calculate ages, units, percentages, EMI payments, and time zones with clean browser calculators."
  },
  "Security Tools": {
    href: categoryRoutes["Security Tools"],
    icon: "SEC",
    description: "Generate strong passwords with safe client-side controls and no signup."
  }
};

const trustBadges = ["Free to use", "No signup required", "Works in your browser", "Mobile friendly", "Fast and secure"];

const whyCards = [
  {
    title: "No signup required",
    copy: "Open a tool and start immediately. FreeToolKit avoids accounts, paywalls, and unnecessary setup."
  },
  {
    title: "Free browser-based tools",
    copy: "Image, PDF, and student utilities are designed to run in your browser where possible."
  },
  {
    title: "Simple and mobile friendly",
    copy: "Clean layouts, readable controls, and responsive pages make common tasks easy on any screen."
  },
  {
    title: "Built for students and professionals",
    copy: "Use it for assignments, office documents, content workflows, applications, and daily productivity."
  }
];

export default function HomePage() {
  const popularTools = popularSlugs.map((slug) => tools.find((tool) => tool.slug === slug)).filter(Boolean);

  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-slate-200/70 bg-[radial-gradient(circle_at_18%_8%,#dbeafe,transparent_30%),radial-gradient(circle_at_82%_18%,#e0e7ff,transparent_26%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mx-auto w-fit rounded-full border border-brand-100 bg-white/85 px-4 py-2 text-[11px] font-black uppercase tracking-wide text-brand-700 shadow-sm sm:text-xs">
              Fast, free, no-login online tools
            </p>
            <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-[1.05] tracking-normal text-slate-950 sm:text-5xl sm:leading-[1.04] lg:text-6xl xl:text-[4.65rem]">
              Free Online Tools for Images, PDFs &amp; Students
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Compress images, edit PDFs, calculate GPA, count words, and stay productive — fast, free, and no signup required.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/all-tools" className="rounded-2xl bg-brand-600 px-6 py-3 text-sm font-black text-white shadow-[0_16px_35px_rgba(37,99,235,0.24)] transition hover:-translate-y-0.5 hover:bg-brand-700">
                Explore All Tools
              </Link>
              <Link href="/image-compressor" className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                Try Image Compressor
              </Link>
            </div>
            <div className="mx-auto text-left">
              <HomeToolSearch />
            </div>
            <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2.5">
              {trustBadges.map((badge) => (
                <span key={badge} className="rounded-full border border-slate-200 bg-white/85 px-3.5 py-2 text-[11px] font-black text-slate-700 shadow-sm sm:text-xs">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <AdSlot type="leaderboard" />

        <section className="mt-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-brand-600">Most used</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Popular Free Tools</h2>
            </div>
            <Link href="/all-tools" className="text-sm font-black text-brand-700 hover:text-brand-900">
              View all tools →
            </Link>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <ToolCard key={tool!.slug} title={tool!.title} description={tool!.description} href={`/${tool!.slug}`} category={tool!.category} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-sm font-black uppercase tracking-wide text-brand-600">Tool library</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Browse Tools by Category</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(categoryDetails) as ToolCategory[]).map((category) => {
              const details = categoryDetails[category];
              const categoryTools = getToolsByCategory(category).slice(0, 5);
              return (
                <Link key={category} href={details.href} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_24px_55px_rgba(37,99,235,0.12)]">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-xs font-black text-brand-700 ring-1 ring-brand-100">
                      {details.icon}
                    </span>
                    <span className="text-xl font-black text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-600">→</span>
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-slate-950">{category}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{details.description}</p>
                  <div className="mt-5 grid gap-2">
                    {categoryTools.map((tool) => (
                      <span key={tool.slug} className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">
                        {tool.title}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-sm font-black uppercase tracking-wide text-brand-600">New utilities</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">More Free Browser Tools</h2>
          <div className="mt-7 grid gap-5 lg:grid-cols-4">
            {(["Text Tools", "Developer Tools", "Calculator Tools", "Security Tools"] as ToolCategory[]).map((category) => {
              const details = categoryDetails[category];
              return (
                <Link key={category} href={details.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_22px_45px_rgba(37,99,235,0.12)]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-[11px] font-black text-brand-700 ring-1 ring-brand-100">{details.icon}</span>
                  <h3 className="mt-4 text-xl font-black text-slate-950">{category}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{details.description}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-16">
          <p className="text-sm font-black uppercase tracking-wide text-brand-600">Trust basics</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950 sm:text-4xl">Why use FreeToolKit?</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyCards.map((card, index) => (
              <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-xs font-black text-brand-700">0{index + 1}</span>
                <h3 className="mt-4 text-lg font-black text-slate-950">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.copy}</p>
              </div>
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
            Many online tasks should not require a complicated dashboard. FreeToolKit keeps the experience clean and browser-based where possible, so you can open a page, use the tool, and download or copy your result. The <Link href="/image-tools" className="font-bold text-brand-700 hover:text-brand-900">Image Tools</Link> section includes utilities for compression, resizing, and format conversion. The <Link href="/pdf-tools" className="font-bold text-brand-700 hover:text-brand-900">PDF Tools</Link> section helps with merging, splitting, rotating, extracting pages, and reducing PDF file size. The <Link href="/student-tools" className="font-bold text-brand-700 hover:text-brand-900">Student Tools</Link> section includes GPA calculators, a grade percentage calculator, a study timer, and a word counter.
          </p>
          <p>
            The site is also built with mobile users in mind. Pages use readable spacing, large controls, clear instructions, and lightweight layouts so the tools feel fast on phones, tablets, and desktops. Since there is no login required, FreeToolKit works well for quick one-time tasks and repeat productivity workflows. Sections for <Link href="/text-tools" className="font-bold text-brand-700 hover:text-brand-900">Text Tools</Link>, <Link href="/developer-tools" className="font-bold text-brand-700 hover:text-brand-900">Developer Tools</Link>, <Link href="/calculator-tools" className="font-bold text-brand-700 hover:text-brand-900">Calculator Tools</Link>, and <Link href="/security-tools" className="font-bold text-brand-700 hover:text-brand-900">Security Tools</Link> make it easier to find QR, JSON, password, percentage, unit, and text cleanup utilities. Whether you are preparing school files, cleaning up documents for work, optimizing images for a website, or drafting content with a word limit, the goal is the same: useful free tools that are easy to trust and easy to use.
          </p>
        </section>

        <section className="mt-16 rounded-[2rem] border border-brand-100 bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_36%),linear-gradient(135deg,#ffffff,#f8fafc)] p-6 text-center shadow-[0_24px_70px_rgba(37,99,235,0.10)] sm:p-10">
          <h2 className="text-3xl font-black text-slate-950 sm:text-4xl">Start with a free tool now</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Pick a popular tool and finish your next image, PDF, or student task in a few clicks.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/image-compressor" className="rounded-2xl bg-brand-600 px-6 py-3.5 text-sm font-black text-white shadow-sm hover:bg-brand-700">Compress an Image</Link>
            <Link href="/merge-pdf" className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-800 shadow-sm hover:bg-brand-50">Merge PDF</Link>
            <Link href="/gpa-calculator" className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-800 shadow-sm hover:bg-brand-50">Calculate GPA</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { HomeToolSearch } from "@/components/HomeToolSearch";
import { ToolCard } from "@/components/ui";
import { categories, getToolsByCategory, tools } from "@/data/tools";

export default function HomePage() {
  const popular = tools.filter((tool) => tool.popular);
  const categoryMeta = {
    "Image Tools": { icon: "IMG", href: "/image-tools", copy: "Compress, resize, and convert JPG, PNG, and WebP files." },
    "PDF Tools": { icon: "PDF", href: "/pdf-tools", copy: "Merge, split, rotate, extract, and optimize PDF documents." },
    "Student Tools": { icon: "GPA", href: "/student-tools", copy: "Calculate grades, count words, and stay focused while studying." }
  };

  return (
    <main className="overflow-hidden">
      <section className="relative bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_36%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:py-20 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <div>
            <p className="w-fit rounded-full border border-brand-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-wide text-brand-700 shadow-sm">Free tools, private by design</p>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-normal text-slate-950 sm:text-6xl">Free Online Tools for Images, PDFs, and Students</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
              Compress images, convert files, edit PDFs, calculate GPA, count words, and stay productive — fast, free, and private in your browser.
            </p>
            <HomeToolSearch />
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/all-tools" className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-700">Browse all tools</Link>
              <Link href="/image-tools" className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-brand-50">Image tools</Link>
            </div>
            <div className="mt-7 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {["No signup", "Free to use", "Browser-based", "Mobile friendly"].map((badge) => (
                <div key={badge} className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-3 text-center text-xs font-black text-slate-700 shadow-sm">
                  {badge}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {categories.map((category) => (
              <Link key={category} href={categoryMeta[category].href} className="group rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_24px_55px_rgba(37,99,235,0.14)]">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-xs font-black text-brand-700 ring-1 ring-brand-100">{categoryMeta[category].icon}</span>
                  <span className="text-xl font-black text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-600">→</span>
                </div>
                <h2 className="mt-4 text-xl font-black text-slate-950">{category}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{categoryMeta[category].copy}</p>
                <p className="mt-3 text-xs font-black uppercase tracking-wide text-brand-700">{getToolsByCategory(category).length} tools</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <AdSlot size="leaderboard" />
        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-brand-600">Most used</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Popular tools</h2>
            </div>
            <Link href="/all-tools" className="text-sm font-black text-brand-700 hover:text-brand-900">View all tools →</Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((tool) => <ToolCard key={tool.slug} title={tool.title} description={tool.description} href={`/${tool.slug}`} category={tool.category} />)}
          </div>
        </section>
        <section className="mt-14">
          <p className="text-sm font-black uppercase tracking-wide text-brand-600">Trust basics</p>
          <h2 className="mt-2 text-3xl font-black text-slate-950">Why use this site?</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {["Free", "No sign-up", "Works in browser", "Mobile friendly"].map((item, index) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-xs font-black text-brand-700">0{index + 1}</span>
                <h3 className="text-lg font-black text-slate-950">{item}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">Designed for quick everyday tasks without unnecessary barriers.</p>
              </div>
            ))}
          </div>
        </section>
        <section className="prose-lite mt-14 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2>Free online tools for practical daily work</h2>
          <p>
            FreeToolKit brings common image, PDF, and student utilities into one clean website. You can compress images before uploading them, convert image formats, merge or extract PDF pages, calculate GPA, time study sessions, and count words without creating an account.
          </p>
          <p>
            The site is built around browser-based processing where possible. That keeps tools fast, avoids paid API costs, and makes the experience simpler on mobile and desktop. Each tool page includes instructions, useful context, frequently asked questions, and related links so visitors can understand the task instead of landing on a thin utility page.
          </p>
        </section>
        <AdSlot size="responsive" />
      </div>
    </main>
  );
}

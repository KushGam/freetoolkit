import Link from "next/link";
import { getTool, toolHref, topLevelCategories, topLevelCategoryRoutes } from "@/data/tools";

const legalLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/sitemap", label: "Sitemap" },
  { href: "/blog", label: "Blog" }
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-[radial-gradient(circle_at_top_left,#fef2f2,transparent_34%),linear-gradient(180deg,#ffffff,#fafafa)] backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,1fr))] lg:px-8">
        <div className="lg:col-span-1">
          <Link href="/" className="group flex items-center gap-3 text-xl font-display font-bold tracking-tight text-slate-950">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-sm font-black text-white shadow-[0_16px_30px_rgba(127,29,29,0.22)] transition-transform duration-200 group-hover:scale-105">FT</span>
            <span>Free<span className="text-brand-600">ToolKit</span></span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-600">
            Free browser-based tools for PDFs, images, writing, AI drafts, calculators, students, and developers. Built for clarity, speed, and privacy-conscious workflows where files stay on your device whenever the browser allows it.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["No signup", "Free", "Browser-based", "Editorial guides"].map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">{item}</span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-display font-semibold text-slate-950">Trust &amp; legal</h3>
          <ul className="mt-4 grid gap-2.5 text-sm text-slate-600">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-semibold text-slate-700 hover:text-brand-700">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-display font-semibold text-slate-950">Categories</h3>
          <ul className="mt-4 grid gap-2.5 text-sm text-slate-600">
            {topLevelCategories.map((category) => (
              <li key={category}>
                <Link href={topLevelCategoryRoutes[category]} className="font-semibold text-slate-700 hover:text-brand-700">
                  {category}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/all-tools" className="font-bold text-brand-700 hover:text-brand-900">All tools directory →</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-display font-semibold text-slate-950">Popular tools</h3>
          <ul className="mt-4 grid gap-2.5 text-sm text-slate-600">
            {["merge-pdf", "image-compressor", "gpa-calculator", "ai-text-summarizer", "qr-code-generator"].map((slug) => {
              const tool = getTool(slug);
              if (!tool) return null;
              return (
                <li key={slug}>
                  <Link href={toolHref(tool)} className="hover:text-brand-700">{tool.title}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} FreeToolKit. All rights reserved.</p>
          <p className="text-xs text-slate-400 sm:max-w-lg sm:text-right">Game names, trademarks, logos, and related content belong to their respective owners. FreeToolKit is an independent tools publisher.</p>
        </div>
      </div>
    </footer>
  );
}

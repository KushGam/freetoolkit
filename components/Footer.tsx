import Link from "next/link";
import { getToolsByTopLevelCategory, toolHref, topLevelCategories, topLevelCategoryRoutes } from "@/data/tools";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-[radial-gradient(circle_at_top_left,#fef2f2,transparent_34%),linear-gradient(180deg,#ffffff,#fafafa)] backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2">
          <Link href="/" className="group flex items-center gap-3 text-xl font-display font-bold tracking-tight text-slate-950">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-sm font-black text-white shadow-[0_16px_30px_rgba(127,29,29,0.22)] transition-transform duration-200 group-hover:scale-105">FT</span>
            <span>Free<span className="text-brand-600">ToolKit</span></span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
            FreeToolKit is a calm, no-login productivity platform for AI tools, PDFs, images, calculators, students, developers, and daily browser-based work.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["No signup", "Free", "Browser-based"].map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">{item}</span>
            ))}
          </div>
        </div>
        {topLevelCategories.map((category) => (
          <div key={category}>
            <h3 className="text-sm font-display font-semibold text-slate-950">{category}</h3>
            <div className="mt-4 grid gap-2.5 text-sm text-slate-600">
              <Link href={topLevelCategoryRoutes[category]} className="font-bold text-slate-700 hover:text-brand-700">
                Browse {category}
              </Link>
              {getToolsByTopLevelCategory(category).slice(0, 4).map((tool) => (
                <Link key={tool.slug} href={toolHref(tool)} className="hover:text-brand-700">
                  {tool.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} FreeToolKit. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/about" className="hover:text-brand-700">About</Link>
            <Link href="/blog" className="hover:text-brand-700">Blog</Link>
            <Link href="/contact" className="hover:text-brand-700">Contact</Link>
            <Link href="/privacy" className="hover:text-brand-700">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-700">Terms</Link>
            <span className="text-slate-400">Built by Kushal Gautam</span>
          </div>
          <p className="text-xs text-slate-400">Game names, trademarks, logos, and related content belong to their respective owners.</p>
        </div>
      </div>
    </footer>
  );
}

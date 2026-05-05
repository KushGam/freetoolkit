import Link from "next/link";
import { getToolsByTopLevelCategory, toolHref, topLevelCategories, topLevelCategoryRoutes } from "@/data/tools";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-6 lg:px-8">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-3 text-xl font-bold tracking-tight text-slate-950">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-sm font-black text-white shadow-[0_14px_28px_rgba(37,99,235,0.18)]">FT</span>
            <span>Free<span className="text-brand-600">ToolKit</span></span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
            FreeToolKit is a calm, no-login collection of browser-based tools for images, PDFs, text, calculators, students, and daily productivity.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["No signup", "Free", "Browser-based"].map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-600">{item}</span>
            ))}
          </div>
        </div>
        {topLevelCategories.map((category) => (
          <div key={category}>
            <h3 className="text-sm font-bold text-slate-950">{category}</h3>
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
            <Link href="/contact" className="hover:text-brand-700">Contact</Link>
            <Link href="/privacy" className="hover:text-brand-700">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-700">Terms</Link>
            <span className="text-slate-400">Built by Kushal Gautam</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

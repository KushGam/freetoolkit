import Link from "next/link";
import { categories, getToolsByCategory } from "@/data/tools";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-5">
        <div className="md:col-span-2">
          <Link href="/" className="flex items-center gap-3 text-xl font-black text-slate-950">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-sm text-white">FT</span>
            <span>Free<span className="text-brand-600">ToolKit</span></span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-600">
            Free browser-based tools for images, PDFs, and students. No login, no paid APIs, and clean pages built for practical everyday work.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["No signup", "Free", "Browser-based"].map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-black text-slate-600">{item}</span>
            ))}
          </div>
        </div>
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-sm font-black text-slate-950">{category}</h3>
            <div className="mt-4 grid gap-2.5 text-sm text-slate-600">
              {getToolsByCategory(category).slice(0, 5).map((tool) => (
                <Link key={tool.slug} href={`/${tool.slug}`} className="hover:text-brand-700">
                  {tool.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-sm font-medium text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FreeToolKit. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/about" className="hover:text-brand-700">About</Link>
            <Link href="/contact" className="hover:text-brand-700">Contact</Link>
            <Link href="/privacy" className="hover:text-brand-700">Privacy</Link>
            <Link href="/terms" className="hover:text-brand-700">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

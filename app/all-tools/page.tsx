import type { Metadata } from "next";
import { AllToolsSearch } from "@/components/AllToolsSearch";

export const metadata: Metadata = {
  title: "All Free Online Tools",
  description: "Search all FreeToolKit image tools, PDF tools, and student tools in one place.",
  openGraph: {
    title: "All Free Online Tools | FreeToolKit",
    description: "Find free browser-based tools for images, PDFs, GPA, study timers, and word counting."
  }
};

export default function AllToolsPage({ searchParams }: { searchParams?: { q?: string } }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_36%),linear-gradient(180deg,#ffffff,#f8fafc)] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="w-fit rounded-full border border-brand-100 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-wide text-brand-700">Searchable toolkit</p>
        <h1 className="mt-4 text-4xl font-black text-slate-950">All tools</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">Search every free FreeToolKit utility. Tools are organized for quick access and designed to work without login or paid APIs.</p>
      </section>
      <div className="mt-8"><AllToolsSearch initialQuery={searchParams?.q ?? ""} /></div>
    </main>
  );
}

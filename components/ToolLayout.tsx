import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { FAQ } from "@/components/FAQ";
import { RelatedTools } from "@/components/RelatedTools";
import { Card } from "@/components/ui";
import { categoryRoutes, getRelatedTools, type Tool } from "@/data/tools";
import { ToolRunner } from "@/components/ToolRunner";

export function ToolLayout({ tool }: { tool: Tool }) {
  const categoryShort =
    tool.category === "Image Tools"
      ? "Browser image workflow"
      : tool.category === "PDF Tools"
        ? "Private PDF workspace"
        : tool.category === "Student Tools"
          ? "Study and grade helper"
          : tool.category === "Developer Tools"
            ? "Developer utility"
            : tool.category === "Security Tools"
              ? "Security helper"
              : tool.category === "Calculator Tools"
                ? "Fast calculator"
                : "Text cleanup tool";

  const categoryCopy =
    tool.category === "Image Tools"
      ? "Image tools are most useful when they make routine publishing tasks faster without asking you to install heavy software. Use the preview and file size details to decide whether the output is suitable before you upload it to a website, application form, content management system, or classroom portal."
      : tool.category === "PDF Tools"
        ? "PDF tools can save time when you need to organize documents quickly, but it is still worth reviewing the downloaded file before sharing it. Check page order, page ranges, rotation, and file size so the final document matches the requirements of your form, assignment, client, or archive."
        : tool.category === "Student Tools"
          ? "Student tools are intended for planning and productivity rather than official academic reporting. They help you estimate outcomes, organize writing, and manage focus sessions, but your school or instructor may use a different grading policy, word-count rule, or submission requirement."
          : "These browser tools are designed for quick everyday work without accounts, payment flows, or complicated setup. Review the output before using it in final documents, code, messages, or published content.";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
      <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <span>/</span>
        <Link href={categoryRoutes[tool.category]} className="hover:text-brand-700">
          {tool.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800">{tool.title}</span>
      </nav>
      <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_50%_0%,#dbeafe,transparent_44%),radial-gradient(circle_at_90%_15%,#e0e7ff,transparent_28%),linear-gradient(180deg,#ffffff,#f8fafc)] px-5 py-10 text-center shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:px-8 sm:py-12 lg:px-14 lg:py-14">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />
        <div className="mx-auto max-w-4xl">
          <p className="mx-auto w-fit rounded-full border border-brand-100 bg-white/85 px-4 py-2 text-xs font-black uppercase tracking-wide text-brand-700 shadow-sm">{tool.category}</p>
          <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-[1.05] tracking-normal text-slate-950 sm:text-5xl lg:text-6xl">{tool.title}</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">{tool.intro}</p>
          <div className="mx-auto mt-7 grid max-w-3xl gap-3 sm:grid-cols-3">
            {["Free to use", "No signup", categoryShort].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-black text-slate-700 shadow-sm backdrop-blur">
                {item}
              </div>
            ))}
          </div>
          {(tool.category === "Image Tools" || tool.category === "PDF Tools") ? (
            <p className="mx-auto mt-5 max-w-3xl rounded-2xl border border-brand-100 bg-white/80 px-4 py-3 text-sm font-bold leading-6 text-brand-700 shadow-sm">
              Privacy note: files are processed in the browser where possible and are not uploaded to a server by this tool.
            </p>
          ) : null}
        </div>
      </section>
      <AdSlot size="leaderboard" />
      <Card className="mx-auto mt-8 max-w-4xl p-5 sm:p-7">
        <div className="mb-6 border-b border-slate-100 pb-5">
          <p className="text-sm font-black uppercase tracking-wide text-brand-600">Tool workspace</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">{tool.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Upload, enter details, or paste content below. Results appear here when ready.</p>
        </div>
        <ToolRunner slug={tool.slug} />
      </Card>
      <AdSlot size="responsive" />
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-2xl font-black text-slate-950">How to use {tool.title}</h2>
          <ol className="mt-4 grid list-decimal gap-3 pl-5 text-sm leading-6 text-slate-600">
            {tool.howToUse.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </Card>
        <Card>
          <h2 className="text-2xl font-black text-slate-950">Why use this tool?</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-600">
            {tool.features.map((feature) => <li key={feature}>• {feature}</li>)}
          </ul>
        </Card>
      </section>
      <section className="prose-lite mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2>About this free {tool.title.toLowerCase()}</h2>
        {tool.seo.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p>
          FreeToolKit is built for fast, no-login access on desktop and mobile. The page includes practical controls, clear output, and internal links to related tools so you can finish common file and study tasks without switching apps.
        </p>
        <p>{categoryCopy}</p>
        <p>
          For best results, start with a copy of your original file or notes, review the result carefully, and download the finished output when it looks right. The simple interface is designed for repeat visits from search, bookmarks, and mobile browsers, with the main controls kept clear and easy to use.
        </p>
      </section>
      <FAQ items={tool.faq} />
      <RelatedTools tools={getRelatedTools(tool)} />
      <AdSlot size="responsive" />
    </main>
  );
}

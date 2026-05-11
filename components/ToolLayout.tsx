import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { FAQ } from "@/components/FAQ";
import { RelatedBlogPosts } from "@/components/RelatedBlogPosts";
import { RelatedTools } from "@/components/RelatedTools";
import { Card, Container, PageHeader } from "@/components/ui";
import { getBlogPostsForTool } from "@/data/blog";
import { categoryRoutes, getRelatedTools, type Tool } from "@/data/tools";
import { LazyToolRunner } from "@/components/LazyToolRunner";

function workspaceCopy(tool: Tool) {
  if (tool.slug === "image-color-picker") return "Upload an image, then click anywhere on the preview to pick a color.";
  if (tool.slug === "duplicate-line-remover") return "Paste your list below, choose case sensitivity, and remove duplicate lines instantly.";
  if (tool.category === "PDF Tools") return "Upload your PDF and choose the pages or action you want to apply.";
  if (tool.category === "Image Tools") return "Upload an image, adjust the settings, and preview the result before downloading.";
  if (tool.category === "Text Tools") return "Paste your text, choose the cleanup or formatting option, and copy the polished result.";
  if (tool.category === "Calculator Tools") return "Enter your values and get a clear result instantly in your browser.";
  if (tool.category === "AI Tools") return "Paste your text, choose the available option, generate the AI output, and review it before copying.";
  if (tool.category === "Developer Tools") return "Paste or enter your data, choose an action, and copy the output when it looks right.";
  if (tool.category === "Security Tools") return "Choose your password options and generate a strong value locally in your browser.";
  return "Enter your details below and review the result before copying, downloading, or resetting.";
}

export function ToolLayout({ tool }: { tool: Tool }) {
  const relatedBlogPosts = getBlogPostsForTool(tool.slug);
  const categoryShort =
    tool.category === "Image Tools"
      ? "Browser image workflow"
      : tool.category === "PDF Tools"
        ? "Private PDF workspace"
        : tool.category === "Student Tools"
          ? "Study and grade helper"
          : tool.category === "AI Tools"
            ? "AI productivity workspace"
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
          : tool.category === "AI Tools"
            ? "AI tools can speed up writing, summarizing, resumes, captions, hashtags, and planning, but every generated result should be reviewed before it is used. The page uses a protected generation flow, while the interface remains simple and mobile friendly."
          : "These browser tools are designed for quick everyday work without accounts, payment flows, or complicated setup. Review the output before using it in final documents, code, messages, or published content.";

  return (
    <main>
      <Container className="max-w-6xl py-8 sm:py-10">
      <nav className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/75 px-4 py-2 text-sm font-bold text-slate-500 shadow-sm backdrop-blur">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <span>/</span>
        <Link href={categoryRoutes[tool.category]} className="hover:text-brand-700">
          {tool.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800">{tool.title}</span>
      </nav>
      <PageHeader
        className="mt-8 text-center"
        eyebrow={tool.category}
        title={tool.title}
        description={<p className="break-words [overflow-wrap:anywhere]">{tool.intro}</p>}
        badges={["Free to use", "No signup", categoryShort]}
      />
      {(tool.category === "Image Tools" || tool.category === "PDF Tools") ? (
        <p className="mx-auto mt-5 max-w-3xl rounded-2xl border border-brand-100 bg-white/80 px-4 py-3 text-center text-sm font-bold leading-6 text-brand-700 shadow-sm">
          Privacy note: files are processed in the browser where possible and are not uploaded to a server by this tool.
        </p>
      ) : null}
      <Card className="tool-workspace mx-auto mt-8 max-w-5xl overflow-hidden p-5 sm:p-7">
        <div className="mb-6 border-b border-slate-100 pb-5">
          <p className="text-sm font-black uppercase tracking-wide text-brand-600">Tool workspace</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-950">{tool.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">{workspaceCopy(tool)}</p>
        </div>
        <LazyToolRunner slug={tool.slug} />
      </Card>
      <AdSlot size="responsive" />
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950">How to use {tool.title}</h2>
          <ol className="mt-4 grid list-decimal gap-3 pl-5 text-sm leading-relaxed text-slate-600">
            {tool.howToUse.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </Card>
        <Card>
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950">Why use this tool?</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-slate-600">
            {tool.features.map((feature) => <li key={feature}>• {feature}</li>)}
          </ul>
        </Card>
      </section>
      <section className="prose-lite mt-12 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
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
      <RelatedBlogPosts posts={relatedBlogPosts} title={`Guides for ${tool.title}`} />
      <section className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-black uppercase tracking-wide text-brand-600">Browse hierarchy</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={categoryRoutes[tool.category]} className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            {tool.category}
          </Link>
          <Link href="/all-tools" className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            All tools
          </Link>
          <Link href="/blog" className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-bold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
            Related guides
          </Link>
        </div>
      </section>
      <RelatedTools tools={getRelatedTools(tool)} />
      <AdSlot size="responsive" />
      </Container>
    </main>
  );
}

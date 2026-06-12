import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { FAQ } from "@/components/FAQ";
import { RelatedBlogPosts } from "@/components/RelatedBlogPosts";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolLongFormContent } from "@/components/ToolLongFormContent";
import { ToolBadge } from "@/components/ui/ToolBadge";
import { getBlogPostsForTool } from "@/data/blog";
import { getToolPrivacyTier } from "@/data/site-trust";
import { categoryRoutes, getRelatedTools, type Tool } from "@/data/tools";
import { LazyToolRunner } from "@/components/LazyToolRunner";

function privacyPill(tier: ReturnType<typeof getToolPrivacyTier>) {
  if (tier === "ai") {
    return (
      <span className="inline-flex shrink-0 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold text-violet-400 sm:ml-auto">
        ✦ AI powered
      </span>
    );
  }
  if (tier === "hybrid") {
    return (
      <span className="inline-flex shrink-0 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-400 sm:ml-auto">
        ⚡ Hybrid
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-[11px] font-semibold text-green-400 sm:ml-auto">
      🔒 Browser only
    </span>
  );
}

export function ToolLayout({ tool }: { tool: Tool }) {
  const relatedBlogPosts = getBlogPostsForTool(tool.slug);
  const privacyTier = getToolPrivacyTier(tool);
  const hubUrl = categoryRoutes[tool.category];

  const categoryCopy =
    tool.category === "Image Tools"
      ? "Image tools make routine publishing faster without heavy software. Preview and file size details help you decide before upload."
      : tool.category === "PDF Tools"
        ? "PDF tools save time organizing documents—always review page order, rotation, and file size before sharing."
        : tool.category === "AI Tools"
          ? "AI outputs require human review. Follow your school or employer generative AI policies before submitting."
          : "Browser tools for quick work without accounts. Review output before using in final documents or published content.";

  return (
    <main className="min-h-screen max-w-full bg-bg pt-[60px]">
      <header className="border-b border-border bg-bg2 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-4xl">
          <nav className="text-[12px] text-text-3" aria-label="Breadcrumb">
            <Link
              href={hubUrl}
              className="flex min-h-[44px] items-center gap-1 text-text-2 transition hover:text-gold sm:hidden"
            >
              ← Back
            </Link>
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link href="/" className="transition hover:text-gold">
                Home
              </Link>
              <span className="text-border-hi">/</span>
              <Link href={hubUrl} className="transition hover:text-gold">
                {tool.category}
              </Link>
              <span className="text-border-hi">/</span>
              <span className="max-w-[200px] truncate text-text-2">{tool.title}</span>
            </div>
          </nav>

          <div className="mt-3 flex flex-wrap items-start gap-2 sm:mt-4 sm:gap-4">
            <ToolBadge category={tool.category} />
            <h1 className="min-w-0 flex-1 font-heading text-[clamp(20px,4vw,36px)] font-extrabold tracking-tight text-text">
              {tool.title}
            </h1>
          </div>
          <div className="mt-2 flex items-center gap-2 sm:mt-0">{privacyPill(privacyTier)}</div>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-text-2 sm:text-[15px]">{tool.intro}</p>
        </div>
      </header>

      <div className="mx-auto mt-4 max-w-4xl px-4 sm:mt-6 sm:px-6">
        <div className="rounded-xl border border-border bg-bg2 p-4 sm:rounded-2xl sm:p-6 md:p-8">
          <LazyToolRunner slug={tool.slug} />
        </div>
      </div>

      <AdSlot size="responsive" />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-bg2 p-4 sm:p-6">
            <h2 className="font-heading text-[18px] font-bold text-text sm:text-xl">How to use {tool.title}</h2>
            <ol className="mt-4 grid list-decimal gap-3 pl-5 text-[14px] leading-relaxed text-text-2 sm:text-sm">
              {tool.howToUse.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-border bg-bg2 p-4 sm:p-6">
            <h2 className="font-heading text-[18px] font-bold text-text sm:text-xl">Why use this tool?</h2>
            <ul className="mt-4 grid gap-3 text-[14px] leading-relaxed text-text-2 sm:text-sm">
              {tool.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>
        </section>

        {tool.useCases?.length ? (
          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-bg2 p-4 sm:p-6">
              <h2 className="font-heading text-[18px] font-bold text-text sm:text-xl">Common use cases</h2>
              <ul className="mt-4 grid gap-3 text-[14px] leading-relaxed text-text-2 sm:text-sm">
                {tool.useCases.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            {tool.tips?.length ? (
              <div className="rounded-2xl border border-border bg-bg2 p-4 sm:p-6">
                <h2 className="font-heading text-[18px] font-bold text-text sm:text-xl">Tips for better results</h2>
                <ul className="mt-4 grid gap-3 text-[14px] leading-relaxed text-text-2 sm:text-sm">
                  {tool.tips.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ) : null}

        {tool.commonMistakes?.length ? (
          <section className="mt-10">
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-4 sm:p-6">
              <h2 className="font-heading text-[18px] font-bold text-text sm:text-xl">Common mistakes to avoid</h2>
              <ul className="mt-4 grid gap-3 text-[14px] leading-relaxed text-text-2 sm:text-sm">
                {tool.commonMistakes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {tool.sections?.length ? (
          <ToolLongFormContent sections={tool.sections} relatedLinks={tool.seoBlueprint?.relatedInternalLinks} />
        ) : (
          <section className="prose-lite mt-12 rounded-2xl border border-border bg-bg2 p-4 sm:p-8">
            <h2>About this free {tool.title.toLowerCase()}</h2>
            {tool.seo.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>{categoryCopy}</p>
          </section>
        )}

        <FAQ items={tool.faq} />
        <RelatedBlogPosts posts={relatedBlogPosts} title={`Guides for ${tool.title}`} />
        <section className="mt-8 rounded-2xl border border-border bg-bg2 p-4 sm:p-5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-text-3">Browse hierarchy</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href={categoryRoutes[tool.category]} className="pill-link min-h-[44px]">
              {tool.category}
            </Link>
            <Link href="/all-tools" className="pill-link min-h-[44px]">
              All tools
            </Link>
            <Link href="/blog" className="pill-link min-h-[44px]">
              Related guides
            </Link>
          </div>
        </section>
        <RelatedTools tools={getRelatedTools(tool)} />
        <AdSlot size="responsive" />
      </div>
    </main>
  );
}

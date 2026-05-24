import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { FAQ } from "@/components/FAQ";
import { RelatedBlogPosts } from "@/components/RelatedBlogPosts";
import { RelatedTools } from "@/components/RelatedTools";
import { ToolLongFormContent } from "@/components/ToolLongFormContent";
import { Card, Container, PageHeader } from "@/components/ui";
import { getBlogPostsForTool } from "@/data/blog";
import { ToolPrivacyNotice } from "@/components/PrivacyBadge";
import { getToolPrivacyTier, privacyTierMeta } from "@/data/site-trust";
import { categoryRoutes, getRelatedTools, type Tool } from "@/data/tools";
import { LazyToolRunner } from "@/components/LazyToolRunner";

function workspaceCopy(tool: Tool) {
  if (tool.category === "PDF Tools") return "Upload your PDF and choose the pages or action you want to apply.";
  if (tool.category === "Image Tools") return "Upload an image, adjust the settings, and preview the result before downloading.";
  if (tool.category === "Calculator Tools") return "Enter your values and get a clear result instantly in your browser.";
  if (tool.category === "AI Tools") return "Paste your text, generate the AI output, and review it before copying.";
  if (tool.category === "Developer Tools") return "Paste or enter your data, choose an action, and copy the output when it looks right.";
  if (tool.category === "SEO Tools") return "Fill in your site details and copy the generated markup or preview.";
  return "Enter your details below and review the result before copying, downloading, or resetting.";
}

export function ToolLayout({ tool }: { tool: Tool }) {
  const relatedBlogPosts = getBlogPostsForTool(tool.slug);
  const categoryShort =
    tool.category === "Image Tools"
      ? "Browser image workflow"
      : tool.category === "PDF Tools"
        ? "Private PDF workspace"
        : tool.category === "AI Tools"
          ? "AI productivity workspace"
          : tool.category === "Developer Tools"
            ? "Developer utility"
            : tool.category === "Calculator Tools"
              ? "Fast calculator"
              : tool.category === "SEO Tools"
                ? "SEO utility"
                : "Productivity tool";

  const categoryCopy =
    tool.category === "Image Tools"
      ? "Image tools make routine publishing faster without heavy software. Preview and file size details help you decide before upload."
      : tool.category === "PDF Tools"
        ? "PDF tools save time organizing documents—always review page order, rotation, and file size before sharing."
        : tool.category === "AI Tools"
          ? "AI outputs require human review. Follow your school or employer generative AI policies before submitting."
          : "Browser tools for quick work without accounts. Review output before using in final documents or published content.";

  const privacyTier = getToolPrivacyTier(tool);

  return (
    <main className="mesh-bg min-h-screen">
      <Container className="max-w-6xl py-8 sm:py-12">
        <nav className="flex flex-wrap items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-ink-muted">
          <Link href="/" className="transition hover:text-ink-secondary">Home</Link>
          <span className="text-ink-muted">/</span>
          <Link href={categoryRoutes[tool.category]} className="transition hover:text-ink-secondary">
            {tool.category}
          </Link>
          <span className="text-ink-muted">/</span>
          <span className="text-ink-secondary">{tool.title}</span>
        </nav>

        <PageHeader
          className="mt-8"
          eyebrow={tool.category}
          title={tool.title}
          description={<p className="break-words [overflow-wrap:anywhere]">{tool.intro}</p>}
          badges={["Free", "No signup", categoryShort, privacyTierMeta[privacyTier].shortLabel]}
        />

        <ToolPrivacyNotice tool={tool} />

        <Card className="tool-workspace mx-auto mt-8 max-w-5xl overflow-hidden p-5 sm:p-7">
          <div className="mb-6 border-b border-white/10 pb-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Tool workspace</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-primary">{tool.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{workspaceCopy(tool)}</p>
          </div>
          <LazyToolRunner slug={tool.slug} />
        </Card>

        <AdSlot size="responsive" />

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <Card>
            <h2 className="text-xl font-semibold tracking-tight text-ink-primary">How to use {tool.title}</h2>
            <ol className="mt-4 grid list-decimal gap-3 pl-5 text-sm leading-relaxed text-ink-muted">
              {tool.howToUse.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </Card>
          <Card>
            <h2 className="text-xl font-semibold tracking-tight text-ink-primary">Why use this tool?</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-ink-muted">
              {tool.features.map((feature) => <li key={feature}>• {feature}</li>)}
            </ul>
          </Card>
        </section>

        {tool.useCases?.length ? (
          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold tracking-tight text-ink-primary">Common use cases</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-ink-muted">
                {tool.useCases.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </Card>
            {tool.tips?.length ? (
              <Card className="p-6">
                <h2 className="text-xl font-semibold tracking-tight text-ink-primary">Tips for better results</h2>
                <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-ink-muted">
                  {tool.tips.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </Card>
            ) : null}
          </section>
        ) : null}

        {tool.commonMistakes?.length ? (
          <section className="mt-10">
            <Card className="border-amber-500/20 bg-amber-500/[0.04] p-6">
              <h2 className="text-xl font-semibold tracking-tight text-ink-primary">Common mistakes to avoid</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-relaxed text-ink-muted">
                {tool.commonMistakes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </Card>
          </section>
        ) : null}

        {tool.sections?.length ? (
          <ToolLongFormContent sections={tool.sections} relatedLinks={tool.seoBlueprint?.relatedInternalLinks} />
        ) : (
          <section className="prose-lite mt-12 rounded-xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <h2>About this free {tool.title.toLowerCase()}</h2>
            {tool.seo.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <p>{categoryCopy}</p>
          </section>
        )}

        <FAQ items={tool.faq} />
        <RelatedBlogPosts posts={relatedBlogPosts} title={`Guides for ${tool.title}`} />
        <section className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Browse hierarchy</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href={categoryRoutes[tool.category]} className="rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-ink-secondary transition hover:border-white/20 hover:text-white">
              {tool.category}
            </Link>
            <Link href="/all-tools" className="rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-ink-secondary transition hover:border-white/20 hover:text-white">
              All tools
            </Link>
            <Link href="/blog" className="rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-ink-secondary transition hover:border-white/20 hover:text-white">
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

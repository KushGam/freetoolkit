import Link from "next/link";
import { FAQ } from "@/components/FAQ";
import { RelatedBlogPosts } from "@/components/RelatedBlogPosts";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ToolBadge } from "@/components/ui/ToolBadge";
import { ToolCard } from "@/components/ui/ToolCard";
import { getBlogPostsBySlugs } from "@/data/blog";
import { topLevelCategorySeo } from "@/data/seo";
import { getToolPrivacyTier } from "@/data/site-trust";
import { getBlogSlugsForCategory } from "@/data/tool-relations";
import {
  getTool,
  getToolsByTopLevelCategory,
  topLevelCategoryIntros,
  topLevelCategoryRoutes,
  type TopLevelCategory
} from "@/data/tools";
import { isToolIndexedForSearch } from "@/data/indexing-policy";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/schema";

const hubMeta: Record<
  TopLevelCategory,
  { accent: string; badgeCategory: string; orb: string }
> = {
  "AI Tools": { accent: "#a78bfa", badgeCategory: "ai", orb: "bg-[#a78bfa]" },
  "PDF & Image": { accent: "#f87171", badgeCategory: "pdf", orb: "bg-[#f87171]" },
  "SEO Tools": { accent: "#34d399", badgeCategory: "seo", orb: "bg-[#34d399]" },
  Developer: { accent: "#60a5fa", badgeCategory: "dev", orb: "bg-[#60a5fa]" },
  Calculators: { accent: "#fbbf24", badgeCategory: "calc", orb: "bg-[#fbbf24]" }
};

function privacyLabel(tool: ReturnType<typeof getTool>) {
  if (!tool) return "";
  const tier = getToolPrivacyTier(tool);
  if (tier === "ai") return "✦ AI powered";
  if (tier === "hybrid") return "⚡ Hybrid";
  return "🔒 Browser only";
}

export function TopLevelCategoryPage({ category }: { category: TopLevelCategory }) {
  const categoryTools = getToolsByTopLevelCategory(category).filter((t) => isToolIndexedForSearch(t.slug));
  const seo = topLevelCategorySeo[category];
  const meta = hubMeta[category];
  const featuredGuides = getBlogPostsBySlugs(getBlogSlugsForCategory(category, 4));
  const faqSchema = buildFaqSchema(seo.faqs);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: category, href: topLevelCategoryRoutes[category] }
  ]);

  return (
    <main className="min-h-screen bg-bg pt-[60px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="relative overflow-hidden border-b border-border bg-bg2 px-6 py-16">
        <div
          className={`pointer-events-none absolute -right-10 top-0 h-80 w-80 rounded-full opacity-[0.12] blur-[120px] ${meta.orb}`}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-5xl">
          <ToolBadge category={meta.badgeCategory} />
          <h1 className="mt-3 font-heading text-[clamp(40px,6vw,70px)] font-extrabold leading-[1.06] tracking-[-0.03em] text-text">
            {category}
          </h1>
          <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-text-2">{topLevelCategoryIntros[category]}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[`${categoryTools.length} tools`, "Free", "No signup"].map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-border bg-bg3 px-4 py-1.5 text-[13px] text-text-2"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <SectionHeader eyebrow="All tools" title={`${category} tools`} align="left" />
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map((tool) => (
            <ToolCard
              key={tool.slug}
              slug={tool.slug}
              name={tool.title}
              desc={tool.description}
              category={tool.category}
              privacy={privacyLabel(tool)}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <RelatedBlogPosts posts={featuredGuides} title={`Featured ${category.toLowerCase()} guides`} />
        <div className="prose-lite mt-12 rounded-2xl border border-border bg-bg2 p-6 sm:p-8">
          <h2>About {category.toLowerCase()} tools</h2>
          {seo.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            freetoolkitapp is designed for fast, no-signup workflows on mobile and desktop. Browse{" "}
            <Link href="/all-tools" className="text-gold hover:brightness-110">
              all tools
            </Link>{" "}
            or pick a workflow above.
          </p>
        </div>
        <FAQ items={seo.faqs} />
      </section>
    </main>
  );
}

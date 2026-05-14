import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ToolLayout } from "@/components/ToolLayout";
import { categoryRoutes, getTool, tools, toolHref } from "@/data/tools";
import { buildBreadcrumbSchema, buildFaqSchema, buildToolSoftwareSchema, withoutBrandSuffix } from "@/lib/schema";
import { canonicalUrl } from "@/lib/utils";
import { isToolIndexedForSearch } from "@/data/indexing-policy";

export function generateStaticParams() {
  return tools.filter((tool) => !tool.href).map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tool = getTool(params.slug);
  if (!tool) return {};
  const canonical = canonicalUrl(toolHref(tool));
  const cleanTitle = withoutBrandSuffix(tool.metaTitle);
  const indexed = isToolIndexedForSearch(tool.slug);
  return {
    title: cleanTitle,
    description: tool.metaDescription,
    alternates: { canonical },
    robots: indexed ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      title: cleanTitle,
      description: tool.metaDescription,
      url: canonical,
      siteName: "FreeToolKit",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: tool.metaDescription
    }
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);
  if (!tool) notFound();
  if (tool.href) redirect(tool.href);
  const faqSchema = buildFaqSchema(tool.faq);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: tool.category, href: categoryRoutes[tool.category] },
    { name: tool.title, href: toolHref(tool) }
  ]);
  const softwareSchema = buildToolSoftwareSchema({
    name: tool.title,
    description: tool.description,
    href: toolHref(tool)
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <ToolLayout tool={tool} />
    </>
  );
}

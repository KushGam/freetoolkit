import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ToolLayout } from "@/components/ToolLayout";
import { getTool, tools, toolHref } from "@/data/tools";
import { siteUrl } from "@/lib/utils";

export function generateStaticParams() {
  return tools.filter((tool) => !tool.href).map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tool = getTool(params.slug);
  if (!tool) return {};
  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    alternates: { canonical: toolHref(tool) },
    openGraph: {
      title: `${tool.metaTitle} | FreeToolKit`,
      description: tool.metaDescription,
      url: `${siteUrl}${toolHref(tool)}`,
      siteName: "FreeToolKit",
      type: "website"
    }
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);
  if (!tool) notFound();
  if (tool.href) redirect(tool.href);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ToolLayout tool={tool} />
    </>
  );
}

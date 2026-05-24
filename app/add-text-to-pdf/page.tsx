import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { categoryRoutes, getTool, toolHref } from "@/data/tools";
import { buildBreadcrumbSchema, buildFaqSchema, buildToolSoftwareSchema, withoutBrandSuffix } from "@/lib/schema";
import { siteUrl } from "@/lib/utils";

const tool = getTool("add-text-to-pdf");

export const metadata: Metadata = {
  title: withoutBrandSuffix("Add Text and Sign PDF Online Free | freetoolkitapp"),
  description: "Add text, notes, dates, and signatures to PDF files online for free. No signup required. Works directly in your browser.",
  alternates: { canonical: `${siteUrl}/add-text-to-pdf` },
  openGraph: {
    title: withoutBrandSuffix("Add Text and Sign PDF Online Free | freetoolkitapp"),
    description: "Add text, notes, dates, and signatures to PDF files online for free. No signup required. Works directly in your browser.",
    url: `${siteUrl}/add-text-to-pdf`,
    siteName: "freetoolkitapp",
    type: "website"
  }
};

export default function AddTextToPdfPage() {
  if (!tool) return null;
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

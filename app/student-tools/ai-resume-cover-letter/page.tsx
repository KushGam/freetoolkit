import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/components/ToolLayout";
import { categoryRoutes, getTool, toolHref } from "@/data/tools";
import { buildBreadcrumbSchema, buildFaqSchema, buildToolSoftwareSchema, withoutBrandSuffix } from "@/lib/schema";
import { siteUrl } from "@/lib/utils";

const tool = getTool("ai-resume-cover-letter");

export const metadata: Metadata = {
  title: withoutBrandSuffix("AI Resume & Cover Letter Generator | FreeToolKit"),
  description: "Paste your resume text, add a job description, and generate a tailored resume and cover letter using Claude. Free and no signup required.",
  alternates: { canonical: `${siteUrl}/student-tools/ai-resume-cover-letter` },
  openGraph: {
    title: withoutBrandSuffix("AI Resume & Cover Letter Generator | FreeToolKit"),
    description: "Paste your resume text, add a job description, and generate a tailored resume and cover letter using Claude. Free and no signup required.",
    url: `${siteUrl}/student-tools/ai-resume-cover-letter`,
    siteName: "FreeToolKit",
    type: "website"
  }
};

export default function AiResumeCoverLetterPage() {
  if (!tool) notFound();
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

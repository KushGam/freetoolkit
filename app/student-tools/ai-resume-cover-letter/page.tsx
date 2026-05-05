import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolLayout } from "@/components/ToolLayout";
import { getTool } from "@/data/tools";
import { siteUrl } from "@/lib/utils";

const tool = getTool("ai-resume-cover-letter");

export const metadata: Metadata = {
  title: "AI Resume & Cover Letter Generator for Students | FreeToolKit",
  description: "Generate a tailored resume and cover letter from your existing resume and job description. Free, fast, and no signup required.",
  alternates: { canonical: `${siteUrl}/student-tools/ai-resume-cover-letter` },
  openGraph: {
    title: "AI Resume & Cover Letter Generator for Students | FreeToolKit",
    description: "Generate a tailored resume and cover letter from your existing resume and job description. Free, fast, and no signup required.",
    url: `${siteUrl}/student-tools/ai-resume-cover-letter`,
    siteName: "FreeToolKit",
    type: "website"
  }
};

export default function AiResumeCoverLetterPage() {
  if (!tool) notFound();
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

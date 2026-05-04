import type { Metadata } from "next";
import { ToolLayout } from "@/components/ToolLayout";
import { getTool } from "@/data/tools";
import { siteUrl } from "@/lib/utils";

const tool = getTool("add-text-to-pdf");

export const metadata: Metadata = {
  title: "Add Text and Sign PDF Online Free | FreeToolKit",
  description: "Add text, notes, dates, and signatures to PDF files online for free. No signup required. Works directly in your browser.",
  alternates: { canonical: "/add-text-to-pdf" },
  openGraph: {
    title: "Add Text and Sign PDF Online Free | FreeToolKit",
    description: "Add text, notes, dates, and signatures to PDF files online for free. No signup required. Works directly in your browser.",
    url: `${siteUrl}/add-text-to-pdf`,
    siteName: "FreeToolKit",
    type: "website"
  }
};

export default function AddTextToPdfPage() {
  if (!tool) return null;
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

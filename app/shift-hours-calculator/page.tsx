import { notFound } from "next/navigation";
import { ToolLayout } from "@/components/ToolLayout";
import { getTool } from "@/data/tools";
import { siteUrl } from "@/lib/utils";

const tool = getTool("shift-hours-calculator");

export const metadata = {
  title: "Shift Hours Calculator — Free Online Timesheet Tool | FreeToolKit",
  description: "Calculate hours worked per shift and weekly totals free online. Handles overnight shifts, break deductions, and pay estimates. No signup required.",
  alternates: { canonical: `${siteUrl}/shift-hours-calculator` },
  openGraph: {
    title: "Shift Hours Calculator — Free Online Timesheet Tool | FreeToolKit",
    description: "Calculate hours worked per shift and weekly totals free online. Handles overnight shifts, break deductions, and pay estimates. No signup required.",
    url: `${siteUrl}/shift-hours-calculator`,
    siteName: "FreeToolKit",
    type: "website"
  }
};

export default function ShiftHoursCalculatorPage() {
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

import { notFound } from "next/navigation";
import { ToolLayout } from "@/components/ToolLayout";
import { categoryRoutes, getTool, toolHref } from "@/data/tools";
import { buildBreadcrumbSchema, buildFaqSchema, buildToolSoftwareSchema, withoutBrandSuffix } from "@/lib/schema";
import { siteUrl } from "@/lib/utils";

const tool = getTool("shift-hours-calculator");

export const metadata = {
  title: withoutBrandSuffix("Shift Hours Calculator — Free Online Timesheet Tool | FreeToolKit"),
  description: "Calculate hours worked per shift and weekly totals free online. Handles overnight shifts, break deductions, and pay estimates. No signup required.",
  alternates: { canonical: `${siteUrl}/shift-hours-calculator` },
  openGraph: {
    title: withoutBrandSuffix("Shift Hours Calculator — Free Online Timesheet Tool | FreeToolKit"),
    description: "Calculate hours worked per shift and weekly totals free online. Handles overnight shifts, break deductions, and pay estimates. No signup required.",
    url: `${siteUrl}/shift-hours-calculator`,
    siteName: "FreeToolKit",
    type: "website"
  }
};

export default function ShiftHoursCalculatorPage() {
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

import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { categorySeo } from "@/data/seo";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: categorySeo["Calculator Tools"].title,
  description: categorySeo["Calculator Tools"].description,
  keywords: categorySeo["Calculator Tools"].keywords,
  alternates: { canonical: `${siteUrl}/calculator-tools` },
  openGraph: { title: categorySeo["Calculator Tools"].title, description: categorySeo["Calculator Tools"].description, url: `${siteUrl}/calculator-tools`, type: "website" }
};

export default function CalculatorToolsPage() {
  return (
    <CategoryPage
      category="Calculator Tools"
      intro="Free calculator tools for everyday math, date, finance, measurement, and scheduling tasks. Get fast browser-based results for age, units, percentages, EMI, and time zones."
    />
  );
}

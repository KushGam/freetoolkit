import type { Metadata } from "next";
import { TopLevelCategoryPage } from "@/components/top-level-category-page";
import { categorySeo } from "@/data/seo";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: categorySeo["AI Tools"].title,
  description: categorySeo["AI Tools"].description,
  keywords: categorySeo["AI Tools"].keywords,
  alternates: { canonical: `${siteUrl}/ai-tools` },
  openGraph: {
    title: categorySeo["AI Tools"].title,
    description: categorySeo["AI Tools"].description,
    url: `${siteUrl}/ai-tools`,
    type: "website"
  }
};

export default function AiToolsPage() {
  return <TopLevelCategoryPage category="AI Tools" />;
}

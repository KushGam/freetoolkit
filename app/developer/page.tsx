import type { Metadata } from "next";
import { TopLevelCategoryPage } from "@/components/top-level-category-page";
import { categorySeo } from "@/data/seo";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: categorySeo["Developer Tools"].title,
  description: categorySeo["Developer Tools"].description,
  keywords: categorySeo["Developer Tools"].keywords,
  alternates: { canonical: `${siteUrl}/developer` },
  openGraph: {
    title: categorySeo["Developer Tools"].title,
    description: categorySeo["Developer Tools"].description,
    url: `${siteUrl}/developer`,
    type: "website"
  }
};

export default function DeveloperPage() {
  return <TopLevelCategoryPage category="Developer" />;
}

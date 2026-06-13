import type { Metadata } from "next";
import { TopLevelCategoryPage } from "@/components/top-level-category-page";
import { categorySeo } from "@/data/seo";
import { siteUrl } from "@/lib/utils";
import { indexRobots } from "@/lib/seo-robots";

export const metadata: Metadata = {
  title: "Free Developer Productivity Tools Online",
  description: categorySeo["Developer Tools"].description,
  keywords: categorySeo["Developer Tools"].keywords,
  alternates: { canonical: `${siteUrl}/developer` },
  robots: indexRobots,
  openGraph: {
    title: "Free Developer Productivity Tools Online",
    description: categorySeo["Developer Tools"].description,
    url: `${siteUrl}/developer`,
    type: "website"
  }
};

export default function DeveloperPage() {
  return <TopLevelCategoryPage category="Developer" />;
}

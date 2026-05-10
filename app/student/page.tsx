import type { Metadata } from "next";
import { TopLevelCategoryPage } from "@/components/top-level-category-page";
import { categorySeo } from "@/data/seo";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Free Student Tools for Grades, Study, Writing, and Career Prep",
  description: categorySeo["Student Tools"].description,
  keywords: categorySeo["Student Tools"].keywords,
  alternates: { canonical: `${siteUrl}/student` },
  openGraph: {
    title: "Free Student Tools for Grades, Study, Writing, and Career Prep",
    description: categorySeo["Student Tools"].description,
    url: `${siteUrl}/student`,
    type: "website"
  }
};

export default function StudentPage() {
  return <TopLevelCategoryPage category="Student" />;
}

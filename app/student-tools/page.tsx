import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { categorySeo } from "@/data/seo";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: categorySeo["Student Tools"].title,
  description: categorySeo["Student Tools"].description,
  keywords: categorySeo["Student Tools"].keywords,
  alternates: { canonical: `${siteUrl}/student-tools` },
  openGraph: { title: categorySeo["Student Tools"].title, description: categorySeo["Student Tools"].description, url: `${siteUrl}/student-tools`, type: "website" }
};

export default function StudentToolsPage() {
  return <CategoryPage category="Student Tools" intro="Plan coursework, calculate grades, count words, and stay focused with simple free student tools." />;
}

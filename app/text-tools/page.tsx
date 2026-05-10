import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { categorySeo } from "@/data/seo";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: categorySeo["Text Tools"].title,
  description: categorySeo["Text Tools"].description,
  keywords: categorySeo["Text Tools"].keywords,
  alternates: { canonical: `${siteUrl}/text-tools` },
  openGraph: { title: categorySeo["Text Tools"].title, description: categorySeo["Text Tools"].description, url: `${siteUrl}/text-tools`, type: "website" }
};

export default function TextToolsPage() {
  return (
    <CategoryPage
      category="Text Tools"
      intro="Free text tools for writers, students, developers, and teams. Format text, remove duplicates, generate placeholder content, sort lines, and clean extra spaces in your browser."
    />
  );
}

import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { categorySeo } from "@/data/seo";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: categorySeo["Security Tools"].title,
  description: categorySeo["Security Tools"].description,
  keywords: categorySeo["Security Tools"].keywords,
  alternates: { canonical: `${siteUrl}/security-tools` },
  openGraph: { title: categorySeo["Security Tools"].title, description: categorySeo["Security Tools"].description, url: `${siteUrl}/security-tools`, type: "website" }
};

export default function SecurityToolsPage() {
  return (
    <CategoryPage
      category="Security Tools"
      intro="Free browser-based security utilities for safer everyday workflows. Generate strong random passwords with clear controls, no signup, and no paid API."
    />
  );
}

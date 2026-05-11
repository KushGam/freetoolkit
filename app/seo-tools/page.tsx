import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { categorySeo } from "@/data/seo";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: categorySeo["SEO Tools"].title,
  description: categorySeo["SEO Tools"].description,
  keywords: categorySeo["SEO Tools"].keywords,
  alternates: { canonical: `${siteUrl}/seo-tools` },
  openGraph: { title: categorySeo["SEO Tools"].title, description: categorySeo["SEO Tools"].description, url: `${siteUrl}/seo-tools`, type: "website" }
};

export default function SeoToolsPage() {
  return <CategoryPage category="SEO Tools" intro={categorySeo["SEO Tools"].intro} />;
}

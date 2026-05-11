import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { categorySeo } from "@/data/seo";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: categorySeo["Social Media Tools"].title,
  description: categorySeo["Social Media Tools"].description,
  keywords: categorySeo["Social Media Tools"].keywords,
  alternates: { canonical: `${siteUrl}/social-media-tools` },
  openGraph: { title: categorySeo["Social Media Tools"].title, description: categorySeo["Social Media Tools"].description, url: `${siteUrl}/social-media-tools`, type: "website" }
};

export default function SocialMediaToolsPage() {
  return <CategoryPage category="Social Media Tools" intro={categorySeo["Social Media Tools"].intro} />;
}

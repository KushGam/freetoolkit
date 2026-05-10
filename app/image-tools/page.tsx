import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { categorySeo } from "@/data/seo";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: categorySeo["Image Tools"].title,
  description: categorySeo["Image Tools"].description,
  keywords: categorySeo["Image Tools"].keywords,
  alternates: { canonical: `${siteUrl}/image-tools` },
  openGraph: { title: categorySeo["Image Tools"].title, description: categorySeo["Image Tools"].description, url: `${siteUrl}/image-tools`, type: "website" }
};

export default function ImageToolsPage() {
  return <CategoryPage category="Image Tools" intro="Compress images, resize photos, and convert between PNG, JPG, and WebP using free browser-based tools." />;
}

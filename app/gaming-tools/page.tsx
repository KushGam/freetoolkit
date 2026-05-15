import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { categorySeo } from "@/data/seo";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: categorySeo["Gaming Tools"].title,
  description: categorySeo["Gaming Tools"].description,
  keywords: categorySeo["Gaming Tools"].keywords,
  alternates: { canonical: `${siteUrl}/gaming-tools` },
  openGraph: { title: categorySeo["Gaming Tools"].title, description: categorySeo["Gaming Tools"].description, url: `${siteUrl}/gaming-tools`, type: "website" }
};

export default function GamingToolsPage() {
  return (
    <CategoryPage
      category="Gaming Tools"
      intro={categorySeo["Gaming Tools"].intro}
      hubNote="Our primary indexed game utility is the Palworld Breeding Calculator—read the Palworld breeding guide on the blog, then use the calculator before you commit rare in-game resources."
    />
  );
}

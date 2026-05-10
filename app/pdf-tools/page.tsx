import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { categorySeo } from "@/data/seo";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: categorySeo["PDF Tools"].title,
  description: categorySeo["PDF Tools"].description,
  keywords: categorySeo["PDF Tools"].keywords,
  alternates: { canonical: `${siteUrl}/pdf-tools` },
  openGraph: { title: categorySeo["PDF Tools"].title, description: categorySeo["PDF Tools"].description, url: `${siteUrl}/pdf-tools`, type: "website" }
};

export default function PdfToolsPage() {
  return <CategoryPage category="PDF Tools" intro="Edit common PDF tasks in your browser, including merge, split, rotate, extract pages, and lightweight PDF optimization." />;
}

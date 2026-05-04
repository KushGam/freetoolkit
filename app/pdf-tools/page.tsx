import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "Free PDF Tools",
  description: "Merge, split, rotate, extract, and optimize PDFs online for free with browser-based PDF tools.",
  openGraph: { title: "Free PDF Tools | FreeToolKit", description: "Free PDF tools for merging, splitting, rotating, extracting pages, and lightweight optimization." }
};

export default function PdfToolsPage() {
  return <CategoryPage category="PDF Tools" intro="Edit common PDF tasks in your browser, including merge, split, rotate, extract pages, and lightweight PDF optimization." />;
}

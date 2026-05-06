import type { Metadata } from "next";
import { TopLevelCategoryPage } from "@/components/top-level-category-page";

export const metadata: Metadata = {
  title: "PDF & Image Tools | FreeToolKit",
  description: "Free PDF and image productivity tools for converting, compressing, editing, extracting, and preparing files online with no signup.",
  alternates: { canonical: "https://www.freetoolkitapp.com/pdf-image" },
  openGraph: {
    title: "PDF & Image Tools | FreeToolKit",
    description: "Free browser-based PDF and image tools for everyday productivity workflows."
  }
};

export default function PdfImagePage() {
  return <TopLevelCategoryPage category="PDF & Image" />;
}

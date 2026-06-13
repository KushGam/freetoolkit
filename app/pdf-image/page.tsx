import type { Metadata } from "next";
import { TopLevelCategoryPage } from "@/components/top-level-category-page";
import { siteUrl } from "@/lib/utils";
import { indexRobots } from "@/lib/seo-robots";

export const metadata: Metadata = {
  title: "Free PDF & Image Tools Online",
  description: "Free PDF and image productivity tools for converting, compressing, editing, extracting, and preparing files online with no signup.",
  keywords: ["PDF tools", "image tools", "compress PDF", "image compressor", "file converter"],
  alternates: { canonical: `${siteUrl}/pdf-image` },
  robots: indexRobots,
  openGraph: {
    title: "Free PDF & Image Tools Online",
    description: "Free browser-based PDF and image tools for everyday productivity workflows.",
    url: `${siteUrl}/pdf-image`,
    type: "website"
  }
};

export default function PdfImagePage() {
  return <TopLevelCategoryPage category="PDF & Image" />;
}

import type { Metadata } from "next";
import { TopLevelCategoryPage } from "@/components/top-level-category-page";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Free Everyday Productivity Tools Online",
  description: "Free everyday productivity tools for calculators, text cleanup, QR codes, passwords, time zones, and quick browser-based tasks. No signup required.",
  keywords: ["everyday tools", "productivity tools", "calculator tools", "text tools", "QR code generator"],
  alternates: { canonical: `${siteUrl}/everyday` },
  openGraph: {
    title: "Free Everyday Productivity Tools Online",
    description: "Free everyday productivity tools for calculators, text cleanup, QR codes, passwords, and quick browser-based tasks.",
    url: `${siteUrl}/everyday`,
    type: "website"
  }
};

export default function EverydayPage() {
  return <TopLevelCategoryPage category="Everyday" />;
}

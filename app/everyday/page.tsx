import type { Metadata } from "next";
import { TopLevelCategoryPage } from "@/components/top-level-category-page";

export const metadata: Metadata = {
  title: "Everyday Tools | FreeToolKit",
  description: "Free everyday productivity tools for calculators, text cleanup, QR codes, passwords, time zones, and quick browser-based tasks. No signup required.",
  alternates: { canonical: "https://www.freetoolkitapp.com/everyday" },
  openGraph: {
    title: "Everyday Tools | FreeToolKit",
    description: "Free everyday productivity tools for calculators, text cleanup, QR codes, passwords, and quick browser-based tasks."
  }
};

export default function EverydayPage() {
  return <TopLevelCategoryPage category="Everyday" />;
}

import type { Metadata } from "next";
import { TopLevelCategoryPage } from "@/components/top-level-category-page";

export const metadata: Metadata = {
  title: "Developer Tools | FreeToolKit",
  description: "Free developer tools for JSON, encoding, UUIDs, URLs, and quick web utilities.",
  alternates: { canonical: "https://www.freetoolkitapp.com/developer" },
  openGraph: {
    title: "Developer Tools | FreeToolKit",
    description: "Free developer tools for JSON, encoding, UUIDs, URLs, and quick web utilities."
  }
};

export default function DeveloperPage() {
  return <TopLevelCategoryPage category="Developer" />;
}

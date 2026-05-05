import type { Metadata } from "next";
import { TopLevelCategoryPage } from "@/components/top-level-category-page";

export const metadata: Metadata = {
  title: "AI Tools | FreeToolKit",
  description: "Free AI-powered tools for resumes, cover letters, writing support, and productivity. No signup required.",
  alternates: { canonical: "https://www.freetoolkitapp.com/ai-tools" },
  openGraph: {
    title: "AI Tools | FreeToolKit",
    description: "Free AI-powered tools for resumes, cover letters, writing support, and productivity."
  }
};

export default function AiToolsPage() {
  return <TopLevelCategoryPage category="AI Tools" />;
}

import type { Metadata } from "next";
import { TopLevelCategoryPage } from "@/components/top-level-category-page";

export const metadata: Metadata = {
  title: "AI Tools | FreeToolKit",
  description: "Free AI tools for resumes, ATS checks, captions, hashtags, summaries, emails, study notes, and productivity. No signup required.",
  alternates: { canonical: "https://www.freetoolkitapp.com/ai-tools" },
  openGraph: {
    title: "AI Tools | FreeToolKit",
    description: "Free AI tools for writing, resumes, captions, hashtags, summaries, and productivity."
  }
};

export default function AiToolsPage() {
  return <TopLevelCategoryPage category="AI Tools" />;
}

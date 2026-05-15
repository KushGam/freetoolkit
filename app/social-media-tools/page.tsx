import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { categorySeo } from "@/data/seo";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: categorySeo["Social Media Tools"].title,
  description: categorySeo["Social Media Tools"].description,
  keywords: categorySeo["Social Media Tools"].keywords,
  alternates: { canonical: `${siteUrl}/social-media-tools` },
  openGraph: { title: categorySeo["Social Media Tools"].title, description: categorySeo["Social Media Tools"].description, url: `${siteUrl}/social-media-tools`, type: "website" }
};

export default function SocialMediaToolsPage() {
  return (
    <CategoryPage
      category="Social Media Tools"
      intro={categorySeo["Social Media Tools"].intro}
      hubNote="For fully expanded copy helpers today, use Word Counter, Case Converter, and Text Formatter from the Everyday hub, or AI Email Writer from AI Tools. Dedicated caption and hashtag utilities on this page are still being expanded to our indexed quality bar."
    />
  );
}

import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";
import { categorySeo } from "@/data/seo";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: categorySeo["Developer Tools"].title,
  description: categorySeo["Developer Tools"].description,
  keywords: categorySeo["Developer Tools"].keywords,
  alternates: { canonical: `${siteUrl}/developer-tools` },
  openGraph: { title: categorySeo["Developer Tools"].title, description: categorySeo["Developer Tools"].description, url: `${siteUrl}/developer-tools`, type: "website" }
};

export default function DeveloperToolsPage() {
  return (
    <CategoryPage
      category="Developer Tools"
      intro="Free browser-based developer tools for formatting JSON, encoding and decoding URLs, generating UUIDs, converting Base64 text, and creating QR codes without login or paid APIs."
    />
  );
}

import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "Daily Tools Online Free | FreeToolKit",
  description: "Use free daily browser tools for QR codes, text case, JSON, passwords, UUIDs, Base64, URLs, and quick PDF creation with no signup."
};

export default function DailyToolsPage() {
  return (
    <CategoryPage
      category="Daily Tools"
      intro="Free daily tools for quick browser-based tasks, including QR codes, URL encoding, JSON formatting, password generation, UUIDs, Base64 conversion, and simple text-to-PDF exports."
    />
  );
}

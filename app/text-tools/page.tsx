import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "Text Tools Online Free | FreeToolKit",
  description: "Clean, format, sort, deduplicate, and generate text online free. Browser-based text tools with copy actions and no signup."
};

export default function TextToolsPage() {
  return (
    <CategoryPage
      category="Text Tools"
      intro="Free text tools for writers, students, developers, and teams. Format text, remove duplicates, generate placeholder content, sort lines, and clean extra spaces in your browser."
    />
  );
}

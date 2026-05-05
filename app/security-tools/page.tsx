import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "Security Tools Online Free | FreeToolKit",
  description: "Use free browser-based security tools like a strong password generator with no signup, no login, and no paid API.",
  alternates: { canonical: "https://www.freetoolkitapp.com/security-tools" }
};

export default function SecurityToolsPage() {
  return (
    <CategoryPage
      category="Security Tools"
      intro="Free browser-based security utilities for safer everyday workflows. Generate strong random passwords with clear controls, no signup, and no paid API."
    />
  );
}

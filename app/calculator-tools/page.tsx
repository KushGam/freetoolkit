import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "Calculator Tools Online Free | FreeToolKit",
  description: "Use free calculator tools for age, units, percentages, loan EMI, and time zones. Fast browser calculators with no signup required."
};

export default function CalculatorToolsPage() {
  return (
    <CategoryPage
      category="Calculator Tools"
      intro="Free calculator tools for everyday math, date, finance, measurement, and scheduling tasks. Get fast browser-based results for age, units, percentages, EMI, and time zones."
    />
  );
}

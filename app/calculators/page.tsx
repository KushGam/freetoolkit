import type { Metadata } from "next";
import { TopLevelCategoryPage } from "@/components/top-level-category-page";
import { siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Free Online Calculators | BMI, Loan EMI, Percentage, Age & More",
  description: "Free browser calculators for BMI, loan EMI, percentages, discounts, age, interest, units, and scientific math. No signup required.",
  keywords: ["calculator tools", "BMI calculator", "percentage calculator", "loan EMI calculator", "unit converter"],
  alternates: { canonical: `${siteUrl}/calculators` },
  openGraph: {
    title: "Free Online Calculators | freetoolkitapp",
    description: "Everyday math calculators that run instantly in your browser.",
    url: `${siteUrl}/calculators`,
    type: "website"
  }
};

export default function CalculatorsPage() {
  return <TopLevelCategoryPage category="Calculators" />;
}

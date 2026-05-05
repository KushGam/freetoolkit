import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "Free Student Tools",
  description: "Calculate GPA and CGPA, count words, calculate grade percentages, and use a Pomodoro study timer.",
  alternates: { canonical: "https://www.freetoolkitapp.com/student-tools" },
  openGraph: { title: "Free Student Tools | FreeToolKit", description: "Free student tools for GPA, CGPA, grades, study timing, and word counting." }
};

export default function StudentToolsPage() {
  return <CategoryPage category="Student Tools" intro="Plan coursework, calculate grades, count words, and stay focused with simple free student tools." />;
}

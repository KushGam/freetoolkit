import type { Metadata } from "next";
import { TopLevelCategoryPage } from "@/components/top-level-category-page";

export const metadata: Metadata = {
  title: "Student Tools | FreeToolKit",
  description: "Free student tools for grades, GPA, attendance, study time, word count, and career preparation.",
  alternates: { canonical: "https://www.freetoolkitapp.com/student" },
  openGraph: {
    title: "Student Tools | FreeToolKit",
    description: "Free student tools for grades, GPA, attendance, study time, word count, and career preparation."
  }
};

export default function StudentPage() {
  return <TopLevelCategoryPage category="Student" />;
}

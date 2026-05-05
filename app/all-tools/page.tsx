import type { Metadata } from "next";
import { AllToolsSearch } from "@/components/AllToolsSearch";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "All Free Online Tools",
  description: "Search all FreeToolKit everyday, student, AI, and developer tools in one clean directory.",
  alternates: { canonical: "https://www.freetoolkitapp.com/all-tools" },
  openGraph: {
    title: "All Free Online Tools | FreeToolKit",
    description: "Find free browser-based tools for everyday tasks, students, AI workflows, and developers."
  }
};

export default function AllToolsPage({ searchParams }: { searchParams?: { q?: string } }) {
  return (
    <main>
      <Container className="max-w-6xl py-10">
      <PageHeader
        eyebrow="Searchable toolkit"
        title="All tools"
        description="Search every free FreeToolKit utility across Everyday, Student, AI Tools, and Developer. Tools are organized for quick access and designed to work without login or paid APIs."
        badges={["Everyday", "Student", "AI Tools", "Developer"]}
      />
      <div className="mt-8"><AllToolsSearch initialQuery={searchParams?.q ?? ""} /></div>
      </Container>
    </main>
  );
}

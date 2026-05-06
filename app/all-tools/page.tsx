import type { Metadata } from "next";
import { AllToolsSearch } from "@/components/AllToolsSearch";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "All Free AI & Productivity Tools",
  description: "Search every FreeToolKit AI, everyday, student, developer, PDF, and image tool in one clean productivity platform.",
  alternates: { canonical: "https://www.freetoolkitapp.com/all-tools" },
  openGraph: {
    title: "All Free AI & Productivity Tools | FreeToolKit",
    description: "Find free browser-based tools for AI workflows, everyday tasks, PDFs, images, students, and developers."
  }
};

export default function AllToolsPage({ searchParams }: { searchParams?: { q?: string } }) {
  return (
    <main>
      <Container className="max-w-6xl py-10">
      <PageHeader
        eyebrow="Searchable toolkit"
        title="All FreeToolKit tools"
        description="Search every free AI and everyday productivity tool across Everyday, AI Tools, Student, Developer, and PDF & Image. Tools are organized for quick access and designed to work without login."
        badges={["Everyday", "AI Tools", "Student", "Developer", "PDF & Image"]}
      />
      <div className="mt-8"><AllToolsSearch initialQuery={searchParams?.q ?? ""} /></div>
      </Container>
    </main>
  );
}

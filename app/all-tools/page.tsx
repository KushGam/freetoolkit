import type { Metadata } from "next";
import { AllToolsSearch } from "@/components/AllToolsSearch";
import { Container, PageHeader } from "@/components/ui";
import { canonicalUrl } from "@/lib/utils";

export function generateMetadata({ searchParams }: { searchParams?: { q?: string } }): Metadata {
  const hasQuery = Boolean(searchParams?.q?.trim());
  return {
    title: "All Free AI & Productivity Tools",
    description: "Search every FreeToolKit AI, everyday, student, developer, PDF, image, SEO, social media, and gaming tool in one clean productivity platform.",
    alternates: { canonical: canonicalUrl("/all-tools") },
    robots: hasQuery ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: "All Free AI & Productivity Tools",
      description: "Find free browser-based tools for AI workflows, everyday tasks, PDFs, images, students, developers, SEO, social media, and gaming workflows.",
      url: canonicalUrl("/all-tools"),
      type: "website"
    }
  };
}

export default function AllToolsPage({ searchParams }: { searchParams?: { q?: string } }) {
  return (
    <main>
      <Container className="max-w-6xl py-10">
      <PageHeader
        eyebrow="Searchable toolkit"
        title="All FreeToolKit tools"
        description="Search every free AI and everyday productivity tool across Everyday, AI Tools, Student, Developer, PDF & Image, SEO Tools, Social Media Tools, and Gaming Tools. Tools are organized for quick access and designed to work without login."
        badges={["Everyday", "AI Tools", "PDF & Image", "SEO Tools", "Social Media Tools", "Gaming Tools"]}
      />
      <div className="mt-8"><AllToolsSearch initialQuery={searchParams?.q ?? ""} /></div>
      </Container>
    </main>
  );
}

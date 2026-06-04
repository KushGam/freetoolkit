import type { Metadata } from "next";
import { AllToolsSearch } from "@/components/AllToolsSearch";
import { Container, PageHeader } from "@/components/ui";
import { canonicalUrl } from "@/lib/utils";

export function generateMetadata(): Metadata {
  return {
    title: "All Free Productivity Tools",
    description: "Search every curated freetoolkitapp tool across AI, PDF & Image, SEO, Developer, and Calculators.",
    alternates: { canonical: canonicalUrl("/all-tools") },
    robots: { index: false, follow: true },
    openGraph: {
      title: "All Free Productivity Tools",
      description: "Find free browser-based tools for AI workflows, PDFs, images, SEO, developers, and calculators.",
      url: canonicalUrl("/all-tools"),
      type: "website"
    }
  };
}

export default function AllToolsPage({ searchParams }: { searchParams?: { q?: string } }) {
  return (
    <main className="mesh-bg min-h-screen">
      <Container className="max-w-6xl py-10">
      <PageHeader
        eyebrow="Searchable toolkit"
        title="All freetoolkitapp tools"
        description="Search every curated freetoolkitapp tool across AI Tools, PDF & Image, SEO Tools, Developer, and Calculators. Tools are organized for quick access and designed to work without login."
        badges={["AI Tools", "PDF & Image", "SEO Tools", "Developer", "Calculators"]}
      />
      <div className="mt-8"><AllToolsSearch initialQuery={searchParams?.q ?? ""} /></div>
      </Container>
    </main>
  );
}

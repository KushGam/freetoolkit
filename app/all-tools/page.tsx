import type { Metadata } from "next";
import { Suspense } from "react";
import AllToolsPageClient from "./AllToolsPageClient";
import { canonicalUrl } from "@/lib/utils";
import { indexRobots } from "@/lib/seo-robots";
import { curatedToolCount } from "@/data/site-trust";

export function generateMetadata(): Metadata {
  return {
    title: `All ${curatedToolCount} Free Online Tools — No Signup`,
    description:
      `Browse all ${curatedToolCount} free browser-based tools. PDF, image, AI, SEO, developer, and calculator tools. No signup, no upload, instant results.`,
    alternates: { canonical: canonicalUrl("/all-tools") },
    robots: indexRobots,
    openGraph: {
      title: "All Free Productivity Tools",
      description: "Find free browser-based tools for AI workflows, PDFs, images, SEO, developers, and calculators.",
      url: canonicalUrl("/all-tools"),
      type: "website"
    }
  };
}

export default function AllToolsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-bg pt-[60px]">
          <section className="px-4 py-16 text-center sm:px-6">
            <p className="text-text-2">Loading tools catalog…</p>
          </section>
        </main>
      }
    >
      <AllToolsPageClient />
    </Suspense>
  );
}

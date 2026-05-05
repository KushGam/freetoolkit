import type { Metadata } from "next";
import { Card, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "About FreeToolKit",
  description: "Learn about FreeToolKit, a free no-login website for browser-based image, PDF, and student tools.",
  alternates: { canonical: "https://www.freetoolkitapp.com/about" }
};

export default function AboutPage() {
  return (
    <main>
      <Container className="max-w-4xl py-12 sm:py-16">
      <PageHeader eyebrow="About" title="About FreeToolKit" description="A free, no-login toolkit for quick browser-based work." badges={["No signup", "Browser-based", "Mobile-first"]} />
      <Card className="prose-lite mt-6 p-6 sm:p-8">
        <p>
          FreeToolKit is a collection of free online tools for common image, PDF, and student tasks. The goal is simple: open the page, finish the job, and move on without creating an account or paying for an API-backed workflow.
        </p>
        <p>
          The website is built with a mobile-first interface, reusable ad placements, and useful SEO content on every tool page. Image and PDF tools are designed to run in the browser where possible, while calculators and writing tools work instantly on the client side.
        </p>
      </Card>
      </Container>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { TrustCallout } from "@/components/TrustCallout";
import { Card, Container, PageHeader } from "@/components/ui";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { canonicalUrl, siteUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About FreeToolKit",
  description:
    "FreeToolKit publishes free browser-based productivity tools, student calculators, PDF utilities, image workflows, and editorial guides. Learn our mission, quality bar, and how we approach AI-assisted features.",
  alternates: { canonical: canonicalUrl("/about") },
  openGraph: {
    title: "About FreeToolKit",
    description: "Mission, editorial standards, and approach for FreeToolKit's free browser tools and guides.",
    url: canonicalUrl("/about"),
    type: "website"
  }
};

export default function AboutPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "About", href: "/about" }
  ]);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Container className="max-w-4xl py-12 sm:py-16">
        <PageHeader
          eyebrow="About"
          title="About FreeToolKit"
          description="FreeToolKit is an independent productivity site that ships calm, fast utilities for documents, media, writing, math, and developer workflows—without forcing visitors through signup walls."
          badges={["Editorial guides", "Browser-first", "Transparent AI use"]}
        />
        <TrustCallout className="mt-6" />
        <Card className="prose-lite mt-6 p-6 sm:p-8">
          <h2>Mission</h2>
          <p>
            Utility sites often optimize for ad clicks instead of outcomes. We optimize for task completion: clear headings, predictable controls, honest limitations, and long-form context when a topic deserves more than a textarea. Whether you are compressing a photo before a deadline or generating study notes, the interface should respect your time and attention.
          </p>

          <h2>What we publish</h2>
          <p>
            The directory spans{" "}
            <Link href="/pdf-image" className="font-bold text-brand-700 hover:text-brand-900">PDF &amp; image tools</Link>,{" "}
            <Link href="/ai-tools" className="font-bold text-brand-700 hover:text-brand-900">AI drafting assistants</Link>,{" "}
            <Link href="/student" className="font-bold text-brand-700 hover:text-brand-900">student calculators</Link>,{" "}
            <Link href="/developer" className="font-bold text-brand-700 hover:text-brand-900">developer utilities</Link>,{" "}
            <Link href="/seo-tools" className="font-bold text-brand-700 hover:text-brand-900">SEO helpers</Link>, and more. Each tool page explains how to use the feature, when it works best, and what to double-check before you submit results to school or work.
          </p>
          <p>
            The <Link href="/blog" className="font-bold text-brand-700 hover:text-brand-900">blog</Link> hosts evergreen guides on PDF hygiene, image formats, GPA planning, privacy habits, and productivity workflows. Guides intentionally link back into tools so reading becomes doing.
          </p>

          <h2>AI principles</h2>
          <p>
            AI-assisted pages disclose that outputs require human review. We do not promise perfect grades, guaranteed job offers, or legal compliance from generated text. Where models can hallucinate, we warn first. Academic integrity matters: follow your institution&apos;s policies and use assistants to learn—not to shortcut ethical rules.
          </p>

          <h2>Contact &amp; improvements</h2>
          <p>
            Feedback keeps the platform accurate. If a tool behaves unexpectedly on your browser, or you want a responsible new utility, reach out via the{" "}
            <Link href="/contact" className="font-bold text-brand-700 hover:text-brand-900">contact page</Link>. We read messages even if we cannot reply instantly.
          </p>

          <h2>Operator</h2>
          <p>
            FreeToolKit is built and maintained by Kushal Gautam. Product updates ship continuously; you can verify the live domain at{" "}
            <a className="font-bold text-brand-700" href={siteUrl}>{siteUrl.replace("https://", "")}</a>.
          </p>
        </Card>
      </Container>
    </main>
  );
}

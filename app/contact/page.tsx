import type { Metadata } from "next";
import Link from "next/link";
import { TrustCallout } from "@/components/TrustCallout";
import { Card, Container, PageHeader } from "@/components/ui";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { canonicalUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact FreeToolKit",
  description: "Contact FreeToolKit for feedback, bug reports, partnership questions, or responsible tool suggestions.",
  alternates: { canonical: canonicalUrl("/contact") },
  openGraph: {
    title: "Contact FreeToolKit",
    description: "Reach the FreeToolKit team for feedback, bugs, or tool ideas.",
    url: canonicalUrl("/contact"),
    type: "website"
  }
};

export default function ContactPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact" }
  ]);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Container className="max-w-4xl py-12 sm:py-16">
        <PageHeader
          eyebrow="Contact"
          title="Contact"
          description="We read every message. Please avoid sending confidential documents or secrets by email—describe the issue in words instead."
          badges={["Feedback", "Bug reports", "Tool ideas"]}
        />
        <TrustCallout className="mt-6" />
        <Card className="prose-lite mt-6 p-6 sm:p-8">
          <h2>Email the team</h2>
          <p>
            Write to <a className="font-bold text-brand-700" href="mailto:hello@freetoolkitapp.com">hello@freetoolkitapp.com</a>. Include your browser version, device type, and steps to reproduce if you are reporting a bug.
          </p>
          <h2>Before you attach files</h2>
          <p>
            Many FreeToolKit utilities intentionally process files inside your browser. If you need help with a broken PDF, describe the symptom (error text, page count, encryption message) instead of attaching highly sensitive documents.
          </p>
          <h2>Legal &amp; privacy</h2>
          <p>
            For policy questions, review the <Link href="/privacy-policy" className="font-bold text-brand-700 hover:text-brand-900">Privacy Policy</Link>,{" "}
            <Link href="/terms" className="font-bold text-brand-700 hover:text-brand-900">Terms of Use</Link>, and{" "}
            <Link href="/disclaimer" className="font-bold text-brand-700 hover:text-brand-900">Disclaimer</Link>.
          </p>
        </Card>
      </Container>
    </main>
  );
}

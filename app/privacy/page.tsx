import type { Metadata } from "next";
import { Card, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy | FreeToolKit",
  description: "Read the FreeToolKit Privacy Policy covering browser-first file processing, AI features, analytics, advertising, data retention, and contact handling.",
  alternates: { canonical: "https://www.freetoolkitapp.com/privacy" }
};

export default function PrivacyPage() {
  return (
    <main>
      <Container className="max-w-4xl py-12 sm:py-16">
      <PageHeader eyebrow="Legal" title="Privacy Policy" description="How FreeToolKit handles browser-based tools, contact, advertising, and analytics." badges={["No login required", "Browser-first", "Ad-supported"]} />
      <Card className="prose-lite mt-6 p-6 sm:p-8">
        <h2>Overview</h2>
        <p>
          FreeToolKit is a browser-first platform with 138 free tools across AI, PDF, image, student, developer, SEO, social media, and resume workflows. Many features work without account creation, and the product is designed for quick, practical everyday tasks.
        </p>
        <h2>File processing</h2>
        <p>
          Many file tools process files locally in your browser where possible. For some AI or server-powered workflows, requests may be sent to FreeToolKit servers or trusted third-party APIs to complete the feature. Please avoid uploading sensitive, confidential, or highly regulated files unless you are comfortable with that risk.
        </p>
        <h2>AI features</h2>
        <p>
          Some FreeToolKit tools use third-party AI providers to generate results such as writing drafts, summaries, resumes, and other assistance. AI output may be incomplete or inaccurate, so you should review and verify generated content before using it for school, work, legal, financial, or other important decisions.
        </p>
        <h2>Analytics and advertising</h2>
        <p>
          FreeToolKit uses analytics and advertising services to understand platform usage and support a free product model. These services may use cookies or similar technologies. Third-party providers, including Google AdSense and analytics providers, may collect usage data under their own privacy policies.
        </p>
        <h2>Contact information</h2>
        <p>
          If you contact FreeToolKit through the contact form or email, we may use your message details and email address to respond and provide support. Please do not send sensitive personal information, confidential documents, passwords, or payment details in contact messages.
        </p>
        <h2>Data retention</h2>
        <p>
          FreeToolKit does not intentionally permanently store files that are processed in the browser. For server or API-based requests, limited temporary retention may occur for technical operations, abuse prevention, reliability, and security logging.
        </p>
        <h2>Acceptable use</h2>
        <p>
          You agree not to misuse the platform or attempt abuse such as spam, automated attacks, scraping at harmful scale, malicious uploads, unauthorized access attempts, or activity that disrupts normal service for other users.
        </p>
        <h2>Policy updates</h2>
        <p>
          FreeToolKit may update this Privacy Policy as the platform evolves. We recommend reviewing this page periodically to stay informed about how privacy practices may change over time.
        </p>
      </Card>
      </Container>
    </main>
  );
}

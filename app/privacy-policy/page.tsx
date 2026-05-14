import type { Metadata } from "next";
import Link from "next/link";
import { TrustCallout } from "@/components/TrustCallout";
import { Card, Container, PageHeader } from "@/components/ui";
import { canonicalUrl } from "@/lib/utils";
import { withoutBrandSuffix } from "@/lib/schema";

export const metadata: Metadata = {
  title: withoutBrandSuffix("Privacy Policy | FreeToolKit"),
  description:
    "FreeToolKit Privacy Policy: browser-first processing, AI features, analytics, advertising (including Google AdSense), cookies, data retention, children’s privacy, and how to contact us.",
  alternates: { canonical: canonicalUrl("/privacy-policy") },
  openGraph: {
    title: "Privacy Policy | FreeToolKit",
    description: "How FreeToolKit handles privacy for free browser tools, AI features, ads, and analytics.",
    url: canonicalUrl("/privacy-policy"),
    type: "website"
  },
  robots: { index: true, follow: true }
};

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Container className="max-w-4xl py-12 sm:py-16">
        <PageHeader
          eyebrow="Legal"
          title="Privacy Policy"
          description="Last updated: May 14, 2026. This policy explains how FreeToolKit treats information when you use our free tools, read guides, or contact the team."
          badges={["No account required", "Browser-first design", "Transparency"]}
        />
        <TrustCallout className="mt-6" />
        <Card className="prose-lite mt-6 p-6 sm:p-8">
          <h2>Who we are</h2>
          <p>
            FreeToolKit (“FreeToolKit”, “we”, “us”) operates the website FreeToolKitApp.com as a collection of browser-based productivity utilities, educational articles, and optional AI-assisted features. The service is designed so that many tasks can be completed without creating an account.
          </p>

          <h2>Information we collect</h2>
          <p>
            <strong>Information you provide.</strong> If you email us or use a contact channel, we receive the contents of your message and your email address so we can respond. Please do not send passwords, payment card numbers, government ID numbers, or highly confidential attachments.
          </p>
          <p>
            <strong>Tool inputs.</strong> For tools that run entirely in your browser (many image and PDF utilities), files and text you process may remain on your device and are not intentionally uploaded to our servers. For AI-assisted tools or features that require server processing, the minimum text or file data needed to complete the request may be transmitted to our infrastructure or to vetted third-party AI providers.
          </p>
          <p>
            <strong>Technical data.</strong> Like most websites, our hosting and analytics partners may automatically log information such as IP address, browser type, device type, approximate region, referring URL, pages viewed, and timestamps. This helps us operate, secure, and improve the service.
          </p>

          <h2>Cookies and similar technologies</h2>
          <p>
            We and our partners may use cookies, local storage, or similar technologies for preferences, consent records, abuse prevention, performance measurement, and advertising. Advertising partners such as Google AdSense may use cookies to show personalized or non-personalized ads depending on your region and choices.
          </p>
          <p>
            You can control cookies through your browser settings. Blocking certain cookies may limit some features or ad personalization.
          </p>

          <h2>Advertising and Google AdSense</h2>
          <p>
            FreeToolKit is supported in part by display advertising. Third-party ad vendors, including Google, may use cookies to serve ads based on your visits to this and other websites. Google’s use of advertising cookies enables it and its partners to serve ads based on your browsing. You can learn more about how Google uses data in Google’s Privacy &amp; Terms documentation.
          </p>
          <p>
            Where required, we present consent options before loading non-essential advertising or analytics scripts.
          </p>

          <h2>AI processing</h2>
          <p>
            When you use AI tools, your prompt text (and, for supported tools, other inputs you provide) may be sent to AI model providers to generate a response. Do not submit secrets, regulated health data, or legally privileged content. Treat AI outputs as drafts that require human review.
          </p>

          <h2>Data retention</h2>
          <p>
            We do not intend to keep permanent copies of files processed locally in your browser. Server logs and security records may be retained for a limited period for reliability and abuse prevention. Email correspondence may be retained as long as needed to complete support conversations.
          </p>

          <h2>Children’s privacy</h2>
          <p>
            FreeToolKit is a general-purpose productivity site and is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided personal data, contact us so we can delete it where appropriate.
          </p>

          <h2>International users</h2>
          <p>
            Visitors may access the site from many countries. By using FreeToolKit, you understand that information may be processed in jurisdictions where privacy laws differ from your own.
          </p>

          <h2>Your choices</h2>
          <p>
            You may request access, correction, or deletion of personal information you have provided via email, subject to legal exceptions. Because many tools do not require accounts, we may need reasonable verification before fulfilling certain requests.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this Privacy Policy when we add features, change vendors, or comply with new laws. Material changes will be reflected by updating the “Last updated” date at the top of this page.
          </p>

          <h2>Contact</h2>
          <p>
            Privacy questions: <a className="font-bold text-brand-700" href="mailto:hello@freetoolkitapp.com">hello@freetoolkitapp.com</a>. You can also read our{" "}
            <Link href="/terms" className="font-bold text-brand-700 hover:text-brand-900">Terms of Use</Link>,{" "}
            <Link href="/disclaimer" className="font-bold text-brand-700 hover:text-brand-900">Disclaimer</Link>, and{" "}
            <Link href="/contact" className="font-bold text-brand-700 hover:text-brand-900">Contact</Link> pages.
          </p>
        </Card>
      </Container>
    </main>
  );
}

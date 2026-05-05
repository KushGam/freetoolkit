import type { Metadata } from "next";
import { Card, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the FreeToolKit privacy policy for browser-based tools, analytics, advertising, and contact information.",
  alternates: { canonical: "https://www.freetoolkitapp.com/privacy" }
};

export default function PrivacyPage() {
  return (
    <main>
      <Container className="max-w-4xl py-12 sm:py-16">
      <PageHeader eyebrow="Legal" title="Privacy Policy" description="How FreeToolKit handles browser-based tools, contact, advertising, and analytics." badges={["No login required", "Browser-first", "Ad-supported"]} />
      <Card className="prose-lite mt-6 p-6 sm:p-8">
        <p>
          FreeToolKit is built to be used without login. Image and PDF tools process files in the browser where possible. The site does not intentionally upload your selected files to a FreeToolKit server for these client-side tools.
        </p>
        <p>
          FreeToolKit may use Google AdSense or another advertising provider. Advertising or analytics scripts may use cookies or similar technologies according to their own policies.
        </p>
        <p>
          If you contact us by email, we may use your email address to respond to your message. Do not send confidential documents or sensitive personal files through contact email.
        </p>
      </Card>
      </Container>
    </main>
  );
}

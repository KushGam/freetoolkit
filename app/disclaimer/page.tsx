import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { TrustCallout } from "@/components/TrustCallout";
import { canonicalUrl } from "@/lib/utils";
import { withoutBrandSuffix } from "@/lib/schema";

export const metadata: Metadata = {
  title: withoutBrandSuffix("Disclaimer | freetoolkitapp"),
  description:
    "Important disclaimer for freetoolkitapp: AI outputs, calculations, file conversions, and third-party services are provided as-is for informational and productivity use.",
  alternates: { canonical: canonicalUrl("/disclaimer") },
  openGraph: {
    title: "Disclaimer | freetoolkitapp",
    description: "How to interpret AI results, file tools, calculators, and educational content on freetoolkitapp.",
    url: canonicalUrl("/disclaimer"),
    type: "website"
  }
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-bg pt-[60px]">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <SectionHeader
          eyebrow="Legal"
          title="Disclaimer"
          subtitle="freetoolkitapp provides browser-based utilities and guides. Please read this page before relying on any output for important decisions."
          align="left"
        />
        <TrustCallout className="mt-6" />
        <div className="prose-site mt-12 rounded-2xl border border-border bg-bg2 p-6 sm:p-8">
          <h2>General</h2>
          <p>
            freetoolkitapp (the “site”) offers free online tools, articles, and educational content. All materials are provided on an “as is” and “as available” basis without warranties of any kind, whether express or implied, including fitness for a particular purpose, accuracy, completeness, or non-infringement.
          </p>
          <p>
            We do not guarantee uninterrupted access, error-free operation, or that every tool will meet every regulatory, academic, workplace, or platform requirement. You use the site at your own risk.
          </p>

          <h2>AI-generated content</h2>
          <p>
            Tools that use artificial intelligence may produce incomplete, outdated, biased, or factually incorrect text. AI output is not legal, medical, financial, tax, career, academic, or professional advice. You must review, edit, and verify any AI-generated content before submitting it to a school, employer, client, government agency, or publication.
          </p>
          <p>
            You are solely responsible for complying with academic integrity policies, employment agreements, platform terms, copyright law, and applicable regulations when using AI-assisted tools.
          </p>

          <h2>Calculators and numeric results</h2>
          <p>
            Calculators and grade estimators perform arithmetic based on the values you enter. They do not replace official transcripts, payroll systems, medical devices, financial statements, or institution-specific grading rules. Always confirm important numbers with an authoritative source.
          </p>

          <h2>File and document tools</h2>
          <p>
            PDF, image, and conversion tools may alter layout, fonts, metadata, accessibility tags, or embedded content. Many workflows run in your browser, which improves privacy for supported formats but still depends on your device memory, browser version, and file complexity. Back up originals before processing sensitive documents.
          </p>

          <h2>Third-party trademarks and games</h2>
          <p>
            References to games, software, or brands are for descriptive purposes. Names and logos belong to their respective owners. freetoolkitapp is not affiliated with or endorsed by those owners unless explicitly stated.
          </p>

          <h2>External links and advertising</h2>
          <p>
            The site may display advertisements or link to third-party websites. We do not control third-party content, cookies, or policies. Review their terms and privacy notices before sharing personal data.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, freetoolkitapp and its operators shall not be liable for any indirect, incidental, consequential, or special damages arising from your use of the site, including loss of data, profits, or business opportunities.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this disclaimer? Email{" "}
            <a className="font-bold text-indigo-400 hover:text-ink-primary" href="mailto:hello@freetoolkitapp.com">hello@freetoolkitapp.com</a>, visit our{" "}
            <Link href="/contact" className="font-bold text-indigo-400 hover:text-ink-primary">contact page</Link>, or review the{" "}
            <Link href="/terms" className="font-bold text-indigo-400 hover:text-ink-primary">Terms of Use</Link> and{" "}
            <Link href="/privacy-policy" className="font-bold text-indigo-400 hover:text-ink-primary">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}

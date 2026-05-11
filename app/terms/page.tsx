import type { Metadata } from "next";
import { Card, Container, PageHeader } from "@/components/ui";
import { withoutBrandSuffix } from "@/lib/schema";
import { canonicalUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: withoutBrandSuffix("Terms of Use | FreeToolKit"),
  description: "Read the FreeToolKit terms for AI tools, file conversion tools, SEO tools, social media tools, calculators, and browser-based utilities.",
  alternates: { canonical: canonicalUrl("/terms") },
  openGraph: {
    title: withoutBrandSuffix("Terms of Use | FreeToolKit"),
    description: "Terms for using FreeToolKit's free AI, file, SEO, social media, student, calculator, and browser-based productivity tools.",
    url: canonicalUrl("/terms"),
    type: "website"
  }
};

export default function TermsPage() {
  return (
    <main>
      <Container className="max-w-4xl py-12 sm:py-16">
        <PageHeader
          eyebrow="Legal"
          title="Terms of Use"
          description="Simple terms for using FreeToolKit's AI tools, file tools, SEO helpers, social media utilities, calculators, and browser-based workflows."
          badges={["Use responsibly", "Review results", "As-is tools"]}
        />
        <Card className="prose-lite mt-6 p-6 sm:p-8">
          <p>
            These Terms of Use explain how you may use FreeToolKit. The site is built as a practical toolkit for everyday productivity, education, content work, file preparation, SEO tasks, social media workflows, resumes, calculators, and lightweight technical utilities.
          </p>

          <h2>General Use</h2>
          <p>
            FreeToolKit tools are provided for productivity, educational, informational, and general workflow support. The tools are provided as-is, and we do not guarantee that every result will be perfect, complete, or suitable for every situation.
          </p>
          <p>
            You are responsible for checking outputs before relying on them. Calculations, generated text, file conversions, formatting, SEO snippets, social media drafts, and other results may vary based on your input, browser, device, source files, and the limits of the tool.
          </p>

          <h2>AI-Generated Content</h2>
          <p>
            Some FreeToolKit tools generate or rewrite content using AI. AI output can contain mistakes, missing context, awkward wording, or inaccurate suggestions. You should review, edit, and verify generated content before using it in applications, assignments, websites, posts, messages, or documents.
          </p>
          <p>
            AI results are not professional, legal, financial, medical, academic, career, or compliance advice. Resume, cover letter, study, writing, caption, SEO, and business-name outputs are drafts or suggestions only. Use your judgment and follow the rules of your school, employer, platform, or organization.
          </p>

          <h2>File Processing and Uploads</h2>
          <p>
            Some tools may ask you to upload or select files so they can be converted, compressed, inspected, or prepared for download. Many browser-based tools process files locally in your browser where possible, while some workflows may process files temporarily to complete the requested action.
          </p>
          <p>
            You are responsible for keeping backup copies of important source files and reviewing any generated or downloaded files before sharing, submitting, or publishing them. FreeToolKit is not responsible for corrupted source files, unsupported formats, browser limitations, or output that does not match your expected layout, size, formatting, or quality.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            Some AI features may rely on third-party providers to generate results. Availability, speed, quality, and limits may change depending on those services, network conditions, and platform updates.
          </p>
          <p>
            If a third-party service is unavailable, a related FreeToolKit feature may be temporarily unavailable or may return an error. We may update providers, models, limits, or workflows over time to keep the platform reliable.
          </p>

          <h2>Gaming Tools and Trademarks</h2>
          <p>
            FreeToolKit is an independent tools platform and is not affiliated with, endorsed by, or sponsored by game developers or publishers.
          </p>
          <p>
            Game names, trademarks, logos, and related content belong to their respective owners.
          </p>

          <h2>Acceptable Use</h2>
          <p>
            You agree to use FreeToolKit lawfully and responsibly. Do not use the site to create spam, harassment, deceptive content, malware, illegal material, or content that violates the rights of another person.
          </p>
          <p>
            You also agree not to abuse the service, scrape at unreasonable scale, bypass limits, overload infrastructure, run automated attacks, interfere with other users, or attempt to disrupt the site. AI tools should not be used to impersonate others, fabricate credentials, cheat, or misrepresent facts.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            FreeToolKit does not guarantee that a tool output will meet official, legal, academic, platform, workplace, government, or technical requirements. Before using any result, verify it against the source of truth that applies to your situation.
          </p>
          <p>
            To the fullest extent allowed by applicable law, FreeToolKit is not responsible for losses, missed deadlines, rejected submissions, account issues, ranking changes, file problems, or other outcomes that may result from using or relying on the tools.
          </p>

          <h2>Availability and Changes</h2>
          <p>
            FreeToolKit may change, update, limit, pause, or remove tools and features at any time. We may also revise these terms as the platform grows. Continued use of the site means you accept the current version of these terms.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about these terms or notice an issue with a tool, contact us through the FreeToolKit contact page.
          </p>
        </Card>
      </Container>
    </main>
  );
}

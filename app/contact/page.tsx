import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { TrustCallout } from "@/components/TrustCallout";
import { founder, siteContactEmail } from "@/data/site-trust";
import { buildBreadcrumbSchema } from "@/lib/schema";
import { canonicalUrl } from "@/lib/utils";
import { indexRobots } from "@/lib/seo-robots";

export const metadata: Metadata = {
  title: "Contact freetoolkitapp",
  description: "Contact Kushal Gautam at freetoolkitapp for feedback, bug reports, privacy questions, or responsible tool suggestions.",
  alternates: { canonical: canonicalUrl("/contact") },
  robots: indexRobots,
  openGraph: {
    title: "Contact freetoolkitapp",
    description: "Reach the freetoolkitapp founder for feedback, bugs, or tool ideas.",
    url: canonicalUrl("/contact"),
    type: "website"
  }
};

const contactFaqs = [
  {
    question: "How fast will I hear back?",
    answer: "freetoolkitapp is operated by one person. I read every message and usually reply within a few business days, though busy weeks may take longer."
  },
  {
    question: "What should I include in a bug report?",
    answer: "Your browser name and version, device type (phone or desktop), the tool URL, what you clicked, and the exact error text if one appeared. Screenshots help."
  },
  {
    question: "Can I email sensitive documents?",
    answer: "Please do not. Describe the issue in words instead of attaching confidential PDFs, IDs, or passwords. Many tools process files locally in your browser."
  },
  {
    question: "Do you build custom tools on request?",
    answer: "I welcome suggestions that fit the curated quality bar, but freetoolkitapp is not a custom development agency. Useful ideas may ship as public tools if they serve many users responsibly."
  },
  {
    question: "Partnership or advertising inquiries?",
    answer: `Email ${siteContactEmail} with a clear subject line. I do not sell email lists or guarantee placement.`
  }
];

export default function ContactPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "Contact", href: "/contact" }
  ]);

  return (
    <main className="min-h-screen bg-bg pt-[60px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="mx-auto max-w-2xl px-6 py-16">
        <SectionHeader
          eyebrow="Contact"
          title="Contact freetoolkitapp"
          subtitle={`We read every message. ${founder.name} operates the site directly — please avoid sending confidential documents or secrets by email.`}
          align="left"
        />
        <TrustCallout className="mt-6" />

        <div className="prose-site mt-12 rounded-2xl border border-border bg-bg2 p-6 sm:p-8">
          <div className="not-prose mb-8 rounded-2xl border border-border bg-bg3 p-6">
            <p className="text-[13px] text-text-2">Email us directly:</p>
            <a className="mt-2 block font-mono text-lg text-gold hover:brightness-110" href={`mailto:${siteContactEmail}`}>
              {siteContactEmail}
            </a>
          </div>
          <h2>Email</h2>
          <p>
            Write to{" "}
            <a className="font-bold text-indigo-400" href={`mailto:${siteContactEmail}`}>{siteContactEmail}</a>.
            Include your browser version, device type, and steps to reproduce if you are reporting a bug.
          </p>
          <p className="text-sm text-ink-muted">Typical response time: a few business days.</p>
          <p>
            You can also view the founder profile on{" "}
            <a className="font-bold text-indigo-400 hover:text-ink-primary" href={founder.linkedinUrl} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            .
          </p>

          <h2>What we can help with</h2>
          <ul>
            <li>Bug reports and broken tool behavior</li>
            <li>Guide corrections or unclear instructions</li>
            <li>Privacy and policy questions</li>
            <li>Responsible tool suggestions that fit our curated catalog</li>
          </ul>

          <h2>What we cannot help with</h2>
          <ul>
            <li>Legal, medical, or financial advice</li>
            <li>Recovering files you did not back up</li>
            <li>Account recovery (freetoolkitapp does not use accounts)</li>
            <li>Guaranteeing grades, rankings, or job outcomes from AI output</li>
          </ul>

          <h2>Before you attach files</h2>
          <p>
            Many freetoolkitapp utilities process files inside your browser. If you need help with a broken PDF, describe the symptom (error text, page count, encryption message) instead of attaching highly sensitive documents.
          </p>

          <h2>Common questions</h2>
          {contactFaqs.map((item) => (
            <div key={item.question} className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="!mt-0 text-base font-semibold text-ink-primary">{item.question}</h3>
              <p className="!mt-2 !text-sm">{item.answer}</p>
            </div>
          ))}

          <h2>AdSense and privacy inquiries</h2>
          <p>
            For questions about cookies, advertising partners (including Google AdSense), or data handling, email{" "}
            <a className="font-bold text-indigo-400" href={`mailto:${siteContactEmail}`}>{siteContactEmail}</a> with subject line <strong>Privacy</strong> or read the{" "}
            <Link href="/privacy-policy" className="font-bold text-indigo-400 hover:text-ink-primary">Privacy Policy</Link> first — it covers AI processing, analytics, and ad cookies in plain language.
          </p>

          <h2>Legal &amp; privacy</h2>
          <p>
            For policy questions, review the <Link href="/privacy-policy" className="font-bold text-indigo-400 hover:text-ink-primary">Privacy Policy</Link>,{" "}
            <Link href="/terms" className="font-bold text-indigo-400 hover:text-ink-primary">Terms of Use</Link>, and{" "}
            <Link href="/disclaimer" className="font-bold text-indigo-400 hover:text-ink-primary">Disclaimer</Link>. Learn more about how the site works on the{" "}
            <Link href="/about" className="font-bold text-indigo-400 hover:text-ink-primary">About page</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}

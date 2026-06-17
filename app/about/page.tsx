import type { Metadata } from "next";
import Link from "next/link";
import { FounderCard } from "@/components/FounderCard";
import { SectionHeader } from "@/components/SectionHeader";
import { TrustCallout } from "@/components/TrustCallout";
import { brandMission, curatedToolCount, founder, siteContactEmail, siteUpdates } from "@/data/site-trust";
import { buildBreadcrumbSchema, buildPersonSchema, buildWebPageSchema } from "@/lib/schema";
import { canonicalUrl, siteUrl } from "@/lib/utils";
import { indexRobots } from "@/lib/seo-robots";

export const metadata: Metadata = {
  title: "About freetoolkitapp",
  description:
    "freetoolkitapp is a founder-led productivity site by Kushal Gautam — curated browser tools for PDFs, images, AI drafting, SEO, developers, and calculators. Learn our mission, privacy stance, and editorial standards.",
  alternates: { canonical: canonicalUrl("/about") },
  robots: indexRobots,
  openGraph: {
    title: "About freetoolkitapp — Founder-led productivity toolkit",
    description: "Mission, editorial standards, and privacy-first approach for freetoolkitapp's curated browser tools and guides.",
    url: canonicalUrl("/about"),
    type: "website"
  }
};

export default function AboutPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", href: "/" },
    { name: "About", href: "/about" }
  ]);
  const pageSchema = buildWebPageSchema({
    name: "About freetoolkitapp",
    description: brandMission,
    href: "/about"
  });

  return (
    <main className="min-h-screen bg-bg pt-[60px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPersonSchema()) }} />
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <SectionHeader
          eyebrow="About"
          title="About freetoolkitapp"
          subtitle="freetoolkitapp is an independent productivity site built by Kushal Gautam — free browser tools and practical guides for PDFs, images, writing, SEO, and everyday work. No signup walls. No tool spam."
          align="left"
        />

        <FounderCard />
        <TrustCallout className="mt-6" />

        <div className="prose-site mt-10 rounded-2xl border border-border bg-bg2 p-5 sm:mt-12 sm:p-8">
          <h2>Why freetoolkitapp exists</h2>
          <p>
            I built freetoolkitapp after watching too many “free tool” sites optimize for ad clicks instead of outcomes — thin pages, duplicate copy, and utilities that barely work. I wanted the opposite: a small, curated catalog where every page explains what the tool does, when it fails, and how to verify results before you submit them anywhere important.
          </p>
          <p>
            I am {founder.name}, an independent builder who writes many of the guides, tests tools in real browsers (Chrome, Safari, Firefox on desktop and mobile), and ships fixes when behavior changes. This is not a faceless content farm — you can verify who operates the site on this page, on{" "}
            <a className="font-bold text-indigo-400 hover:text-ink-primary" href={founder.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>, and via email at{" "}
            <a className="break-all font-bold text-indigo-400" href={`mailto:${siteContactEmail}`}>{siteContactEmail}</a>.
          </p>

          <h2>Mission</h2>
          <p>{brandMission}</p>
          <p>
            Most utility sites optimize for ad clicks instead of outcomes. We optimize for task completion: clear headings, predictable controls, honest limitations, and long-form context when a topic deserves more than a textarea.
          </p>

          <h2>Our principles</h2>
          <ul>
            <li>
              <strong>Curated over cluttered</strong> — about {curatedToolCount} tools with real instructions, not hundreds of thin pages.
            </li>
            <li>
              <strong>Privacy-conscious</strong> — many PDF and image tools run locally in your browser; AI tools are labeled clearly.
            </li>
            <li>
              <strong>Human review</strong> — AI outputs are drafts. We do not promise grades, job offers, rankings, or legal results.
            </li>
            <li>
              <strong>No signup</strong> — open a tool, finish the job, leave. No account wall.
            </li>
          </ul>

          <h2>What we publish</h2>
          <p>
            The catalog spans{" "}
            <Link href="/pdf-image" className="font-bold text-indigo-400 hover:text-ink-primary">PDF &amp; image tools</Link>,{" "}
            <Link href="/ai-tools" className="font-bold text-indigo-400 hover:text-ink-primary">AI drafting assistants</Link>,{" "}
            <Link href="/calculators" className="font-bold text-indigo-400 hover:text-ink-primary">calculators</Link>,{" "}
            <Link href="/developer" className="font-bold text-indigo-400 hover:text-ink-primary">developer utilities</Link>,{" "}
            <Link href="/seo-tools" className="font-bold text-indigo-400 hover:text-ink-primary">SEO helpers</Link>, and more. Each tool page explains how to use the feature, when it works best, and what to double-check before you submit results to school or work.
          </p>
          <p>
            The <Link href="/blog" className="font-bold text-indigo-400 hover:text-ink-primary">blog</Link> hosts evergreen guides on PDF hygiene, image formats, privacy habits, and productivity workflows. Guides link back into tools so reading becomes doing.
          </p>

          <h2>Editorial standards</h2>
          <p>
            Guides and tool pages are written to be useful first — tested in real browsers, linked to related workflows, and updated when behavior changes. We avoid vague AI hype, fake outcome guarantees, and copy-paste filler. When a tool has limits (password-locked PDFs, scanned documents, model hallucinations), we say so upfront.
          </p>

          <h2>AI philosophy</h2>
          <p>
            AI-assisted pages disclose that outputs require human review. We do not promise perfect grades, guaranteed job offers, or legal compliance from generated text. Where models can hallucinate, we warn first. Academic integrity matters: follow your institution&apos;s policies and use assistants to learn — not to shortcut ethical rules.
          </p>

          <h2>Advertising and sustainability</h2>
          <p>
            freetoolkitapp may display third-party advertisements, including Google AdSense, to help cover hosting and development costs. Ads are shown only after essential page content loads — we do not prioritize ad density over useful instructions, FAQs, and guides. See our{" "}
            <Link href="/privacy-policy" className="font-bold text-indigo-400 hover:text-ink-primary">Privacy Policy</Link> for how advertising partners may use cookies.
          </p>

          <h2>What we won&apos;t do</h2>
          <ul>
            <li>Promise specific SEO rankings, grades, or job outcomes from tool output.</li>
            <li>Hide server uploads or AI processing behind vague &quot;free tool&quot; marketing.</li>
            <li>Publish hundreds of duplicate thin pages to inflate catalog size.</li>
          </ul>

          <h2>Recent improvements</h2>
          <ul>
            {siteUpdates.map((item) => (
              <li key={item.text}>
                <strong>{item.date}:</strong> {item.text}
              </li>
            ))}
          </ul>
          <p className="text-sm text-ink-muted">Last updated: May 24, 2026</p>

          <h2>Contact</h2>
          <p>
            Feedback keeps the platform accurate. If a tool behaves unexpectedly on your browser, or you want a responsible new utility, reach out via the{" "}
            <Link href="/contact" className="font-bold text-indigo-400 hover:text-ink-primary">contact page</Link> or email{" "}
            <a className="break-all font-bold text-indigo-400" href={`mailto:${siteContactEmail}`}>{siteContactEmail}</a>. {founder.name} reads messages even if replies are not instant.
          </p>

          <h2>Operator</h2>
          <p>
            freetoolkitapp is maintained by{" "}
            <a className="font-bold text-indigo-400 hover:text-ink-primary" href={founder.linkedinUrl} target="_blank" rel="noopener noreferrer">
              {founder.name}
            </a>
            . You can verify the live domain at{" "}
            <a className="break-all font-bold text-indigo-400" href={siteUrl}>{siteUrl.replace("https://", "")}</a> or view the founder profile on{" "}
            <a className="font-bold text-indigo-400 hover:text-ink-primary" href={founder.linkedinUrl} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}

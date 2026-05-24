import Link from "next/link";
import { founder, siteContactEmail } from "@/data/site-trust";
import { Card } from "@/components/ui";

export function FounderCard() {
  return (
    <Card className="mt-6 overflow-hidden p-0">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:p-8">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-surface-section text-2xl font-bold text-ink-primary"
          aria-hidden="true"
        >
          KG
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Founder-led</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink-primary">{founder.name}</h2>
          <p className="mt-1 text-sm font-medium text-ink-muted">{founder.role}</p>
          <p className="mt-4 text-sm leading-7 text-ink-secondary">
            I built freetoolkitapp because utility sites kept wasting my time — ads everywhere, broken tools, and pages that looked impressive but did not work. I wanted one calm place to merge a PDF, compress an image, or draft a resume before a deadline.
          </p>
          <p className="mt-3 text-sm leading-7 text-ink-secondary">
            Today I ship the site, write many of the guides, and test tools in Chrome and Safari before publishing. This is not a faceless directory — it is a product I maintain every week.
          </p>
          <p className="mt-4 text-sm text-ink-muted">
            Questions or bug reports:{" "}
            <a className="font-semibold text-indigo-400 hover:text-ink-primary" href={`mailto:${siteContactEmail}`}>
              {siteContactEmail}
            </a>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={founder.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pill-link inline-flex"
            >
              LinkedIn profile →
            </a>
            <Link href="/contact" className="pill-link inline-flex">
              Contact me →
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

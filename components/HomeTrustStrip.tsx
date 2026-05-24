import Link from "next/link";
import { founder, siteContactEmail } from "@/data/site-trust";

export function HomeTrustStrip() {
  return (
    <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-ink-muted lg:mx-0 lg:text-left">
      <span className="font-medium text-ink-secondary">Independent</span>
      <span aria-hidden="true"> · </span>
      Built by{" "}
      <a
        className="font-medium text-ink-secondary transition hover:text-indigo-400"
        href={founder.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {founder.name}
      </a>
      <span aria-hidden="true"> · </span>
      Browser-first file tools
      <span aria-hidden="true"> · </span>
      <Link href="/about" className="font-medium text-indigo-400 transition hover:text-ink-primary">
        About →
      </Link>
      <span aria-hidden="true"> · </span>
      <a className="font-medium text-indigo-400 transition hover:text-ink-primary" href={`mailto:${siteContactEmail}`}>
        {siteContactEmail}
      </a>
    </p>
  );
}

import Link from "next/link";
import { getTool, toolHref, topLevelCategories, topLevelCategoryRoutes } from "@/data/tools";
import { SiteLogo } from "@/components/SiteLogo";
import { founder, siteContactEmail } from "@/data/site-trust";
import { siteName } from "@/lib/utils";

const legalLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/disclaimer", label: "Disclaimer" }
];

const exploreLinks = [
  { href: "/blog", label: "Blog & guides" },
  { href: "/all-tools", label: "All tools" },
  { href: "/sitemap", label: "HTML sitemap" }
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.35fr)_repeat(4,minmax(0,1fr))] lg:px-8">
        <div>
          <SiteLogo />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted">
            Founder-led productivity toolkit — curated PDF, image, AI, SEO, developer, and calculator tools. Built for depth, speed, and privacy-conscious workflows.
          </p>
          <p className="mt-3 text-sm">
            <a className="font-medium text-indigo-400 transition hover:text-ink-primary" href={`mailto:${siteContactEmail}`}>
              {siteContactEmail}
            </a>
          </p>
          <p className="mt-2 text-sm">
            <a
              className="text-ink-muted transition hover:text-ink-secondary"
              href={founder.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {founder.name} on LinkedIn →
            </a>
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["No signup", "Browser-first", "Founder-led", "Privacy-conscious"].map((item) => (
              <span key={item} className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-ink-muted">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink-secondary">Trust &amp; legal</h3>
          <ul className="mt-4 grid gap-2 text-sm text-ink-muted">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-ink-secondary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink-secondary">Explore</h3>
          <ul className="mt-4 grid gap-2 text-sm text-ink-muted">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-ink-secondary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 text-sm font-semibold text-ink-secondary">Categories</h3>
          <ul className="mt-4 grid gap-2 text-sm text-ink-muted">
            {topLevelCategories.map((category) => (
              <li key={category}>
                <Link href={topLevelCategoryRoutes[category]} className="transition hover:text-ink-secondary">
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ink-secondary">Popular tools</h3>
          <ul className="mt-4 grid gap-2 text-sm text-ink-muted">
            {["merge-pdf", "compress-pdf", "image-compressor", "ai-resume-cover-letter", "grammar-fixer"].map((slug) => {
              const tool = getTool(slug);
              if (!tool) return null;
              return (
                <li key={slug}>
                  <Link href={toolHref(tool)} className="transition hover:text-ink-secondary">
                    {tool.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {siteName}. Operated by {founder.name}.</p>
          <p className="text-xs sm:max-w-lg sm:text-right">Independent productivity tools publisher · freetoolkitapp.com</p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { topLevelCategories, topLevelCategoryRoutes } from "@/data/tools";
import { founder } from "@/data/site-trust";

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

const tagPills = ["No signup", "Browser-first", "Founder-led", "Privacy-conscious"];

function FooterLogo() {
  return (
    <Link href="/" className="font-heading text-[17px] font-extrabold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold" aria-label="freetoolkitapp home">
      <span className="text-text">free</span>
      <span className="text-gold">toolkit</span>
      <span className="text-text">app</span>
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg2 pt-16 pb-8">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <FooterLogo />
          <p className="mt-3 max-w-[240px] text-[13px] leading-relaxed text-text-2">
            Founder-led productivity toolkit — curated PDF, image, AI, SEO, developer, and calculator tools.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {tagPills.map((item) => (
              <span key={item} className="rounded border border-border bg-bg3 px-2 py-1 text-[10px] font-semibold text-text-3">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-3">Trust &amp; legal</h3>
          <ul className="grid gap-2.5">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-[13px] text-text-2 transition hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-3">Explore</h3>
          <ul className="grid gap-2.5">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-[13px] text-text-2 transition hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-3">Categories</h3>
          <ul className="grid gap-2.5">
            {topLevelCategories.map((category) => (
              <li key={category}>
                <Link href={topLevelCategoryRoutes[category]} className="text-[13px] text-text-2 transition hover:text-gold">
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-6xl border-t border-border px-6 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-[12px] text-text-3">
          <p suppressHydrationWarning>© {new Date().getFullYear()} freetoolkitapp · Operated by {founder.name}</p>
          <a
            className="transition hover:text-gold"
            href={founder.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {founder.name} on LinkedIn →
          </a>
        </div>
      </div>
    </footer>
  );
}

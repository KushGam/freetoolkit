/**
 * Topical authority map — SEO silos, hub-spoke internal linking, and priority tiers.
 */

export type SiloNode = {
  id: string;
  label: string;
  path: string;
  tier: "hub" | "tool" | "guide" | "trust";
  silo: "pdf-image" | "ai" | "seo" | "developer" | "calculators" | "trust";
  linksTo: string[];
};

export const topicalAuthorityMap: SiloNode[] = [
  { id: "home", label: "Homepage", path: "/", tier: "hub", silo: "pdf-image", linksTo: ["pdf-image", "ai-tools", "compress-pdf", "merge-pdf", "image-compressor", "ai-resume-cover-letter"] },
  { id: "pdf-image", label: "PDF & Image Hub", path: "/pdf-image", tier: "hub", silo: "pdf-image", linksTo: ["compress-pdf", "merge-pdf", "split-pdf", "image-compressor", "png-to-jpg", "blog/how-to-compress-pdf-files"] },
  { id: "compress-pdf", label: "Compress PDF", path: "/compress-pdf", tier: "tool", silo: "pdf-image", linksTo: ["merge-pdf", "split-pdf", "pdf-to-jpg", "blog/how-to-compress-pdf-files", "pdf-image"] },
  { id: "merge-pdf", label: "Merge PDF", path: "/merge-pdf", tier: "tool", silo: "pdf-image", linksTo: ["compress-pdf", "split-pdf", "word-to-pdf", "blog/how-to-merge-pdf-files-online"] },
  { id: "image-compressor", label: "Image Compressor", path: "/image-compressor", tier: "tool", silo: "pdf-image", linksTo: ["image-resizer", "webp-converter", "png-to-jpg", "blog/how-to-compress-images-without-losing-quality"] },
  { id: "ai-tools", label: "AI Tools Hub", path: "/ai-tools", tier: "hub", silo: "ai", linksTo: ["ai-resume-cover-letter", "resume-ats-checker", "ai-email-writer", "grammar-fixer", "ai-text-summarizer"] },
  { id: "ai-resume-cover-letter", label: "AI Resume Generator", path: "/ai-resume-cover-letter", tier: "tool", silo: "ai", linksTo: ["resume-ats-checker", "ai-linkedin-summary-generator", "grammar-fixer", "ai-email-writer"] },
  { id: "resume-ats-checker", label: "ATS Resume Checker", path: "/resume-ats-checker", tier: "tool", silo: "ai", linksTo: ["ai-resume-cover-letter", "ai-email-writer", "grammar-fixer"] },
  { id: "seo-tools", label: "SEO Tools Hub", path: "/seo-tools", tier: "hub", silo: "seo", linksTo: ["meta-tag-generator", "schema-markup-generator", "serp-preview", "sitemap-generator"] },
  { id: "developer", label: "Developer Hub", path: "/developer", tier: "hub", silo: "developer", linksTo: ["json-formatter", "jwt-decoder", "regex-tester", "base64-encoder-decoder"] },
  { id: "calculators", label: "Calculators Hub", path: "/calculators", tier: "hub", silo: "calculators", linksTo: ["bmi-calculator", "loan-emi-calculator", "percentage-calculator", "unit-converter"] },
  { id: "about", label: "About / E-E-A-T", path: "/about", tier: "trust", silo: "trust", linksTo: ["privacy-policy", "contact", "blog/privacy-friendly-online-tools-checklist"] }
];

/** Internal linking rules applied site-wide. */
export const internalLinkingRules = [
  "Every indexed tool links to 4 related tools (same silo first, then adjacent silo).",
  "Every major tool links to 1–3 blog guides via RelatedBlogPosts + inline section anchors.",
  "Hub pages feature top 6 tools + 4 blog posts from the matching blog cluster.",
  "Homepage surfaces 2 tools per silo + trust pages in footer.",
  "Breadcrumbs: Home → Category hub → Tool (never skip hub for indexed tools).",
  "No links from indexed pages to removed/noindex tools or gaming content.",
  "Use descriptive anchor text ('Compress PDF before merge') not ('click here')."
];

export function getSiloForPath(path: string): SiloNode["silo"] | null {
  const node = topicalAuthorityMap.find((n) => n.path === path);
  return node?.silo ?? null;
}

export function getInternalLinksFor(path: string): SiloNode[] {
  const node = topicalAuthorityMap.find((n) => n.path === path);
  if (!node) return [];
  return node.linksTo
    .map((id) => topicalAuthorityMap.find((n) => n.id === id || n.path === id || n.path === `/${id}` || n.path === `/blog/${id}`))
    .filter((n): n is SiloNode => Boolean(n));
}

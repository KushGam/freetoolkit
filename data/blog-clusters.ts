/**
 * Blog cluster strategy — topical authority silos linking hubs, tools, and guides.
 * Each cluster = one pillar topic + supporting posts + tool spokes.
 */

export type BlogCluster = {
  id: string;
  pillarTitle: string;
  pillarSlug: string | null;
  hubPath: string;
  targetKeywords: string[];
  toolSlugs: string[];
  blogSlugs: string[];
  status: "live" | "planned";
  wordTarget: string;
};

export const blogClusters: BlogCluster[] = [
  {
    id: "pdf-mastery",
    pillarTitle: "Complete Guide to PDF Workflows Online",
    pillarSlug: null,
    hubPath: "/pdf-image",
    targetKeywords: ["compress pdf online", "merge pdf free", "split pdf", "pdf to word"],
    toolSlugs: ["compress-pdf", "merge-pdf", "split-pdf", "pdf-to-word", "word-to-pdf", "pdf-to-jpg", "edit-pdf", "add-text-to-pdf"],
    blogSlugs: ["how-to-compress-pdf-files", "how-to-merge-pdf-files-online", "pdf-to-word-conversion-quality"],
    status: "live",
    wordTarget: "Pillar: 3000+ words; spokes: 1500–2500 each"
  },
  {
    id: "image-optimization",
    pillarTitle: "Web Image Optimization Handbook",
    pillarSlug: "png-vs-jpg-vs-webp",
    hubPath: "/pdf-image",
    targetKeywords: ["compress image online", "png to jpg", "webp converter", "resize image"],
    toolSlugs: ["image-compressor", "png-to-jpg", "webp-converter", "image-resizer", "heic-to-jpg"],
    blogSlugs: ["how-to-compress-images-without-losing-quality", "png-vs-jpg-vs-webp", "how-to-resize-images-online"],
    status: "live",
    wordTarget: "Pillar exists; expand with Core Web Vitals + Shopify upload guide"
  },
  {
    id: "ai-career",
    pillarTitle: "AI-Powered Job Search Playbook",
    pillarSlug: null,
    hubPath: "/ai-tools",
    targetKeywords: ["ai resume generator", "ats resume checker", "ai cover letter", "ai interview prep"],
    toolSlugs: ["ai-resume-cover-letter", "resume-ats-checker", "ai-interview-answer-generator", "ai-linkedin-summary-generator", "ai-email-writer"],
    blogSlugs: ["best-free-student-tools"],
    status: "planned",
    wordTarget: "New pillar + 4 spokes: ATS myths, ethical AI, LinkedIn alignment, follow-up emails"
  },
  {
    id: "ai-writing",
    pillarTitle: "AI Writing for Work & Study",
    pillarSlug: null,
    hubPath: "/ai-tools",
    targetKeywords: ["ai summarizer", "paraphrasing tool", "grammar fixer", "ai essay writer"],
    toolSlugs: ["ai-text-summarizer", "paraphrasing-tool", "grammar-fixer", "content-rewriter", "ai-essay-writer", "ai-study-notes"],
    blogSlugs: ["word-counter-guide"],
    status: "planned",
    wordTarget: "Pillar on human-in-the-loop AI + integrity policies"
  },
  {
    id: "seo-publishing",
    pillarTitle: "Technical SEO Toolkit Guide",
    pillarSlug: null,
    hubPath: "/seo-tools",
    targetKeywords: ["meta tag generator", "schema markup", "robots txt", "sitemap generator"],
    toolSlugs: ["meta-tag-generator", "open-graph-generator", "schema-markup-generator", "robots-txt-generator", "sitemap-generator", "serp-preview"],
    blogSlugs: ["best-free-online-tools-for-daily-work"],
    status: "planned",
    wordTarget: "Pillar: launch checklist for new sites"
  },
  {
    id: "developer-productivity",
    pillarTitle: "Browser Dev Utilities Reference",
    pillarSlug: null,
    hubPath: "/developer",
    targetKeywords: ["json formatter", "jwt decoder", "regex tester", "base64 encode"],
    toolSlugs: ["json-formatter", "json-validator", "jwt-decoder", "regex-tester", "base64-encoder-decoder", "url-encoder-decoder"],
    blogSlugs: ["browser-tools-vs-desktop-software"],
    status: "live",
    wordTarget: "Expand with JWT debugging + API workflow post"
  },
  {
    id: "privacy-trust",
    pillarTitle: "Privacy-Friendly Online Tools",
    pillarSlug: "privacy-friendly-online-tools-checklist",
    hubPath: "/about",
    targetKeywords: ["browser based tools privacy", "local processing pdf", "online tool security"],
    toolSlugs: ["compress-pdf", "merge-pdf", "image-compressor"],
    blogSlugs: ["privacy-friendly-online-tools-checklist", "browser-tools-vs-desktop-software"],
    status: "live",
    wordTarget: "Trust pillar for E-E-A-T and AdSense depth"
  }
];

export function getBlogClusterForTool(slug: string) {
  return blogClusters.filter((c) => c.toolSlugs.includes(slug));
}

export function getBlogClusterForPost(postSlug: string) {
  return blogClusters.filter((c) => c.blogSlugs.includes(postSlug));
}

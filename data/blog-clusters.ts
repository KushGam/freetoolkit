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
    pillarSlug: "complete-pdf-workflow-guide",
    hubPath: "/pdf-image",
    targetKeywords: ["compress pdf online", "merge pdf free", "split pdf", "pdf to word"],
    toolSlugs: ["compress-pdf", "merge-pdf", "split-pdf", "pdf-to-word", "word-to-pdf", "pdf-to-jpg", "edit-pdf", "add-text-to-pdf"],
    blogSlugs: ["complete-pdf-workflow-guide", "how-to-compress-pdf-files", "how-to-merge-pdf-files-online", "pdf-to-word-conversion-quality"],
    status: "live",
    wordTarget: "Pillar live (~2400 words); spokes 1500–2500 each"
  },
  {
    id: "image-optimization",
    pillarTitle: "Web Image Optimization Handbook",
    pillarSlug: "complete-image-optimization-guide",
    hubPath: "/pdf-image",
    targetKeywords: ["compress image online", "png to jpg", "webp converter", "resize image"],
    toolSlugs: ["image-compressor", "png-to-jpg", "webp-converter", "image-resizer", "heic-to-jpg"],
    blogSlugs: ["complete-image-optimization-guide", "how-to-compress-images-without-losing-quality", "png-vs-jpg-vs-webp", "how-to-resize-images-online"],
    status: "live",
    wordTarget: "Pillar live (~2300 words); format + resize spokes linked"
  },
  {
    id: "ai-career",
    pillarTitle: "AI-Powered Job Search Playbook",
    pillarSlug: "resume-ats-complete-guide",
    hubPath: "/ai-tools",
    targetKeywords: ["ai resume generator", "ats resume checker", "ai cover letter", "resume keywords"],
    toolSlugs: ["ai-resume-cover-letter", "resume-ats-checker", "ai-linkedin-summary-generator", "ai-email-writer"],
    blogSlugs: ["resume-ats-complete-guide", "best-free-student-tools", "word-counter-guide"],
    status: "live",
    wordTarget: "Pillar live (~2200 words); ethical AI + ATS formatting"
  },
  {
    id: "ai-writing",
    pillarTitle: "AI Writing for Work & Study",
    pillarSlug: null,
    hubPath: "/ai-tools",
    targetKeywords: ["ai summarizer", "paraphrasing tool", "grammar fixer", "ai essay writer"],
    toolSlugs: ["ai-text-summarizer", "paraphrasing-tool", "grammar-fixer", "ai-study-notes"],
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

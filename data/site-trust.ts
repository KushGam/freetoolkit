import type { Tool } from "@/data/tools";

export const siteContactEmail = "hello@freetoolkitapp.com";

export const founder = {
  name: "Kushal Gautam",
  role: "Founder & operator",
  email: siteContactEmail,
  linkedinUrl: "https://www.linkedin.com/in/kushal-gautam-9257b316a/",
  bio: "Independent builder who ships freetoolkitapp, writes many of the guides, and tests tools in real browsers before publishing."
} as const;

export const brandMission =
  "freetoolkitapp helps people finish real work — compress a PDF, fix a resume, generate meta tags — with fast browser tools, clear instructions, and no account required.";

export const curatedToolCount = 57;

export type PrivacyTier = "local" | "ai" | "hybrid" | "client";

export const privacyTierMeta: Record<
  PrivacyTier,
  { label: string; shortLabel: string; description: string; badgeClass: string }
> = {
  local: {
    label: "Runs in your browser",
    shortLabel: "Browser-local",
    description: "Files are processed on your device where supported — not uploaded to our servers by this tool.",
    badgeClass: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
  },
  ai: {
    label: "AI-assisted — review output",
    shortLabel: "AI-assisted",
    description: "Text you enter may be sent to an AI provider to generate a response. Review before submitting to school, work, or legal contexts.",
    badgeClass: "border-indigo-400/25 bg-indigo-500/10 text-indigo-300"
  },
  hybrid: {
    label: "Upload or AI processing",
    shortLabel: "Server-assisted",
    description: "This tool may upload files or send inputs to our servers or AI providers. Use only content you are allowed to share.",
    badgeClass: "border-amber-500/25 bg-amber-500/10 text-amber-300"
  },
  client: {
    label: "Runs in your browser",
    shortLabel: "Browser-only",
    description: "Calculations and formatting happen locally in your browser. No account required.",
    badgeClass: "border-sky-500/25 bg-sky-500/10 text-sky-300"
  }
};

/** Slugs that call server or AI APIs even when category is not AI Tools. */
const hybridToolSlugs = new Set([
  "pdf-to-word",
  "ocr-pdf",
  "pdf-to-excel",
  "image-to-word",
  "ai-image-to-word",
  "invoice-generator"
]);

const aiToolSlugs = new Set([
  "ai-resume-cover-letter",
  "resume-ats-checker",
  "ai-email-writer",
  "ai-text-summarizer",
  "paraphrasing-tool",
  "keyword-extractor",
  "grammar-fixer",
  "title-generator",
  "bio-generator",
  "faq-generator",
  "text-to-bullet-points",
  "ai-study-notes",
  "explain-simple",
  "chat-reply-generator",
  "content-rewriter",
  "productivity-assistant",
  "ai-caption-generator",
  "ai-youtube-title-generator",
  "ai-hashtag-generator",
  "ai-humanizer",
  "ai-homework-helper",
  "ai-essay-writer",
  "ai-prompt-generator",
  "ai-interview-answer-generator",
  "ai-linkedin-summary-generator",
  "ai-business-name-generator",
  "ai-notes-cleaner",
  "transcript-summarizer"
]);

export function getToolPrivacyTier(tool: Pick<Tool, "slug" | "category">): PrivacyTier {
  if (hybridToolSlugs.has(tool.slug)) return "hybrid";
  if (aiToolSlugs.has(tool.slug) || tool.category === "AI Tools") return "ai";
  if (tool.category === "PDF Tools" || tool.category === "Image Tools") return "local";
  return "client";
}

export const siteUpdates = [
  { date: "May 2026", text: "Curated catalog to 57 high-depth tools; removed policy-risk and duplicate pages from search index." },
  { date: "May 2026", text: "Premium dark UI refresh for readability across tool, blog, and legal pages." }
] as const;

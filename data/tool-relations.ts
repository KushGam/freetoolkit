import type { ToolCategory, TopLevelCategory } from "@/data/tools";
import { INDEXED_TOOL_SLUGS, isToolIndexedForSearch } from "./indexing-policy";

export type ContentClusterId =
  | "pdf-document-workflows"
  | "image-optimization"
  | "student-success"
  | "ai-writing-productivity"
  | "calculator-utilities"
  | "text-cleanup"
  | "developer-utilities"
  | "security-basics"
  | "seo-publishing"
  | "social-media-publishing"
  | "gaming-utilities";

export type ContentCluster = {
  id: ContentClusterId;
  name: string;
  description: string;
  priority: number;
  categories: ToolCategory[];
  topLevelCategories: TopLevelCategory[];
  toolSlugs: string[];
  blogSlugs: string[];
};

export const contentClusters: ContentCluster[] = [
  {
    id: "pdf-document-workflows",
    name: "PDF document workflows",
    description: "Compression, merging, splitting, conversion, page cleanup, and upload-ready PDF preparation.",
    priority: 1,
    categories: ["PDF Tools"],
    topLevelCategories: ["PDF & Image"],
    toolSlugs: ["compress-pdf", "merge-pdf", "split-pdf", "extract-pdf-pages", "rotate-pdf", "pdf-to-word", "word-to-pdf", "image-to-pdf", "add-text-to-pdf", "pdf-to-jpg", "edit-pdf"],
    blogSlugs: ["complete-pdf-workflow-guide", "how-to-compress-pdf-files", "how-to-merge-pdf-files-online", "best-free-online-tools-for-daily-work", "pdf-to-word-conversion-quality", "how-to-compress-pdf-for-email"]
  },
  {
    id: "image-optimization",
    name: "Image optimization and conversion",
    description: "Image compression, resizing, format conversion, color checks, metadata, and web-ready asset preparation.",
    priority: 2,
    categories: ["Image Tools"],
    topLevelCategories: ["PDF & Image"],
    toolSlugs: ["image-compressor", "image-resizer", "png-to-jpg", "jpg-to-png", "webp-converter", "image-cropper", "image-rotator", "image-watermark", "image-grayscale", "heic-to-jpg", "svg-to-png", "png-to-webp", "webp-to-png", "passport-photo-maker", "image-to-pdf"],
    blogSlugs: ["complete-image-optimization-guide", "how-to-compress-images-without-losing-quality", "png-vs-jpg-vs-webp", "how-to-resize-images-online", "best-free-online-tools-for-daily-work", "heic-to-jpg-converter-guide", "image-format-converter-guide"]
  },
  {
    id: "student-success",
    name: "Student success and planning",
    description: "Grades, GPA, attendance, study focus, writing checks, and career preparation for students.",
    priority: 3,
    categories: ["Student Tools"],
    topLevelCategories: ["AI Tools"],
    toolSlugs: ["ai-study-notes", "ai-resume-cover-letter", "resume-ats-checker", "grammar-fixer", "pomodoro-timer", "typing-speed-test", "gpa-calculator"],
    blogSlugs: ["resume-ats-complete-guide", "best-free-student-tools", "how-to-calculate-gpa", "word-counter-guide", "how-to-pass-ats-resume-screening", "how-to-write-linkedin-summary", "free-tools-students-india", "pomodoro-technique-study-guide", "typing-speed-improvement-guide", "word-count-guide-essays-social-media"]
  },
  {
    id: "ai-writing-productivity",
    name: "AI writing and productivity",
    description: "Summaries, rewriting, email drafts, captions, hashtags, titles, bios, FAQs, and structured writing support.",
    priority: 4,
    categories: ["AI Tools"],
    topLevelCategories: ["AI Tools"],
    toolSlugs: ["ai-text-summarizer", "paraphrasing-tool", "grammar-fixer", "ai-email-writer", "ai-study-notes", "ai-resume-cover-letter", "resume-ats-checker", "ai-linkedin-summary-generator"],
    blogSlugs: ["resume-ats-complete-guide", "best-free-student-tools", "word-counter-guide", "best-free-online-tools-for-daily-work", "how-to-write-linkedin-summary", "word-count-guide-essays-social-media", "how-to-create-invoice-freelancer"]
  },
  {
    id: "calculator-utilities",
    name: "Everyday calculators",
    description: "Age, units, percentages, discounts, BMI, interest, EMI, time zones, and practical daily calculations.",
    priority: 5,
    categories: ["Calculator Tools"],
    topLevelCategories: ["Calculators"],
    toolSlugs: ["age-calculator", "unit-converter", "percentage-calculator", "discount-calculator", "bmi-calculator", "loan-emi-calculator", "interest-calculator", "scientific-calculator"],
    blogSlugs: ["best-free-online-tools-for-daily-work", "best-free-student-tools", "home-loan-emi-calculator-india", "bmi-calculator-india-guide", "how-to-calculate-gpa"]
  },
  {
    id: "developer-utilities",
    name: "Developer utilities",
    description: "JSON formatting, URL encoding, UUID generation, Base64 conversion, QR codes, and technical cleanup tasks.",
    priority: 7,
    categories: ["Developer Tools"],
    topLevelCategories: ["Developer"],
    toolSlugs: ["json-formatter", "url-encoder-decoder", "base64-encoder-decoder", "regex-tester", "jwt-decoder", "sql-formatter", "json-validator", "curl-to-fetch", "qr-code-generator"],
    blogSlugs: ["best-free-online-tools-for-daily-work", "password-generator-guide", "browser-tools-vs-desktop-software", "qr-code-generator-guide", "json-formatter-developer-guide"]
  },
  {
    id: "seo-publishing",
    name: "SEO publishing utilities",
    description: "Metadata, Open Graph, robots.txt, sitemaps, SERP previews, keyword density, slugs, and schema markup.",
    priority: 9,
    categories: ["SEO Tools"],
    topLevelCategories: ["SEO Tools"],
    toolSlugs: ["meta-tag-generator", "open-graph-generator", "robots-txt-generator", "sitemap-generator", "serp-preview", "keyword-density-checker", "slug-generator", "schema-markup-generator"],
    blogSlugs: ["best-free-online-tools-for-daily-work", "word-counter-guide", "meta-tags-seo-guide"]
  }
];

export const relatedBlogsByTool: Partial<Record<string, string[]>> = {
  "compress-pdf": ["how-to-compress-pdf-for-email", "complete-pdf-workflow-guide", "how-to-compress-pdf-files"],
  "merge-pdf": ["complete-pdf-workflow-guide", "how-to-merge-pdf-files-online", "how-to-compress-pdf-files"],
  "split-pdf": ["complete-pdf-workflow-guide", "how-to-compress-pdf-files", "how-to-merge-pdf-files-online"],
  "image-compressor": ["complete-image-optimization-guide", "how-to-compress-images-without-losing-quality", "png-vs-jpg-vs-webp"],
  "image-resizer": ["complete-image-optimization-guide", "how-to-resize-images-online", "how-to-compress-images-without-losing-quality"],
  "ai-resume-cover-letter": ["resume-ats-complete-guide", "best-free-student-tools", "word-counter-guide"],
  "resume-ats-checker": ["how-to-pass-ats-resume-screening", "resume-ats-complete-guide", "best-free-student-tools"],
  "png-to-jpg": ["complete-image-optimization-guide", "png-vs-jpg-vs-webp", "how-to-compress-images-without-losing-quality"],
  "jpg-to-png": ["complete-image-optimization-guide", "png-vs-jpg-vs-webp", "how-to-compress-images-without-losing-quality"],
  "webp-converter": ["complete-image-optimization-guide", "png-vs-jpg-vs-webp", "how-to-compress-images-without-losing-quality"],
  "pdf-to-word": ["pdf-to-word-conversion-quality", "how-to-merge-pdf-files-online", "how-to-compress-pdf-files"],
  "gpa-calculator": ["how-to-calculate-gpa", "best-free-student-tools"],
  "cgpa-calculator": ["how-to-calculate-gpa", "best-free-student-tools"],
  "word-counter": ["word-counter-guide", "best-free-student-tools"],
  "password-generator": ["password-generator-guide", "privacy-friendly-online-tools-checklist", "best-free-online-tools-for-daily-work"],
  "palworld-breeding-calculator": ["palworld-breeding-guide"],
  "minecraft-crafting-calculator": ["palworld-breeding-guide", "best-free-online-tools-for-daily-work"],
  "pokemon-type-calculator": ["palworld-breeding-guide", "best-free-online-tools-for-daily-work"],
  "qr-code-generator": ["qr-code-generator-guide", "best-free-online-tools-for-daily-work", "browser-tools-vs-desktop-software"],
  "age-calculator": ["best-free-online-tools-for-daily-work", "best-free-student-tools"],
  "percentage-calculator": ["best-free-online-tools-for-daily-work", "best-free-student-tools"],
  "image-to-pdf": ["how-to-merge-pdf-files-online", "how-to-compress-pdf-files", "best-free-online-tools-for-daily-work"],
  "word-to-pdf": ["how-to-merge-pdf-files-online", "pdf-to-word-conversion-quality", "word-counter-guide"],
  "heic-to-jpg": ["heic-to-jpg-converter-guide", "how-to-compress-images-without-losing-quality", "png-vs-jpg-vs-webp"],
  "svg-to-png": ["how-to-compress-images-without-losing-quality", "png-vs-jpg-vs-webp", "how-to-resize-images-online"],
  "png-to-webp": ["png-vs-jpg-vs-webp", "how-to-compress-images-without-losing-quality", "how-to-resize-images-online"],
  "webp-to-png": ["png-vs-jpg-vs-webp", "how-to-compress-images-without-losing-quality", "best-free-online-tools-for-daily-work"],
  "background-remover": ["how-to-compress-images-without-losing-quality", "how-to-resize-images-online", "best-free-online-tools-for-daily-work"],
  "passport-photo-maker": ["how-to-resize-images-online", "how-to-compress-images-without-losing-quality", "best-free-online-tools-for-daily-work"],
  "blur-image": ["privacy-friendly-online-tools-checklist", "how-to-compress-images-without-losing-quality", "best-free-online-tools-for-daily-work"],
  "favicon-generator": ["best-free-online-tools-for-daily-work", "word-counter-guide", "how-to-resize-images-online"],
  "youtube-thumbnail-downloader": ["best-free-online-tools-for-daily-work", "word-counter-guide", "how-to-compress-images-without-losing-quality"],
  "image-upscaler": ["how-to-resize-images-online", "how-to-compress-images-without-losing-quality", "png-vs-jpg-vs-webp"],
  "photo-collage-maker": ["how-to-compress-images-without-losing-quality", "how-to-resize-images-online", "best-free-online-tools-for-daily-work"],
  "pdf-to-excel": ["pdf-to-word-conversion-quality", "how-to-compress-pdf-files", "how-to-merge-pdf-files-online"],
  "edit-pdf": ["how-to-merge-pdf-files-online", "how-to-compress-pdf-files", "pdf-to-word-conversion-quality"],
  "excel-to-pdf": ["how-to-merge-pdf-files-online", "how-to-compress-pdf-files", "best-free-online-tools-for-daily-work"],
  "ocr-pdf": ["pdf-to-word-conversion-quality", "how-to-compress-pdf-files", "how-to-merge-pdf-files-online"],
  "pdf-watermark": ["how-to-merge-pdf-files-online", "pdf-to-word-conversion-quality", "best-free-online-tools-for-daily-work"],
  "pdf-metadata-editor": ["pdf-to-word-conversion-quality", "how-to-merge-pdf-files-online", "best-free-online-tools-for-daily-work"],
  "compare-pdf-files": ["pdf-to-word-conversion-quality", "how-to-merge-pdf-files-online", "how-to-compress-pdf-files"],
  "pdf-reader-online": ["how-to-merge-pdf-files-online", "how-to-compress-pdf-files", "best-free-online-tools-for-daily-work"],
  "pdf-password-protector": ["password-generator-guide", "privacy-friendly-online-tools-checklist", "how-to-merge-pdf-files-online"],
  "loan-emi-calculator": ["home-loan-emi-calculator-india", "best-free-online-tools-for-daily-work", "how-to-calculate-gpa"],
  "bmi-calculator": ["bmi-calculator-india-guide", "home-loan-emi-calculator-india", "best-free-online-tools-for-daily-work"],
  "json-formatter": ["json-formatter-developer-guide", "best-free-online-tools-for-daily-work", "password-generator-guide"],
  "pomodoro-timer": ["pomodoro-technique-study-guide", "best-free-student-tools", "free-tools-students-india"],
  "typing-speed-test": ["typing-speed-improvement-guide", "pomodoro-technique-study-guide", "best-free-student-tools"],
  "invoice-generator": ["how-to-create-invoice-freelancer", "best-free-online-tools-for-daily-work", "word-counter-guide"],
  "meta-tag-generator": ["meta-tags-seo-guide", "best-free-online-tools-for-daily-work", "word-counter-guide"],
  "ai-linkedin-summary-generator": ["how-to-write-linkedin-summary", "how-to-pass-ats-resume-screening", "best-free-student-tools"]
};

export const relatedToolsByTool: Partial<Record<string, string[]>> = {
  "compress-pdf": ["merge-pdf", "split-pdf", "pdf-to-jpg", "extract-pdf-pages"],
  "merge-pdf": ["split-pdf", "compress-pdf", "word-to-pdf", "pdf-to-word"],
  "split-pdf": ["extract-pdf-pages", "merge-pdf", "compress-pdf", "rotate-pdf"],
  "image-compressor": ["image-resizer", "webp-converter", "png-to-jpg", "png-to-webp"],
  "image-resizer": ["image-compressor", "image-cropper", "webp-converter", "image-to-pdf"],
  "png-to-jpg": ["jpg-to-png", "webp-converter", "image-compressor", "image-resizer"],
  "jpg-to-png": ["png-to-jpg", "webp-converter", "image-compressor", "png-to-webp"],
  "webp-converter": ["image-compressor", "image-resizer", "png-to-jpg", "jpg-to-png"],
  "gpa-calculator": ["cgpa-calculator", "final-grade-calculator", "weighted-grade-calculator", "grade-percentage-calculator"],
  "word-counter": ["case-converter", "remove-extra-spaces", "text-formatter", "grammar-fixer"],
  "password-generator": ["uuid-generator", "base64-encoder-decoder", "json-formatter"],
  "heic-to-jpg": ["png-to-jpg", "webp-converter", "image-compressor", "jpg-to-png"],
  "meta-tag-generator": ["open-graph-generator", "serp-preview", "sitemap-generator", "robots-txt-generator"],
  "open-graph-generator": ["meta-tag-generator", "serp-preview", "sitemap-generator", "robots-txt-generator"],
  "hashtag-counter": ["word-counter", "serp-preview", "case-converter", "text-formatter"],
  "palworld-breeding-calculator": ["percentage-calculator", "scientific-calculator", "unit-converter", "word-counter"],
  "valorant-sensitivity-converter": ["palworld-breeding-calculator", "percentage-calculator", "unit-converter", "word-counter"],
  "minecraft-crafting-calculator": ["palworld-breeding-calculator", "percentage-calculator", "scientific-calculator", "word-counter"],
  "pokemon-type-calculator": ["palworld-breeding-calculator", "percentage-calculator", "unit-converter", "word-counter"],
  "qr-code-generator": ["url-encoder-decoder", "uuid-generator", "json-formatter", "base64-encoder-decoder"],
  "age-calculator": ["unit-converter", "percentage-calculator", "bmi-calculator", "interest-calculator"],
  "percentage-calculator": ["discount-calculator", "loan-emi-calculator", "bmi-calculator", "unit-converter"],
  "image-to-pdf": ["merge-pdf", "compress-pdf", "image-compressor", "rotate-pdf"],
  "word-to-pdf": ["merge-pdf", "add-text-to-pdf", "split-pdf", "pdf-to-word"],
  "svg-to-png": ["png-to-jpg", "webp-converter", "image-resizer", "png-to-webp"],
  "png-to-webp": ["webp-to-png", "webp-converter", "image-compressor", "jpg-to-png"],
  "webp-to-png": ["png-to-webp", "png-to-jpg", "image-compressor", "jpg-to-png"],
  "background-remover": ["passport-photo-maker", "image-watermark", "image-resizer", "image-compressor"],
  "passport-photo-maker": ["image-resizer", "background-remover", "image-compressor", "image-cropper"],
  "blur-image": ["background-remover", "image-watermark", "image-compressor", "png-to-jpg"],
  "favicon-generator": ["svg-to-png", "image-resizer", "png-to-webp", "meta-tag-generator"],
  "youtube-thumbnail-downloader": ["image-compressor", "image-resizer", "serp-preview", "word-counter"],
  "image-upscaler": ["image-resizer", "image-compressor", "png-to-jpg", "jpg-to-png"],
  "photo-collage-maker": ["image-to-pdf", "image-resizer", "image-compressor", "image-cropper"],
  "pdf-to-excel": ["ocr-pdf", "split-pdf", "excel-to-pdf", "compress-pdf"],
  "edit-pdf": ["merge-pdf", "split-pdf", "rotate-pdf", "compress-pdf"],
  "excel-to-pdf": ["word-to-pdf", "merge-pdf", "compress-pdf", "split-pdf"],
  "ocr-pdf": ["pdf-to-word", "split-pdf", "compress-pdf", "merge-pdf"],
  "pdf-watermark": ["pdf-password-protector", "edit-pdf", "merge-pdf", "compare-pdf-files"],
  "pdf-metadata-editor": ["pdf-reader-online", "pdf-watermark", "compress-pdf", "merge-pdf"],
  "compare-pdf-files": ["edit-pdf", "split-pdf", "merge-pdf", "pdf-reader-online"],
  "pdf-reader-online": ["edit-pdf", "compare-pdf-files", "rotate-pdf", "split-pdf"],
  "pdf-password-protector": ["pdf-watermark", "password-generator", "merge-pdf", "compress-pdf"]
};

export function getClustersForTool(toolSlug: string) {
  return contentClusters.filter((cluster) => cluster.toolSlugs.includes(toolSlug));
}

export function getClustersForCategory(category: ToolCategory | TopLevelCategory) {
  const exactCategoryMatches = contentClusters.filter((cluster) => cluster.categories.includes(category as ToolCategory));
  if (exactCategoryMatches.length) return exactCategoryMatches;
  return contentClusters.filter((cluster) => cluster.topLevelCategories.includes(category as TopLevelCategory));
}

export function getBlogSlugsForTool(toolSlug: string, limit = 3) {
  const explicit = relatedBlogsByTool[toolSlug] ?? [];
  const clustered = getClustersForTool(toolSlug).flatMap((cluster) => cluster.blogSlugs);
  return unique([...explicit, ...clustered]).slice(0, limit);
}

export function getRelatedToolSlugs(toolSlug: string, limit = 4) {
  const ok = (s: string) => isToolIndexedForSearch(s);
  const explicit = (relatedToolsByTool[toolSlug] ?? []).filter(ok);
  const clustered = getClustersForTool(toolSlug)
    .sort((a, b) => a.priority - b.priority)
    .flatMap((cluster) => cluster.toolSlugs)
    .filter((slug) => slug !== toolSlug && ok(slug));
  const ordered = unique([...explicit, ...clustered]);
  if (ordered.length >= limit) return ordered.slice(0, limit);
  for (const s of INDEXED_TOOL_SLUGS) {
    if (ordered.length >= limit) break;
    if (s === toolSlug || ordered.includes(s)) continue;
    if (!ok(s)) continue;
    ordered.push(s);
  }
  return ordered.slice(0, limit);
}

export function getBlogSlugsForCategory(category: ToolCategory | TopLevelCategory, limit = 4) {
  return unique(
    getClustersForCategory(category)
      .sort((a, b) => a.priority - b.priority)
      .flatMap((cluster) => cluster.blogSlugs)
  ).slice(0, limit);
}

export function getRelatedBlogSlugsForBlog(blogSlug: string, limit = 3) {
  const clusters = contentClusters.filter((cluster) => cluster.blogSlugs.includes(blogSlug));
  const related = clusters.flatMap((cluster) => cluster.blogSlugs).filter((slug) => slug !== blogSlug);
  return unique(related).slice(0, limit);
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

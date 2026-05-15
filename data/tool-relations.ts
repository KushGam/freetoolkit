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
    toolSlugs: ["compress-pdf", "merge-pdf", "split-pdf", "extract-pdf-pages", "rotate-pdf", "pdf-to-word", "word-to-pdf", "image-to-pdf", "add-text-to-pdf", "pdf-to-jpg", "pdf-unlock", "pdf-to-excel", "excel-to-pdf", "ocr-pdf", "pdf-watermark", "pdf-password-protector", "pdf-metadata-editor", "pdf-reader-online", "compare-pdf-files"],
    blogSlugs: ["how-to-compress-pdf-files", "how-to-merge-pdf-files-online", "best-free-online-tools-for-daily-work", "pdf-to-word-conversion-quality"]
  },
  {
    id: "image-optimization",
    name: "Image optimization and conversion",
    description: "Image compression, resizing, format conversion, color checks, metadata, and web-ready asset preparation.",
    priority: 2,
    categories: ["Image Tools"],
    topLevelCategories: ["PDF & Image"],
    toolSlugs: ["image-compressor", "image-resizer", "png-to-jpg", "jpg-to-png", "webp-converter", "image-cropper", "image-to-base64", "image-rotator", "image-converter", "image-watermark", "image-metadata", "image-color-picker", "image-dpi-checker", "image-grayscale", "image-to-word", "ai-image-to-word", "heic-to-jpg", "svg-to-png", "png-to-webp", "webp-to-png", "background-remover", "passport-photo-maker", "blur-image", "favicon-generator", "photo-collage-maker", "youtube-thumbnail-downloader", "image-upscaler"],
    blogSlugs: ["how-to-compress-images-without-losing-quality", "png-vs-jpg-vs-webp", "how-to-resize-images-online", "best-free-online-tools-for-daily-work"]
  },
  {
    id: "student-success",
    name: "Student success and planning",
    description: "Grades, GPA, attendance, study focus, writing checks, and career preparation for students.",
    priority: 3,
    categories: ["Student Tools"],
    topLevelCategories: ["Student", "AI Tools"],
    toolSlugs: ["gpa-calculator", "cgpa-calculator", "grade-percentage-calculator", "final-grade-calculator", "weighted-grade-calculator", "attendance-calculator", "study-timer", "gpa-to-percentage-converter", "ai-study-notes", "explain-simple", "ai-resume-cover-letter", "resume-ats-checker", "word-counter", "grammar-fixer", "apa-citation-generator", "mla-citation-generator", "harvard-reference-generator", "pomodoro-timer", "flashcard-generator", "assignment-planner", "study-schedule-generator", "scientific-calculator", "ai-homework-helper", "ai-essay-writer"],
    blogSlugs: ["best-free-student-tools", "how-to-calculate-gpa", "word-counter-guide"]
  },
  {
    id: "ai-writing-productivity",
    name: "AI writing and productivity",
    description: "Summaries, rewriting, email drafts, captions, hashtags, titles, bios, FAQs, and structured writing support.",
    priority: 4,
    categories: ["AI Tools"],
    topLevelCategories: ["AI Tools"],
    toolSlugs: ["ai-text-summarizer", "paraphrasing-tool", "keyword-extractor", "grammar-fixer", "title-generator", "bio-generator", "faq-generator", "text-to-bullet-points", "ai-email-writer", "chat-reply-generator", "content-rewriter", "productivity-assistant", "ai-caption-generator", "ai-youtube-title-generator", "ai-hashtag-generator", "ai-study-notes", "explain-simple", "ai-resume-cover-letter", "resume-ats-checker", "ai-humanizer", "ai-homework-helper", "ai-essay-writer", "ai-prompt-generator", "ai-interview-answer-generator", "ai-linkedin-summary-generator", "ai-business-name-generator", "ai-notes-cleaner"],
    blogSlugs: ["best-free-student-tools", "word-counter-guide", "best-free-online-tools-for-daily-work"]
  },
  {
    id: "calculator-utilities",
    name: "Everyday calculators",
    description: "Age, units, percentages, discounts, BMI, interest, EMI, time zones, and practical daily calculations.",
    priority: 5,
    categories: ["Calculator Tools"],
    topLevelCategories: ["Everyday"],
    toolSlugs: ["age-calculator", "unit-converter", "percentage-calculator", "discount-calculator", "bmi-calculator", "loan-emi-calculator", "interest-calculator", "time-zone-converter", "shift-hours-calculator"],
    blogSlugs: ["best-free-online-tools-for-daily-work", "best-free-student-tools"]
  },
  {
    id: "text-cleanup",
    name: "Text cleanup and formatting",
    description: "Word counting, case conversion, whitespace cleanup, duplicate removal, sorting, and text formatting.",
    priority: 6,
    categories: ["Text Tools"],
    topLevelCategories: ["Everyday"],
    toolSlugs: ["word-counter", "case-converter", "text-formatter", "duplicate-line-remover", "random-text-generator", "text-sorter", "remove-extra-spaces"],
    blogSlugs: ["word-counter-guide", "best-free-online-tools-for-daily-work", "best-free-student-tools"]
  },
  {
    id: "developer-utilities",
    name: "Developer utilities",
    description: "JSON formatting, URL encoding, UUID generation, Base64 conversion, QR codes, and technical cleanup tasks.",
    priority: 7,
    categories: ["Developer Tools"],
    topLevelCategories: ["Developer", "Everyday"],
    toolSlugs: ["json-formatter", "url-encoder-decoder", "uuid-generator", "base64-encoder-decoder", "qr-code-generator", "regex-tester", "jwt-decoder", "sql-formatter", "html-formatter", "css-formatter", "markdown-previewer", "json-validator", "curl-to-fetch"],
    blogSlugs: ["best-free-online-tools-for-daily-work", "password-generator-guide", "browser-tools-vs-desktop-software"]
  },
  {
    id: "security-basics",
    name: "Security basics",
    description: "Strong random passwords, safe credential habits, identifiers, and everyday security support.",
    priority: 8,
    categories: ["Security Tools"],
    topLevelCategories: ["Everyday"],
    toolSlugs: ["password-generator", "uuid-generator", "base64-encoder-decoder", "password-strength-checker", "sha256-generator", "md5-generator", "random-token-generator", "file-checksum"],
    blogSlugs: ["password-generator-guide", "best-free-online-tools-for-daily-work", "privacy-friendly-online-tools-checklist"]
  },
  {
    id: "seo-publishing",
    name: "SEO publishing utilities",
    description: "Metadata, Open Graph, robots.txt, sitemaps, SERP previews, keyword density, slugs, and schema markup.",
    priority: 9,
    categories: ["SEO Tools"],
    topLevelCategories: ["Developer", "Everyday"],
    toolSlugs: ["meta-tag-generator", "open-graph-generator", "robots-txt-generator", "sitemap-generator", "serp-preview", "keyword-density-checker", "slug-generator", "schema-markup-generator"],
    blogSlugs: ["best-free-online-tools-for-daily-work", "word-counter-guide"]
  },
  {
    id: "social-media-publishing",
    name: "Social media publishing utilities",
    description: "Caption formatting, hashtags, tags, character counts, short bios, and creator publishing helpers.",
    priority: 10,
    categories: ["Social Media Tools", "AI Tools"],
    topLevelCategories: ["AI Tools", "Everyday"],
    toolSlugs: ["hashtag-counter", "instagram-caption-formatter", "tiktok-caption-generator", "youtube-tags-extractor", "twitter-character-counter", "social-bio-generator", "ai-caption-generator", "ai-youtube-title-generator", "ai-hashtag-generator"],
    blogSlugs: ["best-free-online-tools-for-daily-work", "word-counter-guide"]
  },
  {
    id: "gaming-utilities",
    name: "Gaming utilities",
    description: "Practical browser helpers for breeding outcomes, sensitivity conversion, crafting requirements, and type matchup checks.",
    priority: 11,
    categories: ["Gaming Tools"],
    topLevelCategories: ["Social Media Tools", "Everyday"],
    toolSlugs: ["palworld-breeding-calculator", "valorant-sensitivity-converter", "minecraft-crafting-calculator", "pokemon-type-calculator"],
    blogSlugs: ["palworld-breeding-guide"]
  }
];

export const relatedBlogsByTool: Partial<Record<string, string[]>> = {
  "compress-pdf": ["how-to-compress-pdf-files", "how-to-merge-pdf-files-online"],
  "merge-pdf": ["how-to-merge-pdf-files-online", "how-to-compress-pdf-files"],
  "split-pdf": ["how-to-compress-pdf-files", "how-to-merge-pdf-files-online"],
  "image-compressor": ["how-to-compress-images-without-losing-quality", "png-vs-jpg-vs-webp"],
  "image-resizer": ["how-to-resize-images-online", "how-to-compress-images-without-losing-quality"],
  "png-to-jpg": ["png-vs-jpg-vs-webp", "how-to-compress-images-without-losing-quality"],
  "jpg-to-png": ["png-vs-jpg-vs-webp", "how-to-compress-images-without-losing-quality"],
  "webp-converter": ["png-vs-jpg-vs-webp", "how-to-compress-images-without-losing-quality"],
  "pdf-to-word": ["pdf-to-word-conversion-quality", "how-to-merge-pdf-files-online", "how-to-compress-pdf-files"],
  "gpa-calculator": ["how-to-calculate-gpa", "best-free-student-tools"],
  "cgpa-calculator": ["how-to-calculate-gpa", "best-free-student-tools"],
  "word-counter": ["word-counter-guide", "best-free-student-tools"],
  "password-generator": ["password-generator-guide", "privacy-friendly-online-tools-checklist", "best-free-online-tools-for-daily-work"],
  "palworld-breeding-calculator": ["palworld-breeding-guide"],
  "minecraft-crafting-calculator": ["palworld-breeding-guide", "best-free-online-tools-for-daily-work"],
  "pokemon-type-calculator": ["palworld-breeding-guide", "best-free-online-tools-for-daily-work"],
  "qr-code-generator": ["best-free-online-tools-for-daily-work", "browser-tools-vs-desktop-software", "privacy-friendly-online-tools-checklist"],
  "age-calculator": ["best-free-online-tools-for-daily-work", "best-free-student-tools"],
  "percentage-calculator": ["best-free-online-tools-for-daily-work", "best-free-student-tools"],
  "image-to-pdf": ["how-to-merge-pdf-files-online", "how-to-compress-pdf-files", "best-free-online-tools-for-daily-work"],
  "word-to-pdf": ["how-to-merge-pdf-files-online", "pdf-to-word-conversion-quality", "word-counter-guide"],
  "heic-to-jpg": ["how-to-compress-images-without-losing-quality", "png-vs-jpg-vs-webp", "how-to-resize-images-online"],
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
  "pdf-password-protector": ["password-generator-guide", "privacy-friendly-online-tools-checklist", "how-to-merge-pdf-files-online"]
};

export const relatedToolsByTool: Partial<Record<string, string[]>> = {
  "compress-pdf": ["merge-pdf", "split-pdf", "pdf-to-jpg", "extract-pdf-pages"],
  "merge-pdf": ["split-pdf", "compress-pdf", "word-to-pdf", "pdf-to-word"],
  "split-pdf": ["extract-pdf-pages", "merge-pdf", "compress-pdf", "rotate-pdf"],
  "image-compressor": ["image-resizer", "webp-converter", "png-to-jpg", "image-converter"],
  "image-resizer": ["image-compressor", "image-cropper", "webp-converter", "image-to-pdf"],
  "png-to-jpg": ["jpg-to-png", "webp-converter", "image-compressor", "image-resizer"],
  "jpg-to-png": ["png-to-jpg", "webp-converter", "image-compressor", "png-to-webp"],
  "webp-converter": ["image-compressor", "image-resizer", "png-to-jpg", "jpg-to-png"],
  "gpa-calculator": ["cgpa-calculator", "final-grade-calculator", "weighted-grade-calculator", "grade-percentage-calculator"],
  "word-counter": ["case-converter", "remove-extra-spaces", "text-formatter", "grammar-fixer"],
  "password-generator": ["uuid-generator", "base64-encoder-decoder", "json-formatter"],
  "heic-to-jpg": ["image-converter", "png-to-jpg", "webp-converter", "image-compressor"],
  "meta-tag-generator": ["open-graph-generator", "serp-preview", "sitemap-generator", "robots-txt-generator"],
  "open-graph-generator": ["meta-tag-generator", "serp-preview", "sitemap-generator", "robots-txt-generator"],
  "hashtag-counter": ["word-counter", "serp-preview", "case-converter", "text-formatter"],
  "palworld-breeding-calculator": ["percentage-calculator", "scientific-calculator", "unit-converter", "word-counter"],
  "valorant-sensitivity-converter": ["palworld-breeding-calculator", "percentage-calculator", "unit-converter", "word-counter"],
  "minecraft-crafting-calculator": ["palworld-breeding-calculator", "percentage-calculator", "scientific-calculator", "word-counter"],
  "pokemon-type-calculator": ["palworld-breeding-calculator", "percentage-calculator", "unit-converter", "word-counter"],
  "qr-code-generator": ["url-encoder-decoder", "uuid-generator", "json-formatter", "base64-encoder-decoder"],
  "age-calculator": ["unit-converter", "percentage-calculator", "assignment-planner", "bmi-calculator"],
  "percentage-calculator": ["discount-calculator", "grade-percentage-calculator", "gpa-calculator", "loan-emi-calculator"],
  "image-to-pdf": ["merge-pdf", "compress-pdf", "image-compressor", "rotate-pdf"],
  "word-to-pdf": ["word-counter", "merge-pdf", "add-text-to-pdf", "split-pdf"],
  "svg-to-png": ["png-to-jpg", "webp-converter", "favicon-generator", "image-resizer"],
  "png-to-webp": ["webp-to-png", "webp-converter", "image-compressor", "image-converter"],
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

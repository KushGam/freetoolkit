import type { Tool, ToolCategory } from "./tools";

type ExpandedToolInput = {
  slug: string;
  title: string;
  category: ToolCategory;
  description: string;
  action: string;
  audience: string;
  limitation?: string;
  howToUse?: string[];
  features?: string[];
};

const browserNote = "Runs in your browser where possible with no signup, no account dashboard, and no paid API required.";

function makeTool(input: ExpandedToolInput): Tool {
  const limitation = input.limitation ?? "Review the result before using it in a final document, website, application, or message.";
  return {
    slug: input.slug,
    title: input.title,
    category: input.category,
    badge: "New",
    description: input.description,
    intro: `Use ${input.title} online free to ${input.action}. This lightweight FreeToolKit page is designed for ${input.audience}, with clear controls, mobile-friendly layout, and no signup.`,
    metaTitle: `${input.title} Online Free`,
    metaDescription: `${input.description} Free browser-based tool with no signup, clean output, helpful FAQs, and related productivity tools.`,
    howToUse: input.howToUse ?? [
      "Open the tool and read the input requirements.",
      "Paste text, enter details, or upload a supported file.",
      "Choose any available options for the output you need.",
      "Generate or preview the result in your browser.",
      "Copy, download, or review the output before using it."
    ],
    features: input.features ?? [
      "Free to use with no signup required",
      "Built for fast browser-based workflows",
      "Mobile-friendly layout and readable output",
      "Helpful for repeat work, publishing, study, and productivity",
      browserNote
    ],
    faq: [
      { question: `Is ${input.title} free?`, answer: `Yes. ${input.title} is free to use on FreeToolKit and does not require signup.` },
      { question: "Does this tool need a backend upload?", answer: "The tool is designed to run in your browser where possible. Some advanced file formats depend on browser support and may show limitations clearly." },
      { question: "Can I use the result professionally?", answer: "Yes, but review the output first, especially for documents, SEO metadata, citations, security values, or social posts." },
      { question: "Does it work on mobile?", answer: "Yes. The page is built for phones, tablets, and desktop browsers." },
      { question: "What should I do if my file or input is complex?", answer: limitation }
    ],
    seo: [
      `${input.title} helps ${input.audience} ${input.action} without opening heavy desktop software or signing up for another account. The page is focused on a single practical job, so the workflow stays quick: enter your content, generate or preview the output, and review the result before copying or downloading it.`,
      `This tool fits into the larger FreeToolKit workflow for documents, images, AI writing, SEO, social media, development, student tasks, and security checks. Related tools are linked on the page so you can move from one step to the next without searching again. That makes it useful for everyday work as well as repeat publishing or study routines.`,
      `The interface is intentionally lightweight. It avoids unnecessary dashboards, account walls, and paid API requirements for normal use. Where browser support is limited, the page explains what is possible and what may require dedicated software or a server-side workflow.`,
      `${limitation} For best results, keep a copy of your original file or text, compare the output with your requirement, and use related FreeToolKit tools when the task needs another step.`,
      `FreeToolKit is building this category for long-term, evergreen workflows. ${input.title} is part of that broader toolkit, designed to be crawlable, useful, fast, and easy to understand for people arriving from search or internal links.`
    ]
  };
}

export const expandedTools: Tool[] = [
  makeTool({ slug: "heic-to-jpg", title: "HEIC to JPG Converter", category: "Image Tools", description: "Convert supported HEIC or HEIF photos to JPG when your browser can decode the file.", action: "prepare iPhone photos as JPG files for uploads, documents, and sharing", audience: "iPhone users, students, creators, and office workers", limitation: "HEIC decoding depends on browser support. If your browser cannot read the image, export the photo as JPG from your device first." }),
  makeTool({ slug: "svg-to-png", title: "SVG to PNG Converter", category: "Image Tools", description: "Convert SVG markup or SVG files into PNG images in your browser.", action: "turn SVG graphics into PNG files for websites, documents, and previews", audience: "designers, developers, bloggers, and marketers" }),
  makeTool({ slug: "png-to-webp", title: "PNG to WebP Converter", category: "Image Tools", description: "Convert PNG images to lightweight WebP files for modern web publishing.", action: "create WebP versions of PNG images for faster websites", audience: "site owners, bloggers, developers, and content teams" }),
  makeTool({ slug: "webp-to-png", title: "WebP to PNG Converter", category: "Image Tools", description: "Convert WebP images to PNG format for editors, documents, and platforms that need PNG.", action: "create PNG copies of WebP images for compatibility", audience: "students, designers, office workers, and web publishers" }),
  makeTool({ slug: "background-remover", title: "Background Remover", category: "Image Tools", description: "Preview image background-removal workflow and prepare files for transparent-background editing.", action: "prepare images for background cleanup workflows", audience: "creators, sellers, students, and marketers", limitation: "Automatic high-quality background removal usually needs AI processing. This browser-first version avoids fake results and guides you to prepare the right image." }),
  makeTool({ slug: "passport-photo-maker", title: "Passport Photo Maker", category: "Image Tools", description: "Crop and prepare a simple passport-style photo layout from an uploaded image.", action: "prepare passport-style photo crops and previews", audience: "students, travelers, job applicants, and office users", limitation: "Always check the official photo rules for your country, visa, school, or application before submitting." }),
  makeTool({ slug: "blur-image", title: "Blur Image Tool", category: "Image Tools", description: "Blur an uploaded image in your browser and download a softened copy.", action: "blur photos, screenshots, or backgrounds before sharing", audience: "creators, teachers, marketers, and privacy-conscious users" }),
  makeTool({ slug: "favicon-generator", title: "Favicon Generator", category: "Image Tools", description: "Create simple favicon-ready image outputs for websites and projects.", action: "prepare small website icon files from an image or initials", audience: "website owners, developers, students, and makers" }),
  makeTool({
    slug: "photo-collage-maker",
    title: "Photo Collage Maker",
    category: "Image Tools",
    description: "Plan a photo collage layout and export a simple text checklist before editing images in your preferred design app.",
    action: "plan collage ideas for posts, school, and preview workflows",
    audience: "students, creators, small businesses, and social media teams",
    limitation: "This page currently creates a collage plan, not a final merged image. Use your preferred editor to assemble the final collage.",
    howToUse: [
      "Open the tool and write your collage idea.",
      "Describe the number of photos, layout style, and preferred order.",
      "Add notes such as captions, spacing, and final usage (post, school, preview).",
      "Click Create collage plan to generate a structured checklist.",
      "Copy or download the plan and build the final collage in your preferred editor."
    ],
    features: [
      "Free collage planning tool with no signup required",
      "Generates a practical collage checklist in seconds",
      "Mobile-friendly interface for quick planning",
      "Useful for students, creators, and social teams",
      "No image upload required for this planning workflow"
    ]
  }),
  makeTool({ slug: "youtube-thumbnail-downloader", title: "YouTube Thumbnail Downloader", category: "Image Tools", description: "Extract public YouTube thumbnail image URLs from a video link.", action: "find thumbnail image links from public YouTube video URLs", audience: "creators, researchers, marketers, and editors", limitation: "Only download or reuse thumbnails when you have the rights or permission to do so." }),
  makeTool({ slug: "image-upscaler", title: "Image Upscaler", category: "Image Tools", description: "Preview image upscaling dimensions and prepare browser-resized copies.", action: "resize images upward for drafts and previews", audience: "creators, students, sellers, and content teams", limitation: "True AI upscaling requires model processing. Browser resizing can enlarge dimensions but cannot invent real detail." }),

  makeTool({ slug: "pdf-to-excel", title: "PDF to Excel Converter", category: "PDF Tools", description: "Prepare PDF table extraction workflows for spreadsheet use.", action: "review PDF-to-spreadsheet conversion options and prepare table extraction", audience: "analysts, students, accountants, and office workers", limitation: "Reliable PDF-to-Excel conversion depends on table structure and may require OCR for scanned PDFs." }),
  makeTool({ slug: "excel-to-pdf", title: "Excel to PDF Converter", category: "PDF Tools", description: "Create a simple PDF-style output from pasted spreadsheet rows or tables.", action: "turn spreadsheet-style text into a shareable PDF workflow", audience: "office workers, students, freelancers, and small teams" }),
  makeTool({ slug: "ocr-pdf", title: "OCR PDF Tool", category: "PDF Tools", description: "Prepare scanned PDF text extraction workflows with clear OCR limitations.", action: "understand and prepare OCR extraction from scanned PDFs", audience: "students, administrators, researchers, and document teams", limitation: "OCR quality depends on scan clarity, language, rotation, and image resolution." }),
  makeTool({ slug: "pdf-watermark", title: "PDF Watermark Tool", category: "PDF Tools", description: "Plan PDF watermark text and prepare documents for watermarking workflows.", action: "add or plan watermark text for PDF document workflows", audience: "freelancers, teachers, office workers, and document reviewers" }),
  makeTool({ slug: "pdf-password-protector", title: "PDF Password Protector", category: "PDF Tools", description: "Prepare secure PDF password-protection workflows with practical safety notes.", action: "understand PDF password protection before sharing documents", audience: "office workers, freelancers, students, and administrators", limitation: "Strong PDF encryption may require dedicated PDF software. Use strong unique passwords and share them separately." }),
  makeTool({ slug: "pdf-metadata-editor", title: "PDF Metadata Editor", category: "PDF Tools", description: "Inspect and plan PDF title, author, subject, and keyword metadata cleanup.", action: "review PDF metadata fields before publishing or sharing", audience: "publishers, students, administrators, and document teams" }),
  makeTool({ slug: "pdf-reader-online", title: "PDF Reader Online", category: "PDF Tools", description: "Open and inspect PDF file details in a browser-friendly workflow.", action: "review PDF file details and prepare documents for reading or sharing", audience: "students, readers, office workers, and researchers" }),
  makeTool({ slug: "compare-pdf-files", title: "Compare PDF Files", category: "PDF Tools", description: "Prepare side-by-side PDF comparison workflows and document review notes.", action: "compare two PDF versions and organize review notes", audience: "editors, students, legal assistants, and document reviewers", limitation: "Deep visual PDF comparison can require specialized rendering. This page focuses on a lightweight review workflow." }),

  makeTool({ slug: "ai-humanizer", title: "AI Humanizer", category: "AI Tools", description: "Rewrite AI-sounding text into clearer, more natural language for review.", action: "make stiff drafts sound more natural while preserving meaning", audience: "writers, students, marketers, and professionals" }),
  makeTool({ slug: "ai-homework-helper", title: "AI Homework Helper", category: "AI Tools", description: "Get study-friendly explanations and steps for homework questions.", action: "break homework prompts into understandable study guidance", audience: "students, tutors, and parents", limitation: "Use this as study help, not as a replacement for learning or your school's academic honesty rules." }),
  makeTool({ slug: "ai-essay-writer", title: "AI Essay Writer", category: "AI Tools", description: "Draft essay outlines, thesis ideas, and structured writing plans.", action: "plan essays with outlines, arguments, and revision notes", audience: "students, applicants, and writers", limitation: "Always follow your institution's rules and write in your own voice." }),
  makeTool({ slug: "ai-prompt-generator", title: "AI Prompt Generator", category: "AI Tools", description: "Create clear prompts for writing, coding, research, images, and productivity tasks.", action: "turn rough goals into better AI prompts", audience: "creators, students, developers, and teams" }),
  makeTool({ slug: "ai-interview-answer-generator", title: "AI Interview Answer Generator", category: "AI Tools", description: "Generate structured interview answer drafts from your real experience.", action: "prepare interview answer outlines and STAR-style responses", audience: "job seekers, students, and career changers" }),
  makeTool({ slug: "ai-linkedin-summary-generator", title: "AI LinkedIn Summary Generator", category: "AI Tools", description: "Draft a professional LinkedIn About section from your background and goals.", action: "create LinkedIn summary drafts for review", audience: "job seekers, freelancers, founders, and professionals" }),
  makeTool({ slug: "ai-business-name-generator", title: "AI Business Name Generator", category: "AI Tools", description: "Generate business name ideas from niche, audience, and tone.", action: "brainstorm business names and positioning ideas", audience: "founders, creators, freelancers, and small businesses" }),
  makeTool({ slug: "ai-notes-cleaner", title: "AI Notes Cleaner", category: "AI Tools", description: "Clean messy notes into organized summaries, action items, and sections.", action: "turn rough notes into readable organized output", audience: "students, professionals, teams, and meeting organizers" }),

  makeTool({ slug: "apa-citation-generator", title: "APA Citation Generator", category: "Student Tools", description: "Create simple APA-style citation drafts from source details.", action: "format source details into APA-style citation drafts", audience: "students, teachers, and researchers", limitation: "Citation rules can vary by source type and edition. Check important references against official guidance." }),
  makeTool({ slug: "mla-citation-generator", title: "MLA Citation Generator", category: "Student Tools", description: "Create simple MLA-style citation drafts from source details.", action: "format source details into MLA-style citation drafts", audience: "students, teachers, and researchers", limitation: "Review generated citations against your instructor's requirements." }),
  makeTool({ slug: "harvard-reference-generator", title: "Harvard Reference Generator", category: "Student Tools", description: "Create simple Harvard-style reference drafts from source details.", action: "format source details into Harvard-style reference drafts", audience: "students, teachers, and researchers", limitation: "Harvard style can vary by institution, so verify important references before submission." }),
  makeTool({ slug: "pomodoro-timer", title: "Pomodoro Timer", category: "Student Tools", description: "Use a simple focus timer for study sessions, breaks, and deep work.", action: "time focused study or work sessions with breaks", audience: "students, writers, developers, and remote workers" }),
  makeTool({ slug: "flashcard-generator", title: "Flashcard Generator", category: "Student Tools", description: "Turn notes into simple question-and-answer flashcards.", action: "create study flashcards from notes or key terms", audience: "students, tutors, and exam-prep learners" }),
  makeTool({ slug: "assignment-planner", title: "Assignment Planner", category: "Student Tools", description: "Break assignment deadlines into smaller planning steps.", action: "plan assignment tasks and deadline milestones", audience: "students, teachers, and academic support teams" }),
  makeTool({ slug: "study-schedule-generator", title: "Study Schedule Generator", category: "Student Tools", description: "Create a simple study schedule from subjects, dates, and available time.", action: "plan study blocks across subjects and deadlines", audience: "students, exam candidates, and tutors" }),
  makeTool({ slug: "scientific-calculator", title: "Scientific Calculator", category: "Student Tools", description: "Use common scientific calculator functions for school and quick math.", action: "calculate common scientific expressions and functions", audience: "students, teachers, and STEM learners", limitation: "Check critical calculations with your approved calculator or course system." }),

  makeTool({ slug: "regex-tester", title: "Regex Tester", category: "Developer Tools", description: "Test regular expressions against sample text in your browser.", action: "test regex patterns and matches quickly", audience: "developers, analysts, QA testers, and students" }),
  makeTool({ slug: "jwt-decoder", title: "JWT Decoder", category: "Developer Tools", description: "Decode JWT header and payload JSON without verifying the signature.", action: "inspect JWT payloads for debugging", audience: "developers, QA testers, and support engineers", limitation: "This tool decodes JWTs only. It does not verify signatures or prove that a token is valid." }),
  makeTool({ slug: "sql-formatter", title: "SQL Formatter", category: "Developer Tools", description: "Format SQL queries for easier reading and debugging.", action: "clean up SQL query formatting", audience: "developers, analysts, database users, and students" }),
  makeTool({ slug: "html-formatter", title: "HTML Formatter", category: "Developer Tools", description: "Format HTML snippets for readability.", action: "clean up HTML markup spacing", audience: "developers, students, writers, and support teams" }),
  makeTool({ slug: "css-formatter", title: "CSS Formatter", category: "Developer Tools", description: "Format CSS snippets into readable blocks.", action: "clean up CSS code formatting", audience: "developers, designers, students, and site owners" }),
  makeTool({ slug: "markdown-previewer", title: "Markdown Previewer", category: "Developer Tools", description: "Preview basic Markdown text as readable formatted output.", action: "preview Markdown notes, docs, and README snippets", audience: "developers, writers, students, and documentation teams" }),
  makeTool({ slug: "json-validator", title: "JSON Validator", category: "Developer Tools", description: "Validate JSON syntax and show friendly parser feedback.", action: "check whether JSON text is valid", audience: "developers, analysts, students, and QA testers" }),
  makeTool({ slug: "curl-to-fetch", title: "CURL to Fetch Converter", category: "Developer Tools", description: "Convert simple cURL commands into JavaScript fetch examples.", action: "turn basic cURL requests into fetch snippets", audience: "developers, API users, students, and support teams", limitation: "Complex shell quoting, files, and advanced cURL options may need manual adjustment." }),

  makeTool({ slug: "password-strength-checker", title: "Password Strength Checker", category: "Security Tools", description: "Check password length, variety, and common strength signals in your browser.", action: "review password strength signals before saving credentials", audience: "everyday users, students, developers, and small teams" }),
  makeTool({ slug: "sha256-generator", title: "SHA256 Generator", category: "Security Tools", description: "Generate a SHA-256 hash from text in your browser.", action: "create SHA-256 hashes for text values", audience: "developers, students, administrators, and security learners" }),
  makeTool({ slug: "md5-generator", title: "MD5 Generator", category: "Security Tools", description: "Generate MD5 hashes for non-security checks and legacy workflows.", action: "create MD5 hashes for checksums and legacy comparisons", audience: "developers, students, and support teams", limitation: "MD5 is not secure for passwords or cryptographic protection. Use SHA-256 for stronger hashing." }),
  makeTool({ slug: "random-token-generator", title: "Random Token Generator", category: "Security Tools", description: "Generate random tokens for testing, placeholders, and development workflows.", action: "create random token strings with configurable length", audience: "developers, testers, students, and technical teams" }),
  makeTool({ slug: "file-checksum", title: "File Checksum Tool", category: "Security Tools", description: "Calculate browser-based checksums for selected files where supported.", action: "create file checksum values for comparison", audience: "developers, administrators, students, and support teams" }),

  makeTool({ slug: "meta-tag-generator", title: "Meta Tag Generator", category: "SEO Tools", description: "Generate title, description, canonical, robots, and viewport meta tags.", action: "create clean SEO meta tags for a page", audience: "bloggers, developers, marketers, founders, and SEO beginners" }),
  makeTool({ slug: "open-graph-generator", title: "Open Graph Generator", category: "SEO Tools", description: "Generate Open Graph and Twitter Card tags for social sharing.", action: "create social preview metadata for web pages", audience: "developers, marketers, creators, and site owners" }),
  makeTool({ slug: "robots-txt-generator", title: "Robots.txt Generator", category: "SEO Tools", description: "Create a simple robots.txt file with sitemap and crawl rules.", action: "draft robots.txt rules for a website", audience: "site owners, developers, bloggers, and SEO teams" }),
  makeTool({ slug: "sitemap-generator", title: "Sitemap Generator", category: "SEO Tools", description: "Generate a simple XML sitemap from a list of URLs.", action: "create a basic XML sitemap for crawl discovery", audience: "site owners, developers, marketers, and SEO learners" }),
  makeTool({ slug: "serp-preview", title: "SERP Preview Tool", category: "SEO Tools", description: "Preview how a page title, URL, and meta description may appear in search.", action: "review search snippet title and description length", audience: "writers, marketers, bloggers, and SEO teams" }),
  makeTool({ slug: "keyword-density-checker", title: "Keyword Density Checker", category: "SEO Tools", description: "Check common word frequency and keyword density in pasted text.", action: "review repeated terms in page copy", audience: "writers, SEO teams, bloggers, and content editors" }),
  makeTool({ slug: "slug-generator", title: "Slug Generator", category: "SEO Tools", description: "Generate clean URL slugs from titles and phrases.", action: "turn titles into readable URL slugs", audience: "bloggers, developers, marketers, and content teams" }),
  makeTool({ slug: "schema-markup-generator", title: "Schema Markup Generator", category: "SEO Tools", description: "Generate simple JSON-LD schema markup for common page types.", action: "create starter structured data markup", audience: "developers, SEO teams, site owners, and bloggers" }),

  makeTool({ slug: "hashtag-counter", title: "Hashtag Counter", category: "Social Media Tools", description: "Count hashtags and review hashtag lists for social posts.", action: "count and clean hashtags before posting", audience: "creators, marketers, small businesses, and social media managers" }),
  makeTool({ slug: "instagram-caption-formatter", title: "Instagram Caption Formatter", category: "Social Media Tools", description: "Format Instagram captions with clean line breaks and spacing.", action: "prepare readable Instagram captions", audience: "creators, marketers, influencers, and small businesses" }),
  makeTool({ slug: "tiktok-caption-generator", title: "TikTok Caption Generator", category: "Social Media Tools", description: "Draft short TikTok caption ideas from a topic or video description.", action: "generate short caption ideas for TikTok posts", audience: "creators, brands, students, and social teams" }),
  makeTool({ slug: "youtube-tags-extractor", title: "YouTube Tags Extractor", category: "Social Media Tools", description: "Extract hashtag-style tags and comma-separated tags from pasted YouTube text.", action: "clean and extract tags from video descriptions or notes", audience: "YouTubers, editors, marketers, and researchers" }),
  makeTool({ slug: "twitter-character-counter", title: "Twitter Character Counter", category: "Social Media Tools", description: "Count characters for posts, bios, and short social updates.", action: "check character length before posting", audience: "creators, marketers, writers, and social media managers" }),
  makeTool({ slug: "social-bio-generator", title: "Social Bio Generator", category: "Social Media Tools", description: "Generate short social profile bio drafts from your role and interests.", action: "draft social media bios for profiles", audience: "creators, job seekers, founders, and freelancers" })
];

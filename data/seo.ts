import type { ToolCategory, TopLevelCategory } from "@/data/tools";

export type SeoFaq = {
  question: string;
  answer: string;
};

export type CategorySeo = {
  title: string;
  description: string;
  keywords: string[];
  intro: string;
  body: string[];
  faqs: SeoFaq[];
};

export const categorySeo: Record<ToolCategory, CategorySeo> = {
  "PDF Tools": {
    title: "Free PDF Tools Online | Merge, Split, Compress, Convert PDFs",
    description: "Use free PDF tools to merge, split, compress, rotate, extract, unlock, and convert PDF files online with no signup required.",
    keywords: ["PDF tools", "merge PDF", "compress PDF", "split PDF", "PDF converter"],
    intro: "Free PDF tools for everyday document cleanup, conversion, compression, and page organization. Use browser-based workflows for common PDF tasks without signup.",
    body: [
      "PDF workflows usually need speed and accuracy: combine several documents, extract only the pages you need, reduce file size, or prepare a file for upload. This category keeps those jobs together so you can move from one document task to the next without searching again.",
      "For best results, review downloaded PDFs before sharing them. Check page order, selected ranges, rotations, file size, and formatting so the final document matches your submission, archive, client, or school requirement.",
      "Many utilities here run locally in your browser when your file and browser support it—check each tool’s on-page notes when encryption, very large scans, or mixed portrait/landscape packets make processing heavier.",
      "When you need a text layer for search or copying, plan an OCR step; when you need legally defensible redaction, use tools built for redaction—not only opaque boxes in a general-purpose editor."
    ],
    faqs: [
      { question: "Are these PDF tools free?", answer: "Yes. FreeToolKit PDF tools are free to use and do not require signup." },
      { question: "Do PDF files upload to a server?", answer: "PDF tools are designed to process in your browser where possible. Some limitations depend on browser support, file size, and PDF restrictions." },
      { question: "Which PDF tool should I start with?", answer: "Use Merge PDF to combine files, Split PDF or Extract Pages to keep selected pages, and Compress PDF when the final file is too large." }
    ]
  },
  "Image Tools": {
    title: "Free Image Tools Online | Compress, Resize, Convert Images",
    description: "Compress, resize, crop, convert, watermark, and inspect images online with fast browser-based image tools.",
    keywords: ["image tools", "image compressor", "image resizer", "PNG to JPG", "WebP converter"],
    intro: "Free image tools for resizing, compression, conversion, color picking, and publishing workflows.",
    body: [
      "Image tools are useful when a file is too large, the dimensions are wrong, or a platform requests a specific format. Start by resizing oversized images, then compress or convert the final version if needed.",
      "Always preview important images before downloading. Photos, screenshots, logos, and transparent graphics can react differently to compression and format conversion.",
      "Pick the narrowest tool for the job: compressing a 4000px photo that will display at 600px wastes effort if you skip Image Resizer first; converting to WebP does not fix a hopelessly soft source capture.",
      "For identity or compliance photos, read the destination portal’s rules on dimensions, background color, and compression before exporting—automated tools still need your judgment on acceptance criteria."
    ],
    faqs: [
      { question: "Can I compress images without signup?", answer: "Yes. The image tools are free and do not require an account." },
      { question: "Which image format should I use?", answer: "Use JPG for most photos, PNG for transparency or sharp graphics, and WebP for modern web publishing where supported." },
      { question: "Should I resize or compress first?", answer: "If the dimensions are too large, resize first. Then compress the resized image for a smaller final file." }
    ]
  },
  "Student Tools": {
    title: "Free Student Tools Online | GPA, Grades, Attendance, Study",
    description: "Use free student tools for GPA, CGPA, grades, attendance, study timing, word count, and school productivity.",
    keywords: ["student tools", "GPA calculator", "attendance calculator", "study timer", "grade calculator"],
    intro: "Free student tools for planning grades, checking attendance, managing study sessions, counting words, and preparing school documents.",
    body: [
      "Student tools help with quick planning, but official academic rules still come from your school, instructor, or syllabus. Use these calculators and writing helpers to estimate outcomes and organize work before final submission.",
      "The best workflow is to enter realistic numbers, review the result, and use the output as a planning guide rather than an official record.",
      "Combine planners and timers with citation generators when you are writing papers—timeboxing research reduces the temptation to cite sources you have not actually read.",
      "If a result surprises you (for example a required final exam score that looks impossible), treat that as a signal to talk to your instructor early, not as a reason to cram silently for three weeks."
    ],
    faqs: [
      { question: "Are GPA results official?", answer: "No. GPA and grade calculators provide estimates. Your institution's grading policy and records are the official source." },
      { question: "Can I use these tools on mobile?", answer: "Yes. FreeToolKit pages are designed for phones, tablets, and desktops." },
      { question: "Do student tools require login?", answer: "No. Student tools work without signup." }
    ]
  },
  "AI Tools": {
    title: "Free AI Tools Online | Writing, Summaries, Resume, Study Help",
    description: "Use free AI tools for drafting emails, summaries, study notes, homework explanations, interview prep, LinkedIn text, resume support, and grammar fixes.",
    keywords: ["AI tools", "AI writer", "text summarizer", "resume AI", "study notes AI"],
    intro: "Free AI tools for writing support, summarizing, resumes, study notes, interview practice, and clear explanations—always with human review.",
    body: [
      "AI tools are best used as assistants for drafting, brainstorming, rewriting, and organizing. Review every generated result before using it in a final message, assignment, resume, or public post.",
      "FreeToolKit AI pages use a protected generation flow while preserving a simple, mobile-friendly interface.",
      "Outputs can be wrong, outdated, or poorly matched to your tone. Treat suggestions as editable drafts, keep personal data out of prompts when possible, and follow your school or employer policies on acceptable assistance.",
      "Pair AI drafts with the Word Counter, Grammar Fixer, and Resume ATS Checker when you are preparing something with strict length or formatting rules—automation is faster, but you remain responsible for the final text."
    ],
    faqs: [
      { question: "Should I review AI output?", answer: "Yes. Always check facts, tone, formatting, and personal details before using generated content." },
      { question: "Can AI tools write resumes?", answer: "They can help draft and improve resume content, but you should only use real experience and review the output carefully." },
      { question: "Are AI tools useful for students?", answer: "Yes, especially for study notes, simple explanations, summaries, and writing cleanup when used responsibly." }
    ]
  },
  "Text Tools": {
    title: "Free Text Tools Online | Format, Sort, Clean, Count Text",
    description: "Clean, format, sort, deduplicate, count, and generate text online with fast browser-based text tools.",
    keywords: ["text tools", "word counter", "case converter", "remove duplicate lines", "text formatter"],
    intro: "Free text tools for writers, students, developers, marketers, and teams who need quick cleanup and formatting actions.",
    body: [
      "Text tools are helpful when copied content contains inconsistent case, extra spaces, duplicate lines, or formatting that needs cleanup before publishing or sharing.",
      "Use these tools as a practical editing step: paste the text, choose the action, review the output, and copy the cleaned version into your document, spreadsheet, CMS, or message.",
      "Long pasted articles benefit from a quick pass in Remove Extra Spaces and Duplicate Line Remover before you run Word Counter—hidden whitespace inflates counts and confuses CMS validators.",
      "Nothing here replaces a human editor for nuance, voice, or factual accuracy; use automated cleanup to remove mechanical noise so you can focus on judgment calls."
    ],
    faqs: [
      { question: "Is pasted text saved?", answer: "No. Text tools run in the browser and do not require signup." },
      { question: "Can I use text tools for long content?", answer: "Yes, but always review important long-form content after automated cleanup." },
      { question: "Which text tool helps with word limits?", answer: "Use Word Counter to check word count and character count for essays, descriptions, bios, and applications." }
    ]
  },
  "Developer Tools": {
    title: "Free Developer Tools Online | JSON, URL, Base64, UUID, QR",
    description: "Use free developer utilities for JSON formatting, URL encoding, Base64 conversion, UUID generation, and QR code creation.",
    keywords: ["developer tools", "JSON formatter", "URL encoder", "Base64 decoder", "UUID generator"],
    intro: "Free developer tools for quick formatting, encoding, decoding, identifiers, QR codes, and technical troubleshooting.",
    body: [
      "Developer utilities are small but frequent tasks. Formatting JSON, decoding URLs, creating UUIDs, or converting Base64 text should be fast, readable, and easy to copy.",
      "These tools are designed for snippets, examples, testing, support messages, and lightweight debugging. They do not replace full validation, security review, or production testing.",
      "When pasting production config or customer payloads, prefer scrubbing secrets first—even local tools can end up in screen shares or support tickets by accident.",
      "Pair JSON Formatter with JSON Validator when you are unsure whether the issue is syntax or readability; pairing saves cycles compared to staring at one minified line."
    ],
    faqs: [
      { question: "Can I format JSON online?", answer: "Yes. JSON Formatter validates, formats, and minifies JSON in the browser." },
      { question: "Are UUIDs secrets?", answer: "No. UUIDs are identifiers, not passwords or authentication tokens." },
      { question: "When should I encode a URL?", answer: "Encode URL parts when spaces or special characters need to be safely included in a link or query string." }
    ]
  },
  "Calculator Tools": {
    title: "Free Calculator Tools Online | Age, Percentage, BMI, Unit, EMI",
    description: "Use free online calculators for age, percentages, discounts, BMI, units, loan EMI, grades, and everyday math in your browser.",
    keywords: ["calculator tools", "percentage calculator", "BMI calculator", "age calculator", "unit converter"],
    intro: "Free calculator tools for everyday math, dates, finance, health estimates, units, discounts, and grade planning.",
    body: [
      "Calculator tools give quick estimates for common daily questions. Enter your values, check the result, and use the explanation to understand what the number means.",
      "For financial, health, school, or official decisions, treat browser calculator results as helpful estimates and verify important numbers with the relevant professional or institution.",
      "This directory focuses on calculators we keep fully documented for search visitors: clear inputs, honest limits, and related tools (for example Unit Converter next to Percentage Calculator) so you can finish a workflow without guessing which page comes next.",
      "When a portal or syllabus uses its own rounding rules, your manual inputs still beat assumptions—use these tools to explore scenarios, then confirm anything contractual or medical with an authoritative source."
    ],
    faqs: [
      { question: "Are calculator results instant?", answer: "Yes. Calculator tools run directly in the browser." },
      { question: "Can I use these for official decisions?", answer: "Use them for estimates and planning. Verify important financial, academic, or health decisions with an official source." },
      { question: "Which calculators are highlighted here?", answer: "Age, percentage, discount, BMI, unit, loan EMI, grade, GPA, attendance, and related student math tools—each page explains what it can and cannot infer." }
    ]
  },
  "Security Tools": {
    title: "Free Security Tools Online | Strong Password Generator",
    description: "Generate strong random passwords online with length and character controls. Free browser-based security utility with no signup.",
    keywords: ["security tools", "password generator", "strong password", "random password"],
    intro: "Free security tools for safer everyday account workflows, starting with a strong random password generator.",
    body: [
      "Security tools should be direct and honest. A password generator helps create random values, but storing passwords safely and avoiding reuse are just as important.",
      "Use generated passwords with a trusted password manager, enable two-factor authentication where available, and avoid saving credentials in plain text.",
      "Generated passwords are only as strong as how you store them—screenshots in photo rolls and Slack messages are common weak links this page explicitly discourages.",
      "Use Password Strength Checker after you tweak a generated password by hand; humans often add predictable patterns that look random but are not."
    ],
    faqs: [
      { question: "Is the password generator free?", answer: "Yes. It is free and does not require signup." },
      { question: "Where should I store generated passwords?", answer: "Use a trusted password manager instead of plain text notes or screenshots." },
      { question: "Should I reuse generated passwords?", answer: "No. Use a unique password for each important account." }
    ]
  },
  "SEO Tools": {
    title: "Free SEO Tools Online | Meta Tags, Robots, Sitemap, SERP Preview",
    description: "Use free SEO tools for meta tags, Open Graph, robots.txt, sitemaps, and SERP previews—built for quick browser-based publishing checks.",
    keywords: ["SEO tools", "meta tag generator", "SERP preview", "robots.txt generator", "sitemap generator"],
    intro: "Free SEO tools for drafting metadata, previewing search snippets, and generating crawl helpers such as robots.txt and sitemap entries.",
    body: [
      "SEO work is easier when small technical tasks are quick to complete. This category focuses on metadata, social previews, robots rules, and sitemap drafts you can sanity-check before deployment.",
      "These tools are meant to support practical publishing workflows. Always review generated tags against your real page content, canonical URLs, and analytics goals before publishing.",
      "We do not claim that using these generators alone will improve rankings; they reduce mistakes (duplicate titles, truncated descriptions, conflicting robots lines) so your broader content strategy has a cleaner technical baseline.",
      "When you need richer structured data than a short form can cover, treat any JSON-LD or schema work as a collaboration between your CMS, developers, and Search Console—not a one-click substitute."
    ],
    faqs: [
      { question: "Are these SEO tools free?", answer: "Yes. The SEO tools are free to use and do not require signup." },
      { question: "Can generated SEO tags be used directly?", answer: "They can be a good starting point, but you should review titles, descriptions, canonical URLs, and any structured data before publishing." },
      { question: "Do these tools guarantee rankings?", answer: "No. They help with technical and content preparation, but rankings depend on quality, relevance, authority, and many search factors." }
    ]
  },
  "Social Media Tools": {
    title: "Free Social Media Tools Online | Captions, Hashtags, Bios, Counters",
    description: "Use free social media tools for captions, hashtags, bios, character counts, tag cleanup, and post formatting.",
    keywords: ["social media tools", "caption formatter", "hashtag counter", "Twitter character counter", "bio generator"],
    intro: "Free social media tools for preparing captions, hashtags, bios, tags, and short post copy before publishing.",
    body: [
      "Social media workflows often need small cleanup steps: count characters, format captions, extract tags, write a concise bio, or check whether a hashtag list is too long.",
      "Use these tools as publishing helpers. Review tone, accuracy, and platform rules before posting, especially for brand accounts or client work.",
      "Character limits change; when a network updates limits, re-check counts on a draft before scheduling—do not trust a months-old screenshot of “280 characters” lore alone.",
      "Pair social copy helpers with Word Counter and Case Converter when the same message must exist in long-form blog and short-form post variants with consistent terminology."
    ],
    faqs: [
      { question: "Are social media tools free?", answer: "Yes. They are free browser-based tools with no signup required." },
      { question: "Can these tools post to my social accounts?", answer: "No. They help prepare copy and formatting, but they do not connect to or post on your accounts." },
      { question: "Should I review generated captions or bios?", answer: "Yes. Always check generated social copy for accuracy, tone, and fit before publishing." }
    ]
  },
  "Gaming Tools": {
    title: "Free Gaming Tools Online | Breeding, Sensitivity, Crafting, Type Calculators",
    description: "Use free browser-based gaming tools for Palworld breeding results, Valorant sensitivity conversion, Minecraft crafting materials, and Pokemon type effectiveness.",
    keywords: ["gaming tools", "Palworld breeding calculator", "Valorant sensitivity converter", "Minecraft crafting calculator", "Pokemon type calculator"],
    intro: "Free gaming tools for repeat-use calculations and lookups across popular games. Built for quick browser use on desktop and mobile without signup.",
    body: [
      "Gaming tools are most useful when they solve small decisions fast: sensitivity conversion before a match, breeding checks before resource grinding, type effectiveness during team planning, or crafting breakdowns before farming.",
      "This category stays focused on practical utility workflows. Tools run in the browser with lightweight datasets, clear controls, and fast outputs so players can check values quickly and get back to gameplay.",
      "Game balance patches can change underlying data; treat outputs as community-model estimates unless the publisher provides an official API you are calling.",
      "Use Percentage Calculator or Unit Converter from the Everyday hub when you are theorycrafting resource or odds math that spills outside a single game’s built-in UI."
    ],
    faqs: [
      { question: "Do these gaming tools need login?", answer: "No. Gaming tools work in your browser with no signup required." },
      { question: "Are the results AI-generated?", answer: "No. These tools use browser-side formulas and local datasets for speed and consistency." },
      { question: "Can I use gaming tools on mobile?", answer: "Yes. The controls and outputs are built to work on mobile and desktop layouts." }
    ]
  }
};

export const topLevelCategorySeo: Record<TopLevelCategory, Pick<CategorySeo, "body" | "faqs">> = {
  Everyday: {
    body: [
      "Everyday tools collect small productivity jobs that come up during work, school, and personal tasks: count words, clean text, generate QR codes, calculate percentages, create passwords, or convert units.",
      "The category is built for repeat use. Search within the page, open the right utility, and keep moving without a login wall or complex dashboard.",
      "Most entries here are deterministic calculators and formatters—they run fully in your browser and give immediate results from the numbers and text you supply.",
      "When you graduate from a quick answer to a heavier workflow (for example building a full PDF packet), use the PDF & Image or Student hubs next so you are not trying to force one textarea to do everything."
    ],
    faqs: [
      { question: "What are everyday tools?", answer: "They are quick browser utilities for common tasks such as calculators, text cleanup, QR codes, and passwords." },
      { question: "Do everyday tools work on mobile?", answer: "Yes. The layouts and controls are built for mobile and desktop use." },
      { question: "Do I need an account?", answer: "No. These tools are free to use without signup." }
    ]
  },
  "AI Tools": {
    body: categorySeo["AI Tools"].body,
    faqs: categorySeo["AI Tools"].faqs
  },
  Student: {
    body: categorySeo["Student Tools"].body,
    faqs: categorySeo["Student Tools"].faqs
  },
  Developer: {
    body: categorySeo["Developer Tools"].body,
    faqs: categorySeo["Developer Tools"].faqs
  },
  "PDF & Image": {
    body: [
      "PDF and image tasks often happen together: prepare a scan, compress a photo, convert a document, or create a smaller upload-ready file. This category keeps those workflows close.",
      "Use related tools to move step by step: resize an image before converting, extract PDF pages before merging, or compress the final file before upload.",
      "Browser-first design matters when you are on a loaner laptop or a school Chromebook—many utilities avoid unnecessary uploads, but always read the banner on each tool when encryption or huge files change what is possible.",
      "If you are unsure whether a problem is pixels or pages, start with PDF Reader Online for a quick triage pass, then branch to Split PDF, Compress PDF, or Image Compressor based on what you see."
    ],
    faqs: [...categorySeo["PDF Tools"].faqs.slice(0, 2), ...categorySeo["Image Tools"].faqs.slice(0, 2)]
  },
  "SEO Tools": {
    body: categorySeo["SEO Tools"].body,
    faqs: categorySeo["SEO Tools"].faqs
  },
  "Social Media Tools": {
    body: categorySeo["Social Media Tools"].body,
    faqs: categorySeo["Social Media Tools"].faqs
  }
};

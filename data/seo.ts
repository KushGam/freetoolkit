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
      "For best results, review downloaded PDFs before sharing them. Check page order, selected ranges, rotations, file size, and formatting so the final document matches your submission, archive, client, or school requirement."
    ],
    faqs: [
      { question: "Are these PDF tools free?", answer: "Yes. FreeToolKit PDF tools are free to use and do not require signup." },
      { question: "Do PDF files upload to a server?", answer: "PDF tools are designed to process in your browser where possible. Some limitations depend on browser support, file size, and PDF restrictions." },
      { question: "Which PDF tool should I start with?", answer: "Use Merge PDF to combine files, Split PDF or Extract Pages to keep selected pages, and Compress PDF when the final file is too large." }
    ]
  },
  "Image Tools": {
    title: "Free Image Tools Online | Compress, Resize, Convert Images",
    description: "Compress, resize, crop, convert, watermark, rotate, and inspect images online with fast browser-based image tools.",
    keywords: ["image tools", "image compressor", "image resizer", "PNG to JPG", "WebP converter"],
    intro: "Free image tools for resizing, compression, conversion, color picking, metadata checks, and publishing workflows.",
    body: [
      "Image tools are useful when a file is too large, the dimensions are wrong, or a platform requests a specific format. Start by resizing oversized images, then compress or convert the final version if needed.",
      "Always preview important images before downloading. Photos, screenshots, logos, and transparent graphics can react differently to compression and format conversion."
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
      "The best workflow is to enter realistic numbers, review the result, and use the output as a planning guide rather than an official record."
    ],
    faqs: [
      { question: "Are GPA results official?", answer: "No. GPA and grade calculators provide estimates. Your institution's grading policy and records are the official source." },
      { question: "Can I use these tools on mobile?", answer: "Yes. FreeToolKit pages are designed for phones, tablets, and desktops." },
      { question: "Do student tools require login?", answer: "No. Student tools work without signup." }
    ]
  },
  "AI Tools": {
    title: "Free AI Tools Online | Writing, Resume, Summaries, Captions",
    description: "Use free AI tools for writing, resumes, summaries, captions, hashtags, emails, study notes, and productivity workflows.",
    keywords: ["AI tools", "AI writer", "text summarizer", "resume AI", "caption generator"],
    intro: "Free AI tools for writing support, summarizing, resumes, captions, hashtags, study notes, and daily productivity.",
    body: [
      "AI tools are best used as assistants for drafting, brainstorming, rewriting, and organizing. Review every generated result before using it in a final message, assignment, resume, or public post.",
      "FreeToolKit AI pages use protected server routes for generation, keeping API keys out of the browser while preserving a simple, mobile-friendly interface."
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
      "Use these tools as a practical editing step: paste the text, choose the action, review the output, and copy the cleaned version into your document, spreadsheet, CMS, or message."
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
      "These tools are designed for snippets, examples, testing, support messages, and lightweight debugging. They do not replace full validation, security review, or production testing."
    ],
    faqs: [
      { question: "Can I format JSON online?", answer: "Yes. JSON Formatter validates, formats, and minifies JSON in the browser." },
      { question: "Are UUIDs secrets?", answer: "No. UUIDs are identifiers, not passwords or authentication tokens." },
      { question: "When should I encode a URL?", answer: "Encode URL parts when spaces or special characters need to be safely included in a link or query string." }
    ]
  },
  "Calculator Tools": {
    title: "Free Calculator Tools Online | Age, Percentage, BMI, Unit, EMI",
    description: "Use free online calculators for age, percentages, discounts, BMI, units, interest, loan EMI, and time zones.",
    keywords: ["calculator tools", "percentage calculator", "BMI calculator", "age calculator", "unit converter"],
    intro: "Free calculator tools for everyday math, dates, finance, health estimates, units, discounts, and scheduling tasks.",
    body: [
      "Calculator tools give quick estimates for common daily questions. Enter your values, check the result, and use the explanation to understand what the number means.",
      "For financial, health, school, or official decisions, treat browser calculator results as helpful estimates and verify important numbers with the relevant professional or institution."
    ],
    faqs: [
      { question: "Are calculator results instant?", answer: "Yes. Calculator tools run directly in the browser." },
      { question: "Can I use these for official decisions?", answer: "Use them for estimates and planning. Verify important financial, academic, or health decisions with an official source." },
      { question: "Which everyday calculators are included?", answer: "FreeToolKit includes age, percentage, discount, BMI, unit, interest, EMI, and time zone tools." }
    ]
  },
  "Security Tools": {
    title: "Free Security Tools Online | Strong Password Generator",
    description: "Generate strong random passwords online with length and character controls. Free browser-based security utility with no signup.",
    keywords: ["security tools", "password generator", "strong password", "random password"],
    intro: "Free security tools for safer everyday account workflows, starting with a strong random password generator.",
    body: [
      "Security tools should be direct and honest. A password generator helps create random values, but storing passwords safely and avoiding reuse are just as important.",
      "Use generated passwords with a trusted password manager, enable two-factor authentication where available, and avoid saving credentials in plain text."
    ],
    faqs: [
      { question: "Is the password generator free?", answer: "Yes. It is free and does not require signup." },
      { question: "Where should I store generated passwords?", answer: "Use a trusted password manager instead of plain text notes or screenshots." },
      { question: "Should I reuse generated passwords?", answer: "No. Use a unique password for each important account." }
    ]
  }
};

export const topLevelCategorySeo: Record<TopLevelCategory, Pick<CategorySeo, "body" | "faqs">> = {
  Everyday: {
    body: [
      "Everyday tools collect small productivity jobs that come up during work, school, and personal tasks: count words, clean text, generate QR codes, calculate percentages, create passwords, or convert values.",
      "The category is built for repeat use. Search within the page, open the right utility, and keep moving without a login wall or complex dashboard."
    ],
    faqs: [
      { question: "What are everyday tools?", answer: "They are quick browser utilities for common tasks such as calculators, text cleanup, QR codes, and passwords." },
      { question: "Do everyday tools work on mobile?", answer: "Yes. The layouts and controls are built for mobile and desktop use." }
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
      "Use related tools to move step by step: resize an image before converting, extract PDF pages before merging, or compress the final file before upload."
    ],
    faqs: [...categorySeo["PDF Tools"].faqs.slice(0, 2), ...categorySeo["Image Tools"].faqs.slice(0, 2)]
  }
};

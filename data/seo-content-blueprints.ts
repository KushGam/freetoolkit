import type { ToolSeoBlueprint } from "./tool-content-types";

const sharedSchema: ToolSeoBlueprint["schemaRecommendations"] = [
  { type: "SoftwareApplication", notes: "Primary — name, description, free Offer, WebApplication category." },
  { type: "FAQPage", notes: "From tool.faq[] — 8–10 Q&As targeting People Also Ask." },
  { type: "HowTo", notes: "From tool.howToUse[] — step list with SoftwareApplication as tool." },
  { type: "BreadcrumbList", notes: "Home → Category hub → Tool." },
  { type: "WebPage", notes: "Editorial body with speakable summary from intro + first section." }
];

export const toolSeoBlueprints: ToolSeoBlueprint[] = [
  {
    slug: "compress-pdf",
    h1: "Compress PDF Online Free",
    metaTitle: "Compress PDF Online Free — Reduce File Size in Your Browser",
    metaDescription:
      "Compress PDF files online free in your browser. Reduce upload size for email, portals, and LMS before you submit. No signup, with before/after size preview.",
    searchIntent: "transactional",
    primaryKeyword: "compress pdf online free",
    secondaryKeywords: ["reduce pdf file size", "pdf compressor", "shrink pdf for email", "compress pdf without losing quality"],
    semanticKeywords: [
      "pdf optimization",
      "file size limit",
      "document upload",
      "lossless compression",
      "scanned pdf",
      "digital signature",
      "pdf/a",
      "court e-filing"
    ],
    longTailKeywords: [
      "how to compress pdf under 5mb for email",
      "compress pdf for government portal upload",
      "reduce scanned pdf size without blurring text",
      "compress pdf on chromebook without installing software",
      "best free pdf compressor no watermark no signup"
    ],
    relatedInternalLinks: [
      { label: "Merge PDF", href: "/merge-pdf", anchorContext: "Combine files before a single compression pass" },
      { label: "Split PDF", href: "/split-pdf", anchorContext: "Remove heavy appendix pages first" },
      { label: "PDF to JPG", href: "/pdf-to-jpg", anchorContext: "When only images are required by the recipient" },
      { label: "Extract PDF Pages", href: "/extract-pdf-pages", anchorContext: "Pull out oversized exhibits" },
      { label: "How to compress PDF files", href: "/blog/how-to-compress-pdf-files", anchorContext: "Long-form workflow guide" }
    ],
    schemaRecommendations: sharedSchema,
    sections: [
      {
        id: "what-is-compress-pdf",
        heading: "What compress PDF online means — and when you actually need it",
        paragraphs: [
          "Compressing a PDF reduces the bytes required to store or transmit the file. That matters the moment a portal, email gateway, or learning management system rejects your upload. The goal is not always the smallest possible file; it is a file that passes the limit while remaining readable at 100% zoom.",
          "Browser-based compression keeps sensitive documents on your device when the workflow supports local processing. That is why students, freelancers, and office workers search for compress pdf online free instead of installing desktop suites on locked-down laptops."
        ],
        subsections: [
          {
            heading: "Transactional vs archival compression",
            paragraphs: [
              "Transactional compression optimizes for upload: court e-filing caps, visa portals, job applications, and client email attachments. Archival compression (PDF/A, long-term records) may forbid aggressive re-encoding. If your recipient mentions PDF/A or digital signatures, compress conservatively and verify the output opens exactly as required."
            ]
          },
          {
            heading: "Why scanned PDFs behave differently",
            paragraphs: [
              "Scanned leases, handwritten notes, and photo-based pages are already image-heavy. Compression can shrink them dramatically, but repeated lossy passes blur fine print. Start with one moderate pass, open the result at 100% zoom, and only then decide whether to split pages or remove color scans you do not need."
            ]
          }
        ]
      },
      {
        id: "how-to-compress",
        heading: "How to compress a PDF for email, portals, and LMS uploads",
        paragraphs: [
          "Treat compression as the last step in a document pipeline, not the first. Merge related files, split irrelevant appendices, rotate mis-scanned pages, then compress once. Running multiple aggressive passes is the fastest way to turn crisp text into gray mush.",
          "After download, spot-check page order, hyperlinks, form fields, and signature panels. Some portals only validate file size; others re-render pages and expose compression artifacts immediately."
        ],
        subsections: [
          {
            heading: "Recommended workflow on freetoolkitapp",
            paragraphs: [
              "Duplicate your original PDF before you start. Upload the working copy, choose conservative settings first, and compare before/after size in the tool. If you are still over the limit, use Split PDF or Extract PDF Pages to remove heavy exhibits, then compress again. Pair with Merge PDF when you are combining packets for a single submission."
            ]
          },
          {
            heading: "Quality checklist before you submit",
            paragraphs: [
              "Open every page at 100% zoom. Confirm small type in footnotes, stamps, and tables. Test on mobile if the reviewer will read on a phone. Re-export from the source application if the PDF embeds huge embedded fonts or duplicate high-resolution images you no longer need."
            ]
          }
        ]
      },
      {
        id: "use-cases",
        heading: "Real-world use cases: who compresses PDFs and why",
        subsections: [
          {
            heading: "Students and educators",
            paragraphs: [
              "Syllabus packets, scanned homework, and portfolio PDFs often exceed LMS limits below 10–25 MB. Compression after merge keeps submissions on time without asking students to install desktop software on school Chromebooks."
            ]
          },
          {
            heading: "Legal, finance, and compliance",
            paragraphs: [
              "E-filing systems publish hard caps (often 25–35 MB per envelope). Attorneys compress exhibits after redaction, then verify that redaction boxes still cover underlying text. Never compress your only notarized copy—work on a duplicate."
            ]
          },
          {
            heading: "Sales, marketing, and freelancers",
            paragraphs: [
              "Proposal PDFs with full-bleed photography blow email limits quickly. Compress after export from design tools, or convert hero spreads to JPG via PDF to JPG when the recipient only needs visuals, not editable vectors."
            ]
          }
        ]
      },
      {
        id: "comparison",
        heading: "Compress PDF vs split, convert, or merge first",
        paragraphs: [
          "Compression alone cannot fix a 200-page scan with color photos on every page. Split PDF removes chapters you do not need to transmit. Merge PDF combines multiple small files so you compress once instead of emailing twelve attachments. PDF to Word helps when the recipient must edit text—not when they only need a smaller upload.",
          "Use the PDF & Image hub to chain tools: extract oversized pages → merge the remainder → compress → verify in the same browser session."
        ]
      },
      {
        id: "privacy",
        heading: "Privacy, signatures, and browser-based PDF compression",
        paragraphs: [
          "freetoolkitapp processes files in the browser where supported, which reduces unnecessary server uploads for everyday tasks. Policies differ by institution: PHI, sealed records, and unreleased financials may still require offline tooling. Digital signatures and certified PDFs may invalidate if re-encoded—test on a copy.",
          "Read our privacy checklist for browser tools before you paste client data into any online utility. When in doubt, ask the receiving organization which compression methods they accept."
        ]
      }
    ]
  },
  {
    slug: "image-compressor",
    h1: "Image Compressor Online Free",
    metaTitle: "Image Compressor Online Free — Reduce JPG, PNG & WebP Size",
    metaDescription:
      "Compress images online free in your browser. Shrink JPG, PNG, and WebP for faster uploads, better Core Web Vitals, and email-friendly attachments. No signup.",
    searchIntent: "transactional",
    primaryKeyword: "image compressor online free",
    secondaryKeywords: ["compress jpg online", "reduce image file size", "webp compression", "optimize images for web"],
    semanticKeywords: ["core web vitals", "lazy loading", "responsive images", "exif metadata", "lossy compression", "shopify upload limit", "hero image", "thumbnail"],
    longTailKeywords: [
      "compress png for website without visible quality loss",
      "reduce image size for shopify product upload",
      "compress screenshot for slack under 10mb",
      "best free image compressor browser no upload",
      "compress heic photos before converting to jpg"
    ],
    relatedInternalLinks: [
      { label: "Image Resizer", href: "/image-resizer", anchorContext: "Dimensions often matter more than quality slider alone" },
      { label: "WebP Converter", href: "/webp-converter", anchorContext: "Modern format for hero images" },
      { label: "PNG to JPG", href: "/png-to-jpg", anchorContext: "When transparency is not required" },
      { label: "PNG vs JPG vs WebP", href: "/blog/png-vs-jpg-vs-webp", anchorContext: "Format decision guide" }
    ],
    schemaRecommendations: sharedSchema,
    sections: [
      {
        id: "why-compress-images",
        heading: "Why image compression still matters in 2026",
        paragraphs: [
          "Cameras and design exports produce files far larger than the web can afford to serve unchanged. Compression reduces bytes so pages load faster, email attachments deliver, and CMS uploads succeed without timeouts.",
          "The tradeoff is always quality versus size. A good compressor lets you preview results before download so you stop before banding appears in skies or serif fonts get muddy."
        ],
        subsections: [
          {
            heading: "Core Web Vitals and publishing",
            paragraphs: [
              "Large hero images dominate LCP (Largest Contentful Paint). Compressing and resizing before upload beats lazy-loading alone. Pair compression with WebP Converter when your CDN supports modern formats."
            ]
          },
          {
            heading: "EXIF and privacy",
            paragraphs: [
              "Photos may embed GPS coordinates and device identifiers. Compression workflows are a natural point to strip metadata before public publishing while keeping an original archive offline."
            ]
          }
        ]
      },
      {
        id: "workflow",
        heading: "Step-by-step: compress images without ruining quality",
        paragraphs: [
          "Duplicate the original. Upload JPG, PNG, or WebP, move the quality slider gradually, and compare file size plus visual preview. If still too large, resize dimensions with Image Resizer—pixel count often dominates file size for screenshots and photos alike."
        ],
        subsections: [
          {
            heading: "Format-specific tips",
            paragraphs: [
              "PNG screenshots compress differently from photographic JPG. Flat UI captures may tolerate higher compression; product photos need conservative settings. Animated PNG and SVG workflows may require different tools entirely."
            ]
          }
        ]
      },
      {
        id: "audiences",
        heading: "Who uses an online image compressor?",
        subsections: [
          {
            heading: "E-commerce and creators",
            paragraphs: ["Shopify, Etsy, and marketplace limits punish oversized product galleries. Batch compress before upload to avoid rejected listings and mobile checkout slowdowns."]
          },
          {
            heading: "Developers and marketers",
            paragraphs: ["Landing pages, docs, and changelog screenshots should ship under budget. Compress once, commit optimized assets, and reference Image to PDF when bundling into documents."]
          }
        ]
      },
      {
        id: "chain-tools",
        heading: "Chain compression with resize, crop, and convert",
        paragraphs: [
          "Image Compressor → WebP Converter → CDN upload is a common pipeline. For print-adjacent workflows, keep a lossless master and derive web variants. HEIC to JPG helps iPhone photographers before compression when browsers cannot decode HEIC directly."
        ]
      }
    ]
  },
  {
    slug: "png-to-jpg",
    h1: "PNG to JPG Converter Online Free",
    metaTitle: "PNG to JPG Converter Online Free — Fast Browser Conversion",
    metaDescription:
      "Convert PNG to JPG online free in your browser. Reduce file size when transparency is not needed. Preview output before download. No signup required.",
    searchIntent: "transactional",
    primaryKeyword: "png to jpg converter online free",
    secondaryKeywords: ["convert png to jpeg", "png to jpg without losing quality", "png to jpg compress"],
    semanticKeywords: ["alpha channel", "transparency", "lossy jpeg", "photo export", "cms upload", "social image"],
    longTailKeywords: [
      "convert png screenshot to jpg for email",
      "png to jpg for website when no transparency needed",
      "batch png to jpg in browser free",
      "png to jpg vs webp which is smaller"
    ],
    relatedInternalLinks: [
      { label: "JPG to PNG", href: "/jpg-to-png", anchorContext: "Reverse conversion when transparency is required" },
      { label: "Image Compressor", href: "/image-compressor", anchorContext: "Further shrink JPG output" },
      { label: "WebP Converter", href: "/webp-converter", anchorContext: "Next-gen format after JPG baseline" },
      { label: "PNG vs JPG vs WebP", href: "/blog/png-vs-jpg-vs-webp", anchorContext: "Choose the right format" }
    ],
    schemaRecommendations: sharedSchema,
    sections: [
      {
        id: "when-convert",
        heading: "When to convert PNG to JPG (and when not to)",
        paragraphs: [
          "PNG preserves transparency and sharp edges—ideal for logos and UI assets. JPG excels at photographic content with smaller files. Convert when you no longer need an alpha channel and want faster uploads or email delivery.",
          "Converting a logo with transparency to JPG fills the transparent areas with a solid background—usually white. Preview before download to confirm the backdrop matches your layout."
        ]
      },
      {
        id: "quality",
        heading: "Quality settings and compression after conversion",
        paragraphs: [
          "Export at moderate quality first; you can run Image Compressor on the JPG if portals still reject the size. Avoid chaining multiple lossy encodes—each pass adds artifacts."
        ],
        subsections: [
          {
            heading: "PNG screenshots vs photos",
            paragraphs: [
              "Flat screenshots may convert cleanly at higher compression. Gradients and soft shadows show banding sooner—use conservative quality for marketing hero exports."
            ]
          }
        ]
      },
      {
        id: "workflow",
        heading: "Typical PNG → JPG workflows",
        paragraphs: [
          "Designers export PNG from Figma, convert to JPG for blog CMS, then compress. Photographers convert PNG intermediates from editing tools before gallery upload. Developers convert API-generated chart PNGs to JPG for PDF embedding via Image to PDF."
        ]
      }
    ]
  },
  {
    slug: "ai-resume-cover-letter",
    h1: "AI Resume & Cover Letter Generator",
    metaTitle: "AI Resume & Cover Letter Generator — Free Drafts You Can Edit",
    metaDescription:
      "Generate AI resume and cover letter drafts from your real experience. No fabricated roles. Pair with the ATS Resume Checker before you apply. Free, no signup.",
    searchIntent: "commercial",
    primaryKeyword: "ai resume generator free",
    secondaryKeywords: ["ai cover letter generator", "resume writer online", "ats friendly resume", "ai cv builder"],
    semanticKeywords: ["applicant tracking system", "job description matching", "bullet achievements", "career change", "quantified results", "human review", "ai disclosure"],
    longTailKeywords: [
      "ai resume generator no signup free",
      "write cover letter from job description ai",
      "resume bullet points from job description",
      "ai resume for career change without lying",
      "how to use ai for resume ethically"
    ],
    relatedInternalLinks: [
      { label: "ATS Resume Checker", href: "/resume-ats-checker", anchorContext: "Validate keywords and formatting before apply" },
      { label: "AI Interview Answer Generator", href: "/ai-interview-answer-generator", anchorContext: "Prep talking points from the same JD" },
      { label: "Grammar Fixer", href: "/grammar-fixer", anchorContext: "Polish final prose" },
      { label: "AI LinkedIn Summary", href: "/ai-linkedin-summary-generator", anchorContext: "Align public profile with resume narrative" }
    ],
    schemaRecommendations: sharedSchema,
    sections: [
      {
        id: "ethical-ai-resume",
        heading: "Using AI for resumes without fabricating experience",
        paragraphs: [
          "The best AI resume output starts from facts you supply: employers, titles, dates, metrics, and projects you can defend in an interview. freetoolkitapp is designed to reorganize and phrase—not invent credentials.",
          "Always read every bullet. Remove claims you cannot explain. Follow employer and school policies on generative AI disclosure."
        ],
        subsections: [
          {
            heading: "Verification beats velocity",
            paragraphs: [
              "Spraying identical AI letters to hundreds of listings triggers recruiter fatigue and ATS mismatches. Tailor each draft to the job description, then run the ATS Resume Checker for keyword coverage and readable formatting."
            ]
          }
        ]
      },
      {
        id: "workflow",
        heading: "Recommended resume + cover letter workflow",
        paragraphs: [
          "Paste the job description and your verified experience. Generate a one-page resume draft and a cover letter that references specific requirements. Edit for voice, cut fluff by 20%, export to PDF via Word to PDF if needed, and check formatting in the ATS tool."
        ]
      },
      {
        id: "audiences",
        heading: "Who benefits most from AI resume drafting",
        subsections: [
          {
            heading: "Career changers",
            paragraphs: ["Translate transferable skills into the language of the target industry. AI helps reframe bullets; you validate accuracy."]
          },
          {
            heading: "Students and new graduates",
            paragraphs: ["Structure projects and internships when work history is thin. Never add roles you did not hold."]
          },
          {
            heading: "Experienced professionals",
            paragraphs: ["Condense long careers to one page, quantify outcomes, and align with executive keyword patterns in the JD."]
          }
        ]
      },
      {
        id: "ats",
        heading: "ATS-friendly formatting principles",
        paragraphs: [
          "Prefer simple headings, standard section order, and readable fonts. Avoid text boxes and multi-column layouts that parsers scramble. The ATS Resume Checker highlights gaps between your draft and the posting."
        ]
      }
    ]
  },
  {
    slug: "resume-ats-checker",
    h1: "ATS Resume Checker Online Free",
    metaTitle: "ATS Resume Checker — Match Keywords & Formatting Free",
    metaDescription:
      "Check your resume against a job description for ATS keywords, section coverage, and readability. Free browser tool—pair with AI Resume Generator drafts.",
    searchIntent: "commercial",
    primaryKeyword: "ats resume checker free",
    secondaryKeywords: ["resume keyword checker", "ats compatibility test", "resume scanner online", "job description match"],
    semanticKeywords: ["applicant tracking system", "keyword density", "hard skills", "soft skills", "parseable pdf", "recruiter screen"],
    longTailKeywords: [
      "check if resume will pass ats free",
      "resume keyword match job description tool",
      "ats resume checker no signup",
      "how to optimize resume for ats 2026",
      "resume formatting mistakes ats"
    ],
    relatedInternalLinks: [
      { label: "AI Resume Generator", href: "/ai-resume-cover-letter", anchorContext: "Generate a draft to scan" },
      { label: "AI Email Writer", href: "/ai-email-writer", anchorContext: "Follow-up after applying" },
      { label: "Grammar Fixer", href: "/grammar-fixer", anchorContext: "Fix awkward phrasing flagged in review" }
    ],
    schemaRecommendations: sharedSchema,
    sections: [
      {
        id: "what-is-ats",
        heading: "What an ATS resume checker actually evaluates",
        paragraphs: [
          "Applicant Tracking Systems index resumes for recruiters—matching skills, titles, and keywords from the job description. A checker compares your text to that vocabulary and surfaces gaps before a human ever sees your file.",
          "No automated score guarantees an interview. Use results to prioritize honest edits: add real skills you possess, mirror terminology from the posting, and fix formatting that breaks parsers."
        ]
      },
      {
        id: "how-to-use",
        heading: "How to use the ATS checker effectively",
        paragraphs: [
          "Paste the full job description and your current resume text. Review missing keywords—only add terms that reflect genuine experience. Re-run after edits from the AI Resume Generator or manual rewrites."
        ],
        subsections: [
          {
            heading: "Formatting checks",
            paragraphs: [
              "Simple single-column layouts parse best. Export PDFs from tools that embed real text—not scanned images of text. If the checker flags unreadable sections, re-export from Word or Google Docs."
            ]
          }
        ]
      },
      {
        id: "mistakes",
        heading: "Common ATS mistakes to avoid",
        paragraphs: [
          "Keyword stuffing unrelated skills backfires in human review. Graphics-heavy templates, headers named creatively instead of 'Experience', and tables split across columns confuse parsers. Keep file names professional: Firstname-Lastname-Role.pdf."
        ]
      }
    ]
  },
  {
    slug: "ai-email-writer",
    h1: "AI Email Writer Free",
    metaTitle: "AI Email Writer — Professional Drafts in Seconds",
    metaDescription:
      "Write professional emails with AI: follow-ups, client updates, job outreach, and meeting requests. Edit before sending. Free browser tool, no signup.",
    searchIntent: "transactional",
    primaryKeyword: "ai email writer free",
    secondaryKeywords: ["ai professional email generator", "business email writer", "cold email ai", "follow up email generator"],
    semanticKeywords: ["tone of voice", "subject line", "call to action", "bcc etiquette", "client communication", "recruiter outreach"],
    longTailKeywords: [
      "ai email writer for job follow up",
      "write professional email to client ai free",
      "ai cold outreach email template generator",
      "short polite reminder email ai",
      "ai email writer no signup browser"
    ],
    relatedInternalLinks: [
      { label: "Grammar Fixer", href: "/grammar-fixer", anchorContext: "Polish tone and mechanics" },
      { label: "Paraphrasing Tool", href: "/paraphrasing-tool", anchorContext: "Soften or shorten drafts" },
      { label: "AI Resume Generator", href: "/ai-resume-cover-letter", anchorContext: "Pair with recruiter outreach" },
      { label: "Content Rewriter", href: "/content-rewriter", anchorContext: "Adapt one email for multiple segments" }
    ],
    schemaRecommendations: sharedSchema,
    sections: [
      {
        id: "professional-email",
        heading: "Writing professional emails with AI assistance",
        paragraphs: [
          "Email is high-stakes at low word count: tone, clarity, and a single call-to-action determine whether you get a reply. AI drafts give you structure; you supply context, relationship history, and final judgment.",
          "Never send without reading. Remove hallucinated names, dates, or commitments the model inferred. Confirm recipients and attachments manually."
        ]
      },
      {
        id: "use-cases",
        heading: "High-intent email types this tool supports",
        subsections: [
          {
            heading: "Job search and networking",
            paragraphs: ["Follow-ups after interviews, recruiter introductions, and thank-you notes within 24 hours. Reference specific conversation points—you paste them; AI organizes."]
          },
          {
            heading: "Client and team updates",
            paragraphs: ["Status summaries, delay notifications, and meeting recaps. Lead with outcome, then blockers, then next steps."]
          }
        ]
      },
      {
        id: "tone",
        heading: "Tone, length, and deliverability",
        paragraphs: [
          "Shorter emails outperform rambling drafts on mobile. One ask per message. Subject lines should be specific ('Q2 report draft — feedback by Thursday') rather than vague ('Quick question'). Pair with Grammar Fixer when translating or tightening non-native phrasing."
        ]
      }
    ]
  }
];

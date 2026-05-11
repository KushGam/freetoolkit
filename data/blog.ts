import { getTool, toolHref, type Tool } from "@/data/tools";
import { getBlogSlugsForTool, getRelatedBlogSlugsForBlog } from "@/data/tool-relations";

export type BlogCategory = "PDF Guides" | "Image Guides" | "Student Guides" | "Productivity Guides" | "Text Guides" | "Security Guides" | "Gaming Guides";

export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  publishedAt: string;
  readingTime: string;
  relatedTools: string[];
  keywords: string[];
  content: BlogSection[];
};

export type BlogFaq = {
  question: string;
  answer: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-compress-pdf-files",
    title: "How to Compress PDF Files Online",
    description: "Learn practical ways to reduce PDF file size, when browser compression helps, and what to do when scanned PDFs stay large.",
    category: "PDF Guides",
    publishedAt: "2026-05-10",
    readingTime: "5 min read",
    relatedTools: ["compress-pdf", "split-pdf", "merge-pdf", "extract-pdf-pages"],
    keywords: ["compress PDF", "reduce PDF file size", "PDF optimizer", "online PDF tools"],
    content: [
      {
        heading: "Why PDF files become too large",
        paragraphs: [
          "PDF size depends on what is inside the document. A text-based PDF is usually small because the file stores characters, fonts, and layout instructions. A scanned PDF can be much larger because every page is stored as an image.",
          "Images, high-resolution scans, embedded fonts, annotations, and extra metadata can all increase file size. Before compressing, it helps to understand whether your PDF is mostly text or mostly image data."
        ]
      },
      {
        heading: "Start with browser-based compression",
        paragraphs: [
          "For quick everyday work, open the Compress PDF tool, upload your file, and let the browser rebuild the document. This can reduce extra structure and create a cleaner PDF without changing your original file.",
          "After downloading the result, compare the file size and open the PDF to confirm that every page still displays correctly. This review step is especially important before uploading documents to school, job, government, or client portals."
        ]
      },
      {
        heading: "What to do when compression is limited",
        paragraphs: [
          "If the compressed PDF is almost the same size, the file is probably already optimized or mostly made of scanned images. In that case, removing pages with Split PDF or Extract PDF Pages may be more effective than compressing the whole document.",
          "For scanned documents, the strongest size reduction usually comes from rescanning at a lower resolution or exporting from the original scanner app with smaller image settings. A browser tool can help with structure, but it cannot always rewrite heavy embedded images."
        ]
      },
      {
        heading: "A practical PDF cleanup workflow",
        paragraphs: [
          "First remove unnecessary pages, then merge only the files you need, and finally compress the finished document. This keeps the output focused and avoids spending time optimizing pages that should not be included.",
          "Keep your original PDF until the final upload or email is accepted. A compressed copy is useful for sharing, while the original remains your backup if you need a higher-quality version later."
        ]
      }
    ]
  },
  {
    slug: "how-to-compress-images-without-losing-quality",
    title: "How to Compress Images Without Losing Too Much Quality",
    description: "A simple guide to reducing JPG, PNG, and WebP file sizes while keeping images clear enough for websites, forms, and sharing.",
    category: "Image Guides",
    publishedAt: "2026-05-10",
    readingTime: "5 min read",
    relatedTools: ["image-compressor", "image-resizer", "webp-converter", "image-converter"],
    keywords: ["compress images", "reduce image size", "image quality", "online image compressor"],
    content: [
      {
        heading: "Compression is a balance",
        paragraphs: [
          "Image compression reduces file size by simplifying image data. The goal is not always the smallest possible file; it is the smallest file that still looks good for its purpose.",
          "A product photo, portfolio image, document scan, and social thumbnail all have different quality needs. Previewing the result matters more than chasing a single perfect percentage."
        ]
      },
      {
        heading: "Use a moderate quality setting first",
        paragraphs: [
          "Open Image Compressor, upload your image, and start with a middle-to-high quality setting. Photos often tolerate compression well, while screenshots, logos, and text-heavy graphics may need a higher setting.",
          "Compare the original and compressed previews before downloading. Look closely at text edges, faces, gradients, and product details because these are where compression artifacts are easiest to notice."
        ]
      },
      {
        heading: "Resize before compressing when dimensions are too large",
        paragraphs: [
          "If a 4000-pixel-wide image will only appear as a 900-pixel blog image, resize it first. Fewer pixels usually means a smaller file before compression even begins.",
          "Use Image Resizer to set realistic dimensions, then use Image Compressor or WebP Converter for the final output. This two-step workflow is often better than heavy compression on an oversized source image."
        ]
      },
      {
        heading: "Choose the right output format",
        paragraphs: [
          "JPG is usually good for photos, PNG is useful for sharp graphics or transparency, and WebP is often a strong choice for modern websites. The best format depends on the image and where it will be used.",
          "Always keep a copy of the original image. Use the compressed version for upload, email, or publishing, and keep the source file in case you need a different size or format later."
        ]
      }
    ]
  },
  {
    slug: "png-vs-jpg-vs-webp",
    title: "PNG vs JPG vs WebP: Which Image Format Should You Use?",
    description: "Compare PNG, JPG, and WebP in plain language so you can choose the right format for photos, screenshots, websites, and transparent graphics.",
    category: "Image Guides",
    publishedAt: "2026-05-10",
    readingTime: "6 min read",
    relatedTools: ["png-to-jpg", "jpg-to-png", "webp-converter", "image-compressor"],
    keywords: ["PNG vs JPG", "WebP format", "image formats", "convert images online"],
    content: [
      {
        heading: "Use JPG for most photos",
        paragraphs: [
          "JPG is widely supported and usually creates small files for photographic images. It is a practical choice for profile photos, blog images, product photos, and email attachments.",
          "The tradeoff is that JPG uses lossy compression and does not support transparency. If your image has sharp text or needs a transparent background, another format may be better."
        ]
      },
      {
        heading: "Use PNG for sharp graphics and transparency",
        paragraphs: [
          "PNG is useful for screenshots, logos, icons, diagrams, and images with transparent areas. It preserves crisp edges well, which makes it reliable for graphics that include text.",
          "PNG files can be larger than JPG files, especially for photos. If a platform rejects PNG or you need a smaller photo-style file, PNG to JPG conversion can be a reasonable option."
        ]
      },
      {
        heading: "Use WebP for modern web performance",
        paragraphs: [
          "WebP is designed for smaller web images while keeping good visual quality. It can be useful for websites, blogs, landing pages, and media-heavy pages where loading speed matters.",
          "Modern browsers support WebP, but compatibility with older systems can still matter in some workflows. When in doubt, keep the original source image and publish WebP where your audience can use it."
        ]
      },
      {
        heading: "Quick decision guide",
        paragraphs: [
          "Choose JPG for photos, PNG for transparency or crisp graphics, and WebP for modern website images. If file size is your main problem, compress or resize the image before converting formats.",
          "FreeToolKit includes converters for common format changes, so you can test one image, compare the result, and choose the format that fits your upload, website, or document."
        ]
      }
    ]
  },
  {
    slug: "best-free-student-tools",
    title: "Best Free Online Student Tools for Study, Grades, and Writing",
    description: "A practical list of free student tools for GPA, attendance, study notes, writing cleanup, and assignment preparation.",
    category: "Student Guides",
    publishedAt: "2026-05-10",
    readingTime: "5 min read",
    relatedTools: ["gpa-calculator", "study-timer", "attendance-calculator", "ai-study-notes", "word-counter", "grammar-fixer"],
    keywords: ["student tools", "free study tools", "GPA calculator", "AI study notes"],
    content: [
      {
        heading: "Tools should save time, not create more work",
        paragraphs: [
          "Students often need quick answers: calculate a grade, clean up writing, summarize notes, or prepare a document before a deadline. A good online tool should make that task simpler without requiring a new account.",
          "FreeToolKit focuses on small, practical workflows that run in the browser where possible. That makes it useful for quick checks between classes, study sessions, applications, and assignments."
        ]
      },
      {
        heading: "Grade and attendance planning",
        paragraphs: [
          "Use GPA Calculator, Final Grade Calculator, Weighted Grade Calculator, and Attendance Calculator when you need to understand where you stand. These tools are most helpful when you enter realistic numbers from your syllabus or school portal.",
          "They do not replace official school records, but they can help you plan study time and spot which assignments or exams matter most."
        ]
      },
      {
        heading: "Study and writing support",
        paragraphs: [
          "AI Study Notes can turn rough material into organized notes, while Explain Simple can make confusing text easier to understand. For writing, Grammar Fixer, Word Counter, and Paraphrasing Tool help with cleanup and review.",
          "Always read AI-generated output before using it. The best use is as a study assistant or drafting helper, not as a replacement for your own understanding."
        ]
      },
      {
        heading: "Document tasks for school submissions",
        paragraphs: [
          "PDF tools such as Merge PDF, Split PDF, Compress PDF, and Word to PDF are useful when a portal has strict upload rules. You can combine files, reduce size, or create a simple PDF from text.",
          "Before submitting, open the final file and confirm page order, spelling, and formatting. That small check prevents many avoidable mistakes."
        ]
      }
    ]
  },
  {
    slug: "how-to-merge-pdf-files-online",
    title: "How to Merge PDF Files Online",
    description: "Learn how to combine several PDF files into one organized document for applications, reports, receipts, and submissions.",
    category: "PDF Guides",
    publishedAt: "2026-05-10",
    readingTime: "4 min read",
    relatedTools: ["merge-pdf", "split-pdf", "compress-pdf", "word-to-pdf"],
    keywords: ["merge PDF", "combine PDF files", "online PDF merger", "PDF workflow"],
    content: [
      {
        heading: "When merging PDFs is useful",
        paragraphs: [
          "Merging PDFs is helpful when you need one clean document instead of several separate attachments. Common examples include job applications, school packets, receipts, invoices, project reports, and signed forms.",
          "A single PDF is easier to name, upload, archive, and review. It also reduces the chance that a recipient misses one of the attachments."
        ]
      },
      {
        heading: "Prepare the files first",
        paragraphs: [
          "Before merging, check that every file opens correctly and that the page order makes sense. Rename files if needed so you can identify them quickly while selecting them.",
          "If one PDF contains pages you do not need, use Split PDF or Extract PDF Pages before merging. This keeps the final document focused and smaller."
        ]
      },
      {
        heading: "Combine and review",
        paragraphs: [
          "Open Merge PDF, upload two or more PDFs, and combine them into a new file. The original PDFs stay unchanged, so you can try again if the order is not right.",
          "After downloading, open the merged PDF and scroll through the full document. Confirm the cover page, attachments, signatures, and final pages are all in the expected order."
        ]
      },
      {
        heading: "Finish with compression if needed",
        paragraphs: [
          "If the merged file is too large for email or an upload portal, run it through Compress PDF. If it is still too large, remove unnecessary pages or check whether the source files contain high-resolution scans.",
          "Use a descriptive final file name, such as application-documents.pdf or project-report.pdf, so the recipient immediately understands what the document contains."
        ]
      }
    ]
  },
  {
    slug: "how-to-calculate-gpa",
    title: "How to Calculate GPA",
    description: "Understand the basic GPA formula, how grade points and credits work, and when to use GPA or CGPA calculators.",
    category: "Student Guides",
    publishedAt: "2026-05-10",
    readingTime: "5 min read",
    relatedTools: ["gpa-calculator", "cgpa-calculator", "grade-percentage-calculator", "gpa-to-percentage-converter"],
    keywords: ["calculate GPA", "GPA calculator", "CGPA calculator", "grade points"],
    content: [
      {
        heading: "The basic GPA idea",
        paragraphs: [
          "GPA is usually calculated by converting each letter grade into grade points, multiplying by course credits, adding the results, and dividing by the total number of credits.",
          "The exact scale can vary by school, so always compare your result with your institution's grading policy. A calculator helps with arithmetic, but your school's rules decide the official number."
        ]
      },
      {
        heading: "Why credits matter",
        paragraphs: [
          "A high-credit course affects GPA more than a low-credit course. For example, a four-credit course usually has twice the weight of a two-credit course.",
          "That is why a simple average of grades may not match your official GPA. Weighted calculation is important when classes have different credit values."
        ]
      },
      {
        heading: "GPA, CGPA, and percentages",
        paragraphs: [
          "GPA usually describes performance for a term or selected set of courses. CGPA often describes cumulative performance across multiple terms. Percentage conversions depend heavily on local grading rules.",
          "Use GPA Calculator for course-level calculations, CGPA Calculator for cumulative planning, and GPA to Percentage Converter only as an estimate unless your school publishes an official conversion method."
        ]
      },
      {
        heading: "How to use the result",
        paragraphs: [
          "A GPA estimate can help you plan study priorities, understand what final grades you need, or prepare application materials. It should not be treated as an official transcript.",
          "If the number matters for scholarships, graduation, or applications, verify it with your school portal or academic office."
        ]
      }
    ]
  },
  {
    slug: "best-free-online-tools-for-daily-work",
    title: "Best Free Online Tools for Daily Work",
    description: "A useful roundup of browser-based tools for documents, images, text cleanup, passwords, calculations, and quick productivity tasks.",
    category: "Productivity Guides",
    publishedAt: "2026-05-10",
    readingTime: "6 min read",
    relatedTools: ["word-counter", "image-compressor", "compress-pdf", "qr-code-generator", "password-generator", "json-formatter"],
    keywords: ["free online tools", "daily productivity tools", "browser tools", "work utilities"],
    content: [
      {
        heading: "Small tools can remove daily friction",
        paragraphs: [
          "Daily work is full of small tasks: compress a file, count words, format JSON, generate a password, convert an image, or combine PDFs. These jobs are too small for heavy software but still need to be done correctly.",
          "A browser-based toolkit helps because you can open the exact utility, finish the task, and get back to your main work without creating another account."
        ]
      },
      {
        heading: "Document and image tools",
        paragraphs: [
          "Compress PDF, Merge PDF, Split PDF, Image Compressor, Image Resizer, and WebP Converter are useful for emails, websites, reports, forms, and content publishing.",
          "The best workflow is usually simple: remove what you do not need, resize large media, then compress the final file if upload limits still matter."
        ]
      },
      {
        heading: "Text and developer tools",
        paragraphs: [
          "Word Counter, Case Converter, Remove Extra Spaces, JSON Formatter, URL Encoder / Decoder, and Base64 Encoder / Decoder help clean up copied text and technical data.",
          "These tools are especially useful when moving content between documents, spreadsheets, CMS editors, support tickets, and development environments."
        ]
      },
      {
        heading: "Security and sharing utilities",
        paragraphs: [
          "Password Generator helps create stronger random passwords, while QR Code Generator makes links easier to share in print or presentations. Use a password manager to store generated passwords safely.",
          "For recurring work, bookmark the tools you use most often. A few reliable utilities can make everyday tasks feel much lighter."
        ]
      }
    ]
  },
  {
    slug: "how-to-resize-images-online",
    title: "How to Resize Images Online",
    description: "Learn how to resize images by width and height, keep aspect ratio, and prepare files for websites, forms, and social platforms.",
    category: "Image Guides",
    publishedAt: "2026-05-10",
    readingTime: "4 min read",
    relatedTools: ["image-resizer", "image-compressor", "image-cropper", "image-to-pdf"],
    keywords: ["resize image", "image resizer", "change image dimensions", "resize photos online"],
    content: [
      {
        heading: "Know the required size",
        paragraphs: [
          "Before resizing, check whether the destination asks for exact pixel dimensions, a maximum file size, or both. Upload forms, profile pages, marketplaces, and school portals often have specific requirements.",
          "If there is no exact rule, resize the image to the largest size it will actually appear. This avoids carrying extra pixels that do not improve the final result."
        ]
      },
      {
        heading: "Keep aspect ratio on for natural results",
        paragraphs: [
          "Aspect ratio is the relationship between width and height. Keeping it enabled prevents portraits, product photos, screenshots, and logos from looking stretched or squeezed.",
          "Turn it off only when you deliberately need an exact custom size. If the image composition matters, cropping may be better than forcing the image into a different shape."
        ]
      },
      {
        heading: "Resize, preview, then compress",
        paragraphs: [
          "Use Image Resizer to enter the target width or height, preview the result, and download the resized copy. If the file is still too large, use Image Compressor next.",
          "This order usually produces better results than compressing a huge image first. Smaller dimensions reduce the amount of image data before quality settings are applied."
        ]
      },
      {
        heading: "Keep the original file",
        paragraphs: [
          "A resized image is usually a working copy. Keep the original in case you need to export another size, crop a different area, or create a higher-quality version later.",
          "For websites, consistent image dimensions can make pages look cleaner and load faster, especially when images appear in grids or repeated cards."
        ]
      }
    ]
  },
  {
    slug: "word-counter-guide",
    title: "Word Counter Guide: When Word Count and Character Count Matter",
    description: "Learn how word counters help with essays, social posts, meta descriptions, applications, and writing cleanup.",
    category: "Text Guides",
    publishedAt: "2026-05-10",
    readingTime: "4 min read",
    relatedTools: ["word-counter", "case-converter", "remove-extra-spaces", "text-formatter"],
    keywords: ["word counter", "character counter", "count words online", "writing tools"],
    content: [
      {
        heading: "Word count is a practical writing constraint",
        paragraphs: [
          "Word limits appear in essays, applications, article briefs, product descriptions, social profiles, and professional bios. A word counter helps you stay within the limit without guessing.",
          "Character count matters too, especially for titles, snippets, ads, SMS messages, usernames, and meta descriptions where every character can affect fit and clarity."
        ]
      },
      {
        heading: "Use counts while editing, not only at the end",
        paragraphs: [
          "Checking word count early helps you understand whether a draft is too broad or too thin. If you are far over the limit, cut repeated ideas before polishing individual sentences.",
          "If you are under the limit, add useful examples, clearer transitions, or missing context instead of padding the text."
        ]
      },
      {
        heading: "Clean pasted text before final review",
        paragraphs: [
          "Copied text can include extra spaces, inconsistent capitalization, or messy line breaks. Remove Extra Spaces, Case Converter, and Text Formatter can help clean the text before you count or submit it.",
          "Always review important writing after cleanup. Automated tools can save time, but they do not know your teacher's rubric, brand style, or application instructions."
        ]
      },
      {
        heading: "Common uses for word counters",
        paragraphs: [
          "Students use word counters for essays and discussion posts. Marketers use them for page titles, descriptions, and social captions. Job seekers use them for resumes, bios, and application answers.",
          "A simple word counter is most useful when it stays fast and predictable: paste text, check the numbers, edit, and copy the final version."
        ]
      }
    ]
  },
  {
    slug: "password-generator-guide",
    title: "Password Generator Guide: How to Create Strong Random Passwords",
    description: "Learn what makes a password stronger, how to use a password generator, and why storage matters as much as password length.",
    category: "Security Guides",
    publishedAt: "2026-05-10",
    readingTime: "5 min read",
    relatedTools: ["password-generator", "uuid-generator", "base64-encoder-decoder"],
    keywords: ["password generator", "strong password", "random password", "online security tools"],
    content: [
      {
        heading: "Strong passwords should be random and unique",
        paragraphs: [
          "A strong password is hard to guess because it is long, random, and not reused across accounts. Names, birthdays, common phrases, and keyboard patterns are easier for attackers to predict.",
          "Using a different password for every important account matters because one leaked password should not unlock everything else you use."
        ]
      },
      {
        heading: "Choose enough length",
        paragraphs: [
          "Longer passwords are generally stronger than shorter passwords, especially when they are random. For many accounts, 16 characters or more is a practical starting point when the service allows it.",
          "Symbols, numbers, uppercase letters, and lowercase letters can increase variety, but length and randomness are the most important parts for generated passwords."
        ]
      },
      {
        heading: "Store passwords safely",
        paragraphs: [
          "A generated password is only useful if you can store it safely. Use a trusted password manager instead of saving passwords in plain text documents, screenshots, email drafts, or notes apps.",
          "Do not reuse a generated password across multiple services. If one account is compromised, reused passwords can put other accounts at risk."
        ]
      },
      {
        heading: "Know what a password generator does not do",
        paragraphs: [
          "A password generator creates a random password, but it does not check whether a website stores passwords securely or whether your device is safe. Good account security also includes two-factor authentication where available.",
          "Use Password Generator for credentials, UUID Generator for identifiers, and Base64 Encoder / Decoder for encoding text. These tools serve different purposes and should not be treated as interchangeable security features."
        ]
      }
    ]
  },
  {
    slug: "palworld-breeding-guide",
    title: "Palworld Breeding Guide: Plan Parent Pairs Faster",
    description: "Use a practical workflow for Palworld breeding pair checks, reverse lookups, and faster planning before farming resources.",
    category: "Gaming Guides",
    publishedAt: "2026-05-11",
    readingTime: "4 min read",
    relatedTools: ["palworld-breeding-calculator", "minecraft-crafting-calculator", "pokemon-type-calculator"],
    keywords: ["Palworld breeding calculator", "Palworld breeding guide", "Pal offspring lookup", "gaming tools"],
    content: [
      {
        heading: "Use pair checks before farming",
        paragraphs: [
          "Breeding can consume a lot of time and resources when parent combinations are guessed manually. A calculator lets you test parent pairs first and avoid low-value trial runs.",
          "Start by selecting two pals, confirm the offspring result, then compare alternatives before committing your base resources."
        ]
      },
      {
        heading: "Reverse lookup helps when you know the target pal",
        paragraphs: [
          "If you already know the offspring you want, reverse lookup is usually the fastest path. It narrows pair options quickly and keeps your farming route focused.",
          "Use reverse lookup as a shortlist, then decide based on your current pal availability, map progress, and breeding priorities."
        ]
      },
      {
        heading: "Combine with material planning",
        paragraphs: [
          "Breeding plans often connect to crafting and base setup tasks. Pair checks are more useful when you also estimate material requirements and timing.",
          "Use related tools to plan gather routes, reduce wasted crafting loops, and keep progression smoother in repeat sessions."
        ]
      }
    ]
  },
  {
    slug: "valorant-sensitivity-guide",
    title: "Valorant Sensitivity Guide: Convert Settings Between Games",
    description: "Learn how to convert FPS sensitivity into Valorant values and then fine-tune for consistency and control.",
    category: "Gaming Guides",
    publishedAt: "2026-05-11",
    readingTime: "4 min read",
    relatedTools: ["valorant-sensitivity-converter", "palworld-breeding-calculator", "pokemon-type-calculator"],
    keywords: ["Valorant sensitivity converter", "FPS sensitivity conversion", "Valorant aim settings", "gaming tools"],
    content: [
      {
        heading: "Conversion is a baseline, not the final setting",
        paragraphs: [
          "Sensitivity conversion gives a strong starting point when you move between FPS titles. It helps preserve muscle-memory feel instead of restarting from random values.",
          "After conversion, test in practice mode and make small adjustments based on flick control and tracking comfort."
        ]
      },
      {
        heading: "Keep DPI and hardware context in mind",
        paragraphs: [
          "Converted values assume your DPI and hardware setup stay consistent. If DPI, mousepad space, or posture changes, your final comfortable setting can shift.",
          "Keep setup conditions stable while testing so you can isolate sensitivity quality instead of changing multiple variables at once."
        ]
      },
      {
        heading: "Use a repeatable adjustment method",
        paragraphs: [
          "Adjust in small increments, run short drills, and keep notes for each change. This avoids overcorrecting after one good or bad round.",
          "A repeatable process helps you lock a reliable sensitivity faster and reduces aim inconsistency across sessions."
        ]
      }
    ]
  }
];

export function blogHref(post: Pick<BlogPost, "slug">) {
  return `/blog/${post.slug}`;
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsBySlugs(slugs: string[]) {
  return slugs.map((slug) => getBlogPost(slug)).filter((post): post is BlogPost => Boolean(post));
}

export function getBlogFaqs(post: BlogPost): BlogFaq[] {
  const primaryTool = getBlogRelatedTools(post)[0];
  return [
    {
      question: `Which FreeToolKit tool should I use after reading this guide?`,
      answer: primaryTool
        ? `Start with ${primaryTool.title}. It is the closest tool for the workflow covered in "${post.title}".`
        : "Start with the related tools listed on this guide and choose the one that matches your file, text, or calculation task."
    },
    {
      question: "Does this guide replace checking the final result?",
      answer: "No. Use the guide to choose a workflow, then review the output before submitting, publishing, emailing, or relying on the result."
    },
    {
      question: "Why does this page link to related tools and guides?",
      answer: "The links connect the guide to the practical tools and nearby topics, so you can move through the full workflow without searching again."
    }
  ];
}

export function getBlogRelatedTools(post: BlogPost): Tool[] {
  return post.relatedTools.map((slug) => getTool(slug)).filter((tool): tool is Tool => Boolean(tool));
}

export function getBlogRelatedToolLinks(post: BlogPost) {
  return getBlogRelatedTools(post).map((tool) => ({
    ...tool,
    href: toolHref(tool)
  }));
}

export function getRelatedBlogPosts(post: BlogPost, limit = 3) {
  const clusterSlugs = getRelatedBlogSlugsForBlog(post.slug, limit);
  if (clusterSlugs.length) {
    return clusterSlugs.map((slug) => getBlogPost(slug)).filter((item): item is BlogPost => Boolean(item)).slice(0, limit);
  }

  const relatedToolSlugs = new Set(post.relatedTools);
  return blogPosts
    .filter((item) => item.slug !== post.slug)
    .map((item) => {
      const sharedTools = item.relatedTools.filter((slug) => relatedToolSlugs.has(slug)).length;
      const categoryMatch = item.category === post.category ? 2 : 0;
      return { item, score: sharedTools + categoryMatch };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}

export function getBlogPostsForTool(toolSlug: string, limit = 3) {
  const clusterSlugs = getBlogSlugsForTool(toolSlug, limit);
  const clusterPosts = clusterSlugs.map((slug) => getBlogPost(slug)).filter((item): item is BlogPost => Boolean(item));
  const directPosts = blogPosts.filter((post) => post.relatedTools.includes(toolSlug));
  return uniquePosts([...directPosts, ...clusterPosts]).slice(0, limit);
}

function uniquePosts(posts: BlogPost[]) {
  const seen = new Set<string>();
  return posts.filter((post) => {
    if (seen.has(post.slug)) return false;
    seen.add(post.slug);
    return true;
  });
}

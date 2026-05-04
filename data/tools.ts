export type ToolCategory = "Image Tools" | "PDF Tools" | "Student Tools";

export type Tool = {
  slug: string;
  title: string;
  category: ToolCategory;
  description: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  popular?: boolean;
  howToUse: string[];
  features: string[];
  faq: Array<{ question: string; answer: string }>;
  seo: string[];
};

const privacyNote =
  "Your files are processed in your browser where possible. FreeToolKit does not require sign-up, payment, or a server upload workflow for these tools.";

export const tools: Tool[] = [
  {
    slug: "image-compressor",
    title: "Image Compressor",
    category: "Image Tools",
    popular: true,
    description: "Compress JPG, PNG, and WebP images in your browser with a simple quality slider.",
    intro: "Reduce image file size for websites, email, forms, and social sharing while keeping visual quality under your control.",
    metaTitle: "Free Image Compressor Online | Compress JPG, PNG & WebP",
    metaDescription: "Compress images online for free. Reduce JPG, PNG, and WebP file sizes in your browser with no signup and no paid API.",
    howToUse: ["Upload a JPG, PNG, or WebP image.", "Choose the compression quality.", "Click Compress and compare the result.", "Download the smaller image file."],
    features: ["Quality slider from 0.1 to 1", "Before and after previews", "File size and reduction percentage", privacyNote],
    faq: [
      { question: "Are my images uploaded?", answer: "The compressor uses browser APIs, so the image is handled locally where supported." },
      { question: "Which formats are supported?", answer: "Most modern browsers support JPG, PNG, and WebP input. Output keeps the original type when possible." },
      { question: "Will compression reduce quality?", answer: "Lower quality settings usually make smaller files but may add visible artifacts." },
      { question: "Can I use this for website images?", answer: "Yes. It is useful for reducing page weight before uploading images to a CMS or website builder." }
    ],
    seo: [
      "A free image compressor helps you reduce file size before uploading images to websites, school portals, forms, or email attachments. Large images can slow down pages and make sharing harder, especially on mobile connections. FreeToolKit keeps the process simple: choose an image, set a quality level, and download a smaller version.",
      "This tool is designed for privacy-friendly everyday use. Image work happens in the browser where possible, so you do not need to create an account or connect a paid API. For the best balance, start around 0.75 quality, review the preview, then lower the value only if you need a smaller result."
    ]
  },
  {
    slug: "png-to-jpg",
    title: "PNG to JPG Converter",
    category: "Image Tools",
    description: "Convert transparent or standard PNG images to JPG with a clean white background.",
    intro: "Turn PNG files into lightweight JPG images for forms, websites, and platforms that do not accept PNG uploads.",
    metaTitle: "PNG to JPG Converter Online Free",
    metaDescription: "Convert PNG to JPG online for free using your browser. Transparent PNG backgrounds are filled with white.",
    howToUse: ["Upload a PNG image.", "Preview the converted JPG.", "Download the JPG file."],
    features: ["Canvas-based conversion", "White background for transparency", "No signup required", privacyNote],
    faq: [
      { question: "What happens to transparency?", answer: "Transparent areas are filled with white because JPG does not support transparency." },
      { question: "Is the converter free?", answer: "Yes. You can convert PNG files without login or payment." },
      { question: "Can I convert large images?", answer: "Most large images work, but very high-resolution files depend on your device memory." },
      { question: "Why use JPG?", answer: "JPG is widely accepted and often smaller for photos or images without transparent backgrounds." }
    ],
    seo: [
      "PNG is excellent for screenshots, graphics, and transparency, but some upload forms and publishing tools prefer JPG. This free PNG to JPG converter creates a standard JPG file directly in your browser. Transparent areas are painted white so the final image looks clean on common document and web backgrounds.",
      "Use this tool when you need a smaller image format or when a website rejects PNG uploads. Because the conversion uses browser canvas features, it is fast for everyday image sizes and does not require installing image editing software."
    ]
  },
  {
    slug: "jpg-to-png",
    title: "JPG to PNG Converter",
    category: "Image Tools",
    description: "Convert JPG and JPEG images to PNG format in your browser.",
    intro: "Create PNG files from JPG photos or graphics when you need a lossless-friendly format for editing or sharing.",
    metaTitle: "JPG to PNG Converter Online Free",
    metaDescription: "Convert JPG and JPEG images to PNG online for free. Browser-based, private, and easy to use.",
    howToUse: ["Upload a JPG or JPEG file.", "Let the browser convert it to PNG.", "Download the new PNG image."],
    features: ["Supports JPG and JPEG input", "PNG download", "Browser-based conversion", privacyNote],
    faq: [
      { question: "Does JPG to PNG improve quality?", answer: "No. It changes the format but cannot restore detail lost in the original JPG compression." },
      { question: "Does PNG support transparency?", answer: "PNG supports transparency, but converting a normal JPG will not automatically create transparent areas." },
      { question: "Is this private?", answer: "The conversion is handled with browser canvas APIs where supported." },
      { question: "Why is the PNG larger?", answer: "PNG can be larger than JPG, especially for photos, because it stores image data differently." }
    ],
    seo: [
      "Converting JPG to PNG is useful when you need a PNG file for design tools, school assignments, forms, or workflows that require a specific file extension. This converter keeps the process direct: upload a JPEG image, generate a PNG, and download it.",
      "PNG is often preferred for screenshots, graphics, and images that may be edited again. Keep in mind that format conversion does not improve the original image quality; it simply creates a PNG version that may be easier to use in certain tools."
    ]
  },
  {
    slug: "webp-converter",
    title: "WebP Converter",
    category: "Image Tools",
    popular: true,
    description: "Convert JPG or PNG images to WebP with adjustable quality.",
    intro: "Create modern WebP images that can reduce page weight while preserving good visual quality.",
    metaTitle: "Free WebP Converter | Convert JPG & PNG to WebP",
    metaDescription: "Convert images to WebP online for free. Use a browser-based JPG and PNG to WebP converter with quality control.",
    howToUse: ["Upload a JPG or PNG image.", "Choose your WebP quality.", "Convert and preview the file.", "Download the WebP image."],
    features: ["JPG and PNG input", "Adjustable WebP quality", "Preview and download", privacyNote],
    faq: [
      { question: "Why convert to WebP?", answer: "WebP often creates smaller files than JPG or PNG while maintaining good quality." },
      { question: "Do all browsers support WebP?", answer: "Modern browsers support WebP, but very old browsers may not." },
      { question: "Can WebP be transparent?", answer: "WebP supports transparency, though output depends on the source and browser encoder." },
      { question: "Is this good for SEO?", answer: "Smaller image files can improve page speed, which supports a better user experience." }
    ],
    seo: [
      "WebP is a modern image format commonly used to improve website performance. This free converter helps create WebP versions of JPG and PNG files without installing a desktop editor. Adjust the quality slider to find the right balance between sharpness and file size.",
      "For blogs, portfolios, landing pages, and ecommerce sites, WebP images can reduce page load time. Always preview converted files before publishing, especially images with text, fine lines, or product details."
    ]
  },
  {
    slug: "image-resizer",
    title: "Image Resizer",
    category: "Image Tools",
    description: "Resize images by width and height, with an option to maintain aspect ratio.",
    intro: "Change image dimensions for profile photos, application forms, websites, and document uploads.",
    metaTitle: "Image Resizer Online Free | Resize JPG, PNG & WebP",
    metaDescription: "Resize images online for free. Set width and height, keep aspect ratio, preview, and download from your browser.",
    howToUse: ["Upload an image.", "Enter the target width or height.", "Keep aspect ratio enabled if needed.", "Resize and download the result."],
    features: ["Custom width and height", "Maintain aspect ratio option", "Canvas-based output", privacyNote],
    faq: [
      { question: "What is aspect ratio?", answer: "Aspect ratio is the relationship between width and height. Keeping it prevents stretched images." },
      { question: "Can I resize for social media?", answer: "Yes. Enter the required dimensions for the platform or template." },
      { question: "Will resizing reduce file size?", answer: "Often yes, especially when making large images smaller." },
      { question: "Can I enlarge images?", answer: "You can, but enlarging may make images look soft or pixelated." }
    ],
    seo: [
      "An online image resizer is useful when a form, website, or assignment asks for exact pixel dimensions. Instead of opening complex editing software, you can upload an image, enter a width and height, and download a resized copy.",
      "Keep aspect ratio turned on for portraits, product photos, and screenshots unless you intentionally need an exact stretched size. Resizing large photos before uploading can also reduce bandwidth and speed up publishing workflows."
    ]
  },
  {
    slug: "merge-pdf",
    title: "Merge PDF",
    category: "PDF Tools",
    popular: true,
    description: "Combine multiple PDF files into one downloadable PDF in your browser.",
    intro: "Merge reports, receipts, assignments, forms, and scanned documents into a single organized PDF.",
    metaTitle: "Merge PDF Online Free | Combine PDF Files",
    metaDescription: "Merge PDF files online for free using pdf-lib in your browser. No signup, no paid API, and no backend upload required.",
    howToUse: ["Upload two or more PDF files.", "Review the listed order.", "Click Merge PDFs.", "Download the combined file."],
    features: ["Multiple PDF upload", "Order shown before merging", "pdf-lib client-side processing", privacyNote],
    faq: [
      { question: "Can I reorder PDFs?", answer: "This version merges files in the order shown after upload. Select files in the order you want them combined." },
      { question: "Are PDFs uploaded?", answer: "The merge action runs in the browser with pdf-lib where possible." },
      { question: "Will bookmarks be preserved?", answer: "Basic pages are preserved, but advanced metadata or bookmarks may vary." },
      { question: "Is there a file limit?", answer: "There is no account limit, but your browser memory affects very large files." }
    ],
    seo: [
      "Merging PDFs is a common task for school, business, tax documents, applications, and personal records. FreeToolKit combines selected PDF pages into a new document using browser-side PDF tools, making the workflow quick and private for everyday files.",
      "For best results, choose PDFs in the exact order you want them to appear. Very large scanned PDFs can take longer because they contain image-heavy pages, but ordinary documents usually merge quickly on modern devices."
    ]
  },
  {
    slug: "split-pdf",
    title: "Split PDF",
    category: "PDF Tools",
    description: "Create a new PDF from selected page ranges such as 1-3,5,7-9.",
    intro: "Split a PDF by extracting only the pages you need into a separate file.",
    metaTitle: "Split PDF Online Free | Extract Page Ranges",
    metaDescription: "Split PDF files online for free. Enter page ranges and download selected pages as a new PDF in your browser.",
    howToUse: ["Upload a PDF.", "Enter page ranges like 1-3,5.", "Generate the split PDF.", "Download the selected pages."],
    features: ["Flexible page range input", "Creates a new PDF", "Useful for forms and assignments", privacyNote],
    faq: [
      { question: "What range format can I use?", answer: "Use commas and hyphens, such as 1-3,5,8-10." },
      { question: "Can I remove pages?", answer: "Yes. Enter only the pages you want to keep in the new PDF." },
      { question: "Does this change the original file?", answer: "No. The original file remains untouched on your device." },
      { question: "Can I split scanned PDFs?", answer: "Yes, if the PDF can be loaded by your browser and pdf-lib." }
    ],
    seo: [
      "A PDF splitter is helpful when you only need part of a long document. You might extract assignment pages, a signed form, a receipt, or a few chapters from a larger PDF. This tool uses a simple range format so you can create a smaller PDF with the exact pages you choose.",
      "The original file is not edited. FreeToolKit creates a new PDF from copied pages, so you can safely repeat the process with different page ranges until the output is right."
    ]
  },
  {
    slug: "compress-pdf",
    title: "Compress PDF",
    category: "PDF Tools",
    description: "Optimize a PDF by rebuilding it in the browser and comparing file size.",
    intro: "Reduce PDF overhead where possible. Browser compression may help with structure and metadata, but scanned PDFs may not shrink heavily.",
    metaTitle: "Compress PDF Online Free | Browser PDF Optimizer",
    metaDescription: "Compress or optimize PDFs online for free. Rebuild PDF structure in the browser and compare original and new file size.",
    howToUse: ["Upload a PDF.", "Click Optimize PDF.", "Compare original and optimized size.", "Download the rebuilt PDF."],
    features: ["Client-side PDF rebuild", "Original and new size display", "No fake compression promises", privacyNote],
    faq: [
      { question: "Why did my PDF not get much smaller?", answer: "Scanned PDFs are usually large because of embedded images, which browser-side rebuilding may not recompress." },
      { question: "Is this real compression?", answer: "It is a lightweight optimization pass that can reduce metadata or structural overhead in some PDFs." },
      { question: "Will quality change?", answer: "This tool copies PDF pages, so visual quality generally stays the same." },
      { question: "Can I use it for sensitive files?", answer: "The tool is intended to run locally in your browser where supported." }
    ],
    seo: [
      "PDF compression can mean different things. Some tools recompress every image, while lightweight browser tools can rebuild a PDF and remove unnecessary overhead. FreeToolKit is transparent about that limitation: it may reduce some PDFs, but scanned image-heavy files may remain similar in size.",
      "Use this optimizer before emailing a PDF or uploading to a form with a file limit. If the result is not small enough, the document probably needs image downsampling or scan-quality changes before it is saved as a PDF."
    ]
  },
  {
    slug: "rotate-pdf",
    title: "Rotate PDF",
    category: "PDF Tools",
    description: "Rotate every page in a PDF by 90, 180, or 270 degrees.",
    intro: "Fix sideways scanned documents and pages saved in the wrong orientation.",
    metaTitle: "Rotate PDF Online Free | Rotate All Pages",
    metaDescription: "Rotate PDF pages online for free. Choose 90, 180, or 270 degrees and download a corrected PDF.",
    howToUse: ["Upload a PDF.", "Choose a rotation angle.", "Apply rotation to all pages.", "Download the rotated PDF."],
    features: ["90, 180, and 270 degree rotation", "Applies to every page", "Browser-based PDF editing", privacyNote],
    faq: [
      { question: "Can I rotate one page only?", answer: "This tool applies the selected rotation to all pages for a quick orientation fix." },
      { question: "Does rotation change text quality?", answer: "No. It updates page rotation rather than rasterizing the PDF." },
      { question: "Can I rotate scanned documents?", answer: "Yes. Scanned PDFs can be rotated if the file loads successfully." },
      { question: "Is the original PDF overwritten?", answer: "No. You download a new rotated copy." }
    ],
    seo: [
      "Sideways PDFs are common when documents are scanned quickly or exported from mobile apps. This rotate PDF tool lets you correct orientation by applying 90, 180, or 270 degree rotation to every page and downloading a new file.",
      "Because the tool adjusts PDF page rotation instead of turning pages into images, the output stays crisp in normal cases. It is useful for forms, notes, contracts, invoices, and class handouts."
    ]
  },
  {
    slug: "extract-pdf-pages",
    title: "Extract PDF Pages",
    category: "PDF Tools",
    description: "Extract specific pages or ranges from a PDF into a new file.",
    intro: "Select exact pages from a PDF and save them as a separate document.",
    metaTitle: "Extract PDF Pages Online Free",
    metaDescription: "Extract pages from PDF files online for free. Enter pages or ranges and download a new PDF from your browser.",
    howToUse: ["Upload a PDF.", "Enter pages or ranges.", "Extract pages.", "Download the new PDF."],
    features: ["Single pages and ranges", "New PDF output", "Works without login", privacyNote],
    faq: [
      { question: "Is this different from splitting a PDF?", answer: "It is similar, but focused on pulling selected pages into a new file." },
      { question: "Can I extract non-consecutive pages?", answer: "Yes. Use commas, such as 2,5,9-11." },
      { question: "Will page order follow my range?", answer: "Yes. Pages are copied in the order you enter." },
      { question: "Does this delete pages?", answer: "No. It creates a new PDF and leaves the original untouched." }
    ],
    seo: [
      "Extracting PDF pages lets you create a clean, smaller document from only the pages that matter. It is useful for sending a single form page, saving a chapter, or sharing a receipt without including the whole file.",
      "Enter page numbers in a natural range format, then download the extracted PDF. The original document stays on your device unchanged, and the selected pages are copied into a new file."
    ]
  },
  {
    slug: "gpa-calculator",
    title: "GPA Calculator",
    category: "Student Tools",
    popular: true,
    description: "Calculate weighted GPA from course credits and letter grades.",
    intro: "Add your courses, credit hours, and grades to calculate your GPA using a common 4.0 scale.",
    metaTitle: "GPA Calculator Free | Weighted College GPA",
    metaDescription: "Calculate GPA online for free with course rows, credit hours, and letter grades on a 4.0 scale.",
    howToUse: ["Add one row for each course.", "Enter credit hours.", "Choose the letter grade.", "Click Calculate GPA."],
    features: ["Weighted by credit hours", "Common 4.0 grade mapping", "Add and remove rows", "Formula shown with result"],
    faq: [
      { question: "What grade scale is used?", answer: "The calculator uses A+ and A as 4.0, A- as 3.7, B+ as 3.3, and continues down to F as 0." },
      { question: "Is this official?", answer: "It is an estimate. Always compare with your school policy because grading systems vary." },
      { question: "Why use credit hours?", answer: "Courses with more credits have more weight in the final GPA." },
      { question: "Can I leave course names blank?", answer: "Yes. Course names are optional and only help you organize rows." }
    ],
    seo: [
      "A GPA calculator helps students estimate academic performance before final transcripts are released. Add each course, enter the credit hours, select the grade, and FreeToolKit calculates a weighted result using a common 4.0 scale.",
      "Because universities and schools sometimes use different grading rules, treat the result as a planning estimate. It is still useful for setting goals, comparing semester outcomes, and understanding how high-credit courses affect your average."
    ]
  },
  {
    slug: "cgpa-calculator",
    title: "CGPA Calculator",
    category: "Student Tools",
    description: "Calculate updated CGPA from previous CGPA, completed credits, current GPA, and current credits.",
    intro: "Estimate your cumulative GPA after adding your current semester results.",
    metaTitle: "CGPA Calculator Free | Cumulative GPA Formula",
    metaDescription: "Calculate new CGPA online using previous CGPA, completed credits, current semester GPA, and current semester credits.",
    howToUse: ["Enter your previous CGPA.", "Enter completed credits.", "Enter current semester GPA and credits.", "Calculate the updated CGPA."],
    features: ["Uses weighted cumulative formula", "Instant result", "Simple student-friendly inputs", "No account required"],
    faq: [
      { question: "What formula is used?", answer: "((previous CGPA * completed credits) + (current GPA * current credits)) / total credits." },
      { question: "Can this predict graduation CGPA?", answer: "It can estimate future CGPA if you enter projected semester GPA values." },
      { question: "What if I have no previous credits?", answer: "Use the GPA calculator for a first semester or enter 0 completed credits." },
      { question: "Is CGPA the same everywhere?", answer: "No. Institutions may use different scales, so check your official handbook." }
    ],
    seo: [
      "CGPA shows your cumulative performance across semesters. This calculator combines your previous CGPA and completed credits with your current semester GPA and credits, then returns the new weighted cumulative result.",
      "Students can use it to plan targets before grades are final. Try different current GPA values to understand what score you need to reach a scholarship, program, or graduation requirement."
    ]
  },
  {
    slug: "grade-percentage-calculator",
    title: "Grade Percentage Calculator",
    category: "Student Tools",
    description: "Calculate percentage and grade label from marks obtained and total marks.",
    intro: "Add one or more assessments to calculate your total percentage and a simple grade label.",
    metaTitle: "Grade Percentage Calculator Free",
    metaDescription: "Calculate grade percentage online from obtained marks and total marks. Supports multiple assessment rows.",
    howToUse: ["Enter marks obtained and total marks.", "Add more rows for multiple assessments.", "Click Calculate.", "Review percentage and grade label."],
    features: ["Multiple assessment rows", "A to F grade label", "Total marks calculation", "Clear percentage result"],
    faq: [
      { question: "What grade labels are used?", answer: "90+ is A, 80-89 is B, 70-79 is C, 60-69 is D, and below 60 is F." },
      { question: "Can I add assignments and exams together?", answer: "Yes. Add each assessment row with obtained and total marks." },
      { question: "Does this support weighted grades?", answer: "This calculator totals raw marks. Weighted grading may require your class-specific weights." },
      { question: "Can totals be decimals?", answer: "Yes. Decimal marks are supported." }
    ],
    seo: [
      "The grade percentage calculator turns marks into an easy-to-read percentage. Add one row for a single test or multiple rows for assignments, quizzes, and exams. The calculator totals obtained marks and total possible marks before assigning a simple grade label.",
      "This is helpful for quick study planning, but grade boundaries vary by school, country, and course. Use the label as a general guide unless your instructor provides exact cutoffs."
    ]
  },
  {
    slug: "study-timer",
    title: "Study Timer",
    category: "Student Tools",
    popular: true,
    description: "Use a simple Pomodoro timer with custom focus and break durations.",
    intro: "Stay focused with a browser-based study timer that alternates focus sessions and breaks.",
    metaTitle: "Study Timer Free | Pomodoro Focus Timer",
    metaDescription: "Use a free online study timer with 25-minute focus sessions, 5-minute breaks, pause, reset, and custom durations.",
    howToUse: ["Set focus and break minutes.", "Start the timer.", "Pause or reset when needed.", "Switch between focus and break mode."],
    features: ["25/5 default Pomodoro timing", "Custom durations", "Progress bar", "No login or tracking required"],
    faq: [
      { question: "What is the Pomodoro method?", answer: "It is a focus technique that alternates timed work sessions with short breaks." },
      { question: "Can I change the duration?", answer: "Yes. Set custom focus and break minutes before starting." },
      { question: "Does it keep running if I close the tab?", answer: "No. Keep the browser tab open while studying." },
      { question: "Do I need an account?", answer: "No. The timer works without login." }
    ],
    seo: [
      "A study timer can make work sessions feel more manageable. The classic Pomodoro pattern uses 25 minutes of focus followed by a 5 minute break, but you can adjust the timing to match your attention span, subject, or exam schedule.",
      "Use this timer for reading, problem sets, writing, revision, coding practice, or deep work. Keeping the tool simple helps you start quickly without dashboards, accounts, or distractions."
    ]
  },
  {
    slug: "word-counter",
    title: "Word Counter",
    category: "Student Tools",
    popular: true,
    description: "Count words, characters, sentences, paragraphs, and estimated reading or speaking time.",
    intro: "Paste text to instantly measure length for essays, posts, assignments, and scripts.",
    metaTitle: "Word Counter Free | Count Words & Characters",
    metaDescription: "Count words, characters, sentences, paragraphs, reading time, and speaking time online for free.",
    howToUse: ["Paste or type text.", "Review live counts.", "Copy the text if needed.", "Clear the box to start again."],
    features: ["Words and characters", "Characters without spaces", "Sentences and paragraphs", "Reading and speaking time estimates"],
    faq: [
      { question: "How is word count calculated?", answer: "The tool splits text by whitespace and counts non-empty word groups." },
      { question: "What reading speed is used?", answer: "Reading time is estimated around 200 words per minute." },
      { question: "What speaking speed is used?", answer: "Speaking time is estimated around 130 words per minute." },
      { question: "Is my text saved?", answer: "No. The counter runs in your browser and does not require an account." }
    ],
    seo: [
      "Word counters are useful for essays, reports, blog posts, metadata, speeches, applications, and social content. FreeToolKit counts words and characters instantly as you type, helping you stay within limits without opening a separate editor.",
      "The tool also estimates reading and speaking time, which is helpful for presentations, videos, podcasts, and classroom speeches. Counts are estimates based on common text rules, so always follow any special instructions from your teacher, publisher, or platform."
    ]
  }
];

export const categories: ToolCategory[] = ["Image Tools", "PDF Tools", "Student Tools"];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: ToolCategory) {
  return tools.filter((tool) => tool.category === category);
}

export function getRelatedTools(tool: Tool) {
  return tools.filter((item) => item.category === tool.category && item.slug !== tool.slug).slice(0, 4);
}

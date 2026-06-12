import type { Tool } from "./tools";

type HighTrafficInput = Omit<Tool, "seo"> & {
  primary: string;
  audience: string;
  does: string;
  when: string;
  workflow: string;
  benefit: string;
  caution: string;
  related: string;
};

function seo(input: HighTrafficInput) {
  return [
    `${input.title} is built for people who need a quick, reliable ${input.primary} without installing software, creating an account, or connecting a paid API. It helps ${input.audience} handle practical everyday work directly in the browser.`,
    `Use this tool when ${input.when}. ${input.does} freetoolkitapp keeps the workflow simple: ${input.workflow}.`,
    `Privacy and convenience matter. freetoolkitapp does not require signup. The tool runs in your browser, so inputs stay on your device for normal use.`,
    `${input.benefit} ${input.caution}`,
    `${input.related}`
  ];
}

function make(input: HighTrafficInput): Tool {
  const { primary, audience, does, when, workflow, benefit, caution, related, ...rest } = input;
  return { ...rest, seo: seo(input) };
}

export const highTrafficTools: Tool[] = [
  make({
    slug: "word-counter",
    title: "Word Counter",
    category: "Text Tools",
    popular: true,
    description: "Count words, characters, sentences, paragraphs, and reading time as you type. No signup, no limit.",
    intro: "Count words, characters, sentences, paragraphs, and reading time as you type. No signup, no limit.",
    metaTitle: "Word Counter Online Free — Count Words & Characters Instantly",
    metaDescription: "Free online word counter. Count words, characters, sentences, paragraphs and reading time instantly. No signup, no limit, works in your browser.",
    howToUse: [
      "Paste or type your text into the large textarea.",
      "Watch live stats update on every keystroke — no button needed.",
      "Review words, characters, sentences, paragraphs, and reading time.",
      "Check the keyword density table for your top repeated terms.",
      "Set an optional character limit (e.g. 280 for Twitter) and clear when finished."
    ],
    features: [
      "Live word and character counts",
      "Sentences, paragraphs, and reading time (238 wpm)",
      "Top 10 keyword density table with stopwords filtered",
      "Optional custom character limit with warning bar",
      "Runs entirely in your browser — no signup"
    ],
    useCases: [
      "Twitter/X posts within 280 characters",
      "College essays with word count requirements",
      "LinkedIn posts and professional updates",
      "Meta descriptions and SEO snippets",
      "Blog drafts and README documentation"
    ],
    tips: [
      "Reading time uses 238 words per minute — adjust mentally for dense technical writing.",
      "Keyword density above 3% for one term may signal over-optimization for SEO.",
      "Academic essays often target 1,500–2,500 words; blog posts 800–1,500.",
      "Set a character limit before drafting social posts to avoid painful cuts later."
    ],
    faq: [
      { question: "What is a good word count for a blog post?", answer: "Most informational blog posts land between 800 and 2,000 words. Focus on covering the topic fully rather than hitting an arbitrary number." },
      { question: "Do characters include spaces?", answer: "Yes. The tool shows both total characters and characters without spaces so you can match any platform rule." },
      { question: "How is reading time calculated?", answer: "Reading time divides word count by 238 words per minute and rounds up to the nearest minute." },
      { question: "Is my text uploaded?", answer: "No. Counting happens locally in your browser." },
      { question: "Can I set a custom character limit?", answer: "Yes. Enable the limit toggle and enter your target (280 for Twitter/X, 155 for meta descriptions, etc.)." }
    ],
    primary: "word counter",
    audience: "writers, students, marketers, and SEO editors",
    does: "It counts words, characters, sentences, and reading time instantly as you type.",
    when: "you need to meet word or character limits for essays, posts, ads, or metadata",
    workflow: "paste text, review live stats and keyword density, optionally set a limit, then copy or clear",
    benefit: "Live counts prevent last-minute trimming and help you hit platform limits on the first draft.",
    caution: "Some platforms count words differently (footnotes, citations). Always verify against the official counter before submitting.",
    related: "Try Character Counter for platform-specific limits, Case Converter for formatting, or Readability Checker for audience grade level."
  }),
  make({
    slug: "character-counter",
    title: "Character Counter",
    category: "Text Tools",
    popular: true,
    description: "Count characters instantly for Twitter, Instagram, SMS, and meta descriptions. Shows limits for every major platform.",
    intro: "Count characters instantly for Twitter, Instagram, SMS, and meta descriptions. Shows limits for every major platform.",
    metaTitle: "Character Counter Online Free — Count Characters Instantly",
    metaDescription: "Free character counter online. Count characters with and without spaces, for Twitter, Instagram, SMS, meta descriptions, and more. No signup required.",
    howToUse: [
      "Paste or type your text into the textarea.",
      "Review live totals for characters, characters without spaces, words, and lines.",
      "Check coloured progress bars for Twitter, Instagram, SMS, meta title, meta description, LinkedIn, and YouTube.",
      "Green means under limit, amber at 90%, red when over.",
      "Clear the field when finished."
    ],
    features: [
      "Live character, word, and line counts",
      "Platform limit bars: Twitter 280, Instagram 2200, SMS 160, meta title 60, meta description 155, LinkedIn 3000, YouTube title 100",
      "Colour-coded progress: green, amber at 90%, red over limit",
      "No signup — runs in your browser"
    ],
    useCases: [
      "Twitter/X and Threads posts",
      "Instagram captions and bios",
      "SMS and text message drafts",
      "SEO meta titles and descriptions",
      "YouTube video titles and LinkedIn updates"
    ],
    tips: [
      "Meta titles should stay under 60 characters to avoid truncation in Google results.",
      "SMS segments split at 160 characters — longer texts cost more on some carriers.",
      "Emojis may count as multiple characters on some platforms; verify before posting.",
      "Leave 10–15 characters of buffer on Twitter for link previews that add text."
    ],
    faq: [
      { question: "What is the Twitter/X character limit?", answer: "Posts allow up to 280 characters. Premium accounts may have higher limits, but 280 is the standard safe target." },
      { question: "How long can an Instagram caption be?", answer: "Instagram allows up to 2,200 characters, but only the first ~125 characters show before 'more'." },
      { question: "What is the ideal meta description length?", answer: "Aim for 150–155 characters. Google may rewrite longer descriptions in search results." },
      { question: "Do spaces count as characters?", answer: "Yes for total character count. The tool also shows characters without spaces." },
      { question: "Is my text saved?", answer: "No. Counting runs locally in your browser." }
    ],
    primary: "character counter",
    audience: "social media managers, SEO writers, and mobile texters",
    does: "It counts characters and compares your text against common platform limits with visual progress bars.",
    when: "you are drafting posts, captions, meta tags, or SMS messages with strict length rules",
    workflow: "type text, watch live counts and platform bars, trim until green, then copy",
    benefit: "Platform-specific bars remove guesswork so you never exceed limits mid-publish.",
    caution: "Platform limits change occasionally. Verify critical campaigns against the platform's current documentation.",
    related: "Use Word Counter for essay length, SERP Preview for search snippets, or Case Converter to shorten ALL CAPS drafts."
  }),
  make({
    slug: "qr-code-generator",
    title: "QR Code Generator",
    category: "Developer Tools",
    popular: true,
    description: "Generate QR codes for URLs, text, Wi-Fi passwords, email, and phone numbers. Download as PNG. No signup, no tracking.",
    intro: "Generate QR codes for URLs, text, Wi-Fi passwords, email, and phone numbers. Download as PNG. No signup, no tracking.",
    metaTitle: "QR Code Generator Free — Create QR Codes Online No Signup",
    metaDescription: "Free QR code generator online. Create QR codes for URLs, text, Wi-Fi, email, and phone numbers. Download PNG instantly. No signup, fully private.",
    howToUse: [
      "Choose input type: URL, Text, Wi-Fi, Email, or Phone.",
      "Fill in the fields for your chosen type.",
      "Adjust size (128–512px) and error correction level (L/M/Q/H).",
      "Preview the QR code — it updates live.",
      "Download the PNG and test with your phone camera before printing."
    ],
    features: [
      "URL, text, Wi-Fi, email, and phone input modes",
      "Live QR preview with adjustable size and error correction",
      "Download PNG instantly",
      "Generated in your browser — nothing sent to any server"
    ],
    useCases: [
      "Business cards and event posters",
      "Restaurant menus and Wi-Fi sharing",
      "Product packaging and contact pages",
      "Classroom handouts and conference badges"
    ],
    tips: [
      "Use error correction level H for printed materials that may get damaged.",
      "Keep Wi-Fi QR payloads short — long passwords create denser codes that scan slower.",
      "Test every QR code on iOS and Android before mass printing.",
      "Use high contrast (dark on light) for reliable scanning."
    ],
    faq: [
      { question: "Do QR codes expire?", answer: "Static QR codes do not expire. If the encoded URL breaks, the code still scans but leads nowhere." },
      { question: "What error correction level should I use?", answer: "L for clean digital screens, M for general use, Q/H for print or outdoor signage." },
      { question: "Can I encode Wi-Fi passwords?", answer: "Yes. Use Wi-Fi mode with SSID, password, and security type (WPA/WEP/None)." },
      { question: "Is generation private?", answer: "Yes. QR codes are rendered entirely in your browser." },
      { question: "What file format is the download?", answer: "PNG image. Resize in an image editor if you need vector (SVG) output." }
    ],
    primary: "QR code generator",
    audience: "small businesses, teachers, event organizers, and developers",
    does: "It converts URLs, text, Wi-Fi credentials, email, or phone data into a scannable QR code PNG.",
    when: "you need a quick scannable link or contact method on print or digital materials",
    workflow: "pick input type, enter data, preview, download PNG, test with a phone",
    benefit: "QR codes eliminate typing errors and speed up access to links and Wi-Fi networks.",
    caution: "Very long text creates dense QR codes that are harder to scan. Keep payloads concise.",
    related: "Use URL Encoder for link cleanup, Image Resizer before embedding in designs, or Password Generator for secure Wi-Fi passwords."
  }),
  make({
    slug: "password-generator",
    title: "Password Generator",
    category: "Developer Tools",
    popular: true,
    description: "Generate strong, random passwords with custom length and character sets. Everything runs in your browser — nothing is ever sent to a server.",
    intro: "Generate strong, random passwords with custom length and character sets. Everything runs in your browser — nothing is ever sent to a server.",
    metaTitle: "Password Generator Free — Strong Random Passwords No Signup",
    metaDescription: "Generate strong random passwords instantly. Customise length and character types. 100% browser-based — your password is never sent to any server. Free, no signup.",
    howToUse: [
      "Adjust the length slider (8–64 characters, default 16).",
      "Toggle uppercase, lowercase, numbers, and symbols.",
      "Click Generate or let the page auto-generate on load.",
      "Review the strength meter and copy the password.",
      "Generate multiple passwords if you need a batch for different accounts."
    ],
    features: [
      "Length slider 8–64 with crypto.getRandomValues()",
      "Uppercase, lowercase, numbers, and symbols toggles",
      "Strength meter: Very Weak through Very Strong",
      "Copy button and generate 5 passwords batch mode",
      "Never sent to any server"
    ],
    useCases: [
      "New account registrations",
      "Rotating compromised passwords",
      "API keys and development placeholders",
      "Shared Wi-Fi credentials for guests"
    ],
    tips: [
      "Use 16+ characters with all character types for important accounts.",
      "Store passwords in a trusted password manager — never reuse across sites.",
      "Passphrases (4+ random words) can be strong and memorable for low-risk accounts.",
      "Regenerate if a password looks hard to type on mobile."
    ],
    faq: [
      { question: "Are generated passwords truly random?", answer: "Yes. The tool uses crypto.getRandomValues(), the browser's cryptographically secure random source." },
      { question: "Is my password sent to a server?", answer: "No. Generation happens entirely in your browser." },
      { question: "How long should my password be?", answer: "At least 16 characters for important accounts. Longer is better when the site allows it." },
      { question: "Should I use symbols?", answer: "Yes, when allowed. Symbols increase the search space attackers must cover." },
      { question: "Can I generate multiple passwords?", answer: "Yes. Use the 'Generate 5 passwords' button for a batch list." }
    ],
    primary: "password generator",
    audience: "everyday users, developers, students, and small teams",
    does: "It creates random passwords with configurable length and character pools using secure browser randomness.",
    when: "you need a strong unique password for a new or compromised account",
    workflow: "set length and character types, generate, check strength, copy, store in a password manager",
    benefit: "Random passwords resist dictionary attacks and eliminate predictable patterns like names and dates.",
    caution: "A strong password only helps if you do not reuse it. Use a password manager for every important account.",
    related: "Try UUID Generator for identifiers, Base64 Encoder for encoding, or QR Code Generator to share Wi-Fi credentials."
  }),
  make({
    slug: "pomodoro-timer",
    title: "Pomodoro Timer",
    category: "Calculator Tools",
    description: "Stay focused with the Pomodoro technique. 25-minute work sessions, short and long breaks. Audio alerts, session counter, runs in your browser.",
    intro: "Stay focused with the Pomodoro technique. 25-minute work sessions, short and long breaks. Audio alerts, session counter, runs in your browser.",
    metaTitle: "Pomodoro Timer Online Free — Focus Timer No Download",
    metaDescription: "Free Pomodoro timer online. 25-minute focus sessions with short and long breaks. No download, no signup. Works in any browser with audio alerts.",
    howToUse: [
      "Choose Work (25 min), Short Break (5 min), or Long Break (15 min).",
      "Customize durations if the defaults do not fit your workflow.",
      "Press Start — the countdown begins and the browser tab title shows remaining time.",
      "Pause or Reset anytime. An audio beep plays when a session ends.",
      "After 4 work sessions, take the suggested long break."
    ],
    features: [
      "Work, short break, and long break modes",
      "Customizable session durations",
      "Audio alert via Web Audio API — no external files",
      "Browser tab title shows countdown",
      "Session counter and daily stats"
    ],
    useCases: [
      "Exam revision and homework blocks",
      "Writing and coding deep work",
      "Email batching without distraction",
      "Remote work focus sessions"
    ],
    tips: [
      "Decide your single task before pressing Start — context switching kills focus.",
      "Use short breaks to stand, stretch, and rest your eyes — not scroll social media.",
      "After 4 pomodoros, take a 15–30 minute long break for sustained productivity.",
      "Keep the browser tab open; closing it stops the timer."
    ],
    faq: [
      { question: "What is the Pomodoro technique?", answer: "It alternates focused work intervals (traditionally 25 minutes) with short breaks to maintain concentration and reduce burnout." },
      { question: "Does the timer work in the background?", answer: "The tab must stay open. The browser tab title updates so you can glance at remaining time." },
      { question: "Can I change session lengths?", answer: "Yes. Customize work, short break, and long break minutes in the settings inputs." },
      { question: "Will I hear an alert when time is up?", answer: "Yes. A beep plays using the Web Audio API when a session completes." },
      { question: "Do I need to sign up?", answer: "No. The timer runs entirely in your browser." }
    ],
    primary: "Pomodoro timer",
    audience: "students, writers, developers, and remote workers",
    does: "It counts down focused work and break intervals with audio alerts and session tracking.",
    when: "you need structure to start deep work and take regular breaks",
    workflow: "pick mode, start timer, work until beep, take break, repeat",
    benefit: "Time-boxing makes large tasks approachable and builds a sustainable focus habit.",
    caution: "The timer resets if you close the tab. Keep one tab open for the full study or work block.",
    related: "Pair with Typing Speed Test for keyboard practice, Study Timer for alternate intervals, or Word Counter for writing goals."
  }),
  make({
    slug: "case-converter",
    title: "Case Converter",
    category: "Text Tools",
    description: "Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case. One click, instant results.",
    intro: "Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, and kebab-case. One click, instant results.",
    metaTitle: "Case Converter Online Free — UPPER, lower, Title Case & More",
    metaDescription: "Free online case converter. Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case instantly. No signup.",
    howToUse: [
      "Paste or type text into the textarea.",
      "Click a conversion button: UPPER, lower, Title, Sentence, camelCase, PascalCase, snake_case, or kebab-case.",
      "The textarea updates instantly with the converted text.",
      "Copy the result or clear to start over.",
      "Check word and character counts below the textarea."
    ],
    features: [
      "8 case formats including camelCase, PascalCase, snake_case, kebab-case",
      "Instant one-click conversion",
      "Copy and clear buttons",
      "Live word and character count"
    ],
    useCases: [
      "JavaScript variable naming (camelCase, PascalCase)",
      "Database column names (snake_case)",
      "URL slugs and CSS classes (kebab-case)",
      "Headlines and document titles (Title Case)"
    ],
    tips: [
      "Use camelCase for JavaScript variables and PascalCase for React components.",
      "snake_case is standard in Python and SQL column names.",
      "kebab-case works well for URLs, HTML ids, and CSS class names.",
      "Review Title Case output — brand names and acronyms may need manual fixes."
    ],
    faq: [
      { question: "What is camelCase?", answer: "Words are joined without spaces; the first word is lowercase and subsequent words are capitalized. Example: myVariableName." },
      { question: "What is the difference between camelCase and PascalCase?", answer: "PascalCase capitalizes the first word too. Example: MyClassName vs myClassName." },
      { question: "When should I use snake_case?", answer: "Common in Python, Ruby, and database schemas. Example: user_profile_id." },
      { question: "Does it handle special characters?", answer: "Conversion focuses on letter casing and word boundaries. Punctuation is largely preserved." },
      { question: "Is conversion instant?", answer: "Yes. Click a button and the textarea updates immediately." }
    ],
    primary: "case converter",
    audience: "developers, writers, and data entry workers",
    does: "It transforms text between eight common casing formats with one click.",
    when: "pasted text has wrong capitalization or you need code-style naming conventions",
    workflow: "paste text, click the target case format, copy the result",
    benefit: "Saves manual retyping when cleaning headings, labels, or code identifiers.",
    caution: "Automated Title Case may not recognize every proper noun or acronym. Review before publishing.",
    related: "Use Word Counter for length checks, Remove Extra Spaces for cleanup, or JSON Formatter for code data."
  }),
  make({
    slug: "random-number-generator",
    title: "Random Number Generator",
    category: "Calculator Tools",
    popular: true,
    description: "Generate random numbers between any min and max. Pick multiple unique numbers, roll dice, or draw from a custom list.",
    intro: "Generate random numbers between any min and max. Pick multiple unique numbers, roll dice, or draw from a custom list.",
    metaTitle: "Random Number Generator Free — Pick Random Numbers Online",
    metaDescription: "Free random number generator. Set min and max range, generate one or multiple numbers, pick from a list, or simulate dice rolls. No signup required.",
    howToUse: [
      "Choose a mode: Number Range, Multiple Numbers, Dice Roll, or List Picker.",
      "Set min/max, dice type, or paste a list (one item per line).",
      "Click Generate or Roll.",
      "Review results and the last 10 history entries for range mode.",
      "Generate again for a new random outcome."
    ],
    features: [
      "Number range with history of last 10 results",
      "Multiple unique or duplicate numbers from a range",
      "Dice roller: d4, d6, d8, d10, d12, d20, d100 with totals",
      "List picker for random item selection",
      "crypto.getRandomValues() for true randomness"
    ],
    useCases: [
      "Classroom number games and statistics demos",
      "Tabletop RPG dice rolls",
      "Giveaway and lottery number picks",
      "Random team or task assignment from a list"
    ],
    tips: [
      "For unique draws, ensure 'How many?' does not exceed the range size.",
      "d100 rolls use percentile dice logic (1–100).",
      "List picker ignores blank lines — one item per line.",
      "True random means repeats are possible when duplicates are allowed."
    ],
    faq: [
      { question: "Is this truly random?", answer: "Yes. The tool uses crypto.getRandomValues(), not Math.random(), for cryptographically secure random integers." },
      { question: "Can I pick multiple unique numbers?", answer: "Yes. Use Multiple Numbers mode, disable duplicates, and set how many numbers you need." },
      { question: "What dice are supported?", answer: "d4, d6, d8, d10, d12, d20, and d100. Roll 1–10 dice at once." },
      { question: "How does list picker work?", answer: "Enter items one per line, then pick 1 or N random items from the list." },
      { question: "Is there a history?", answer: "Number Range mode shows your last 10 generated results." }
    ],
    primary: "random number generator",
    audience: "teachers, gamers, stat students, and giveaway organizers",
    does: "It generates random integers, dice rolls, and list picks using secure browser randomness.",
    when: "you need unbiased random selection for games, teaching, or decisions",
    workflow: "choose mode, set parameters, generate, read results",
    benefit: "Eliminates human bias in random selection for fair games and demos.",
    caution: "This is not certified for regulated gambling or security-critical lotteries.",
    related: "Use Percentage Calculator for odds, Scientific Calculator for math, or Password Generator for secure tokens."
  }),
  make({
    slug: "invoice-generator",
    title: "Invoice Generator",
    category: "Student Tools",
    popular: true,
    description: "Create professional invoices and download as PDF. No signup, no watermark, no server uploads. Perfect for freelancers and small businesses.",
    intro: "Create professional invoices and download as PDF. No signup, no watermark, no server uploads. Perfect for freelancers and small businesses.",
    metaTitle: "Invoice Generator Free — Create & Download PDF Invoices Online",
    metaDescription: "Free online invoice generator. Create professional invoices and download as PDF instantly. No signup, no watermark, fully browser-based. Perfect for freelancers.",
    howToUse: [
      "Fill in your business details in the FROM section.",
      "Enter client information in the TO section.",
      "Set invoice number, dates, and currency.",
      "Add line items with description, quantity, and unit price.",
      "Set tax and discount percentages, add notes, preview, and download PDF."
    ],
    features: [
      "Full invoice form: from, to, dates, currency (USD/EUR/GBP/INR/AUD/CAD)",
      "Dynamic line items with auto-calculated totals",
      "Tax and discount percentage support",
      "Live preview panel on desktop",
      "PDF download via jsPDF — no server upload"
    ],
    useCases: [
      "Freelance design and development invoices",
      "Consulting and coaching billing",
      "Small business one-off invoices",
      "India GST-ready itemized billing (add GSTIN in notes)"
    ],
    tips: [
      "Use sequential invoice numbers (INV-001, INV-002) for clean bookkeeping.",
      "Include payment terms and due date clearly — default is 30 days from invoice date.",
      "For India GST, note your GSTIN and HSN/SAC codes in the notes field.",
      "Save a copy of every PDF before sending to clients."
    ],
    faq: [
      { question: "Is the invoice PDF generated locally?", answer: "Yes. PDF creation uses jsPDF in your browser. No data is uploaded." },
      { question: "Is there a watermark?", answer: "No. Downloaded PDFs are clean with no freetoolkitapp watermark." },
      { question: "Which currencies are supported?", answer: "USD, EUR, GBP, INR, AUD, and CAD with appropriate symbol display." },
      { question: "Can I add multiple line items?", answer: "Yes. Add and remove rows dynamically. Totals update automatically." },
      { question: "Is this suitable for GST invoices in India?", answer: "You can itemize services and add GSTIN and tax notes. Consult your accountant for formal GST compliance." }
    ],
    primary: "invoice generator",
    audience: "freelancers, small businesses, and student entrepreneurs",
    does: "It builds a professional invoice from your form inputs and exports a PDF locally.",
    when: "you need a quick invoice without accounting software or signup",
    workflow: "fill form, preview totals, download PDF, send to client",
    benefit: "Professional PDF invoices in minutes with no subscription or watermark.",
    caution: "Review tax, legal, and numbering requirements for your jurisdiction before sending.",
    related: "Use Loan EMI Calculator for payment planning, Percentage Calculator for tax math, or Word to PDF for simple documents."
  }),
  make({
    slug: "typing-speed-test",
    title: "Typing Speed Test",
    category: "Calculator Tools",
    description: "Measure your typing speed in WPM and accuracy. Choose 1, 2, 3, or 5 minute tests. Instant results, no signup, works in any browser.",
    intro: "Measure your typing speed in WPM and accuracy. Choose 1, 2, 3, or 5 minute tests. Instant results, no signup, works in any browser.",
    metaTitle: "Typing Speed Test Free — Check Your WPM Online",
    metaDescription: "Free typing speed test online. Measure your WPM (words per minute) and accuracy. Multiple durations: 1, 2, 3, and 5 minute tests. No signup required.",
    howToUse: [
      "Select test duration: 1, 2, 3, or 5 minutes.",
      "Read the prompt paragraph above the input field.",
      "Start typing — the timer begins on your first keystroke.",
      "Watch live WPM, accuracy, errors, and time remaining.",
      "Review your results card when the timer ends and click Try Again for a new paragraph."
    ],
    features: [
      "1, 2, 3, and 5 minute test durations",
      "5+ varied practice paragraphs rotated randomly",
      "Live WPM, accuracy, errors, and countdown",
      "Character highlighting: correct green, wrong red",
      "Performance rating from Beginner to Expert"
    ],
    useCases: [
      "Job applicants practicing for typing tests",
      "Students improving keyboard speed",
      "Developers measuring coding-adjacent typing speed",
      "Remote workers benchmarking productivity"
    ],
    tips: [
      "Touch typing (home row) beats hunt-and-peck for speed and accuracy.",
      "Accuracy above 95% matters more than raw speed for professional work.",
      "Practice daily in 10-minute blocks for measurable improvement.",
      "Net WPM penalizes errors — slow down slightly to reduce mistakes."
    ],
    faq: [
      { question: "What is WPM?", answer: "Words per minute — typically (characters typed ÷ 5) ÷ minutes elapsed. It is the standard typing speed metric." },
      { question: "What is a good typing speed?", answer: "40 WPM is average, 60–80 is good for office work, 100+ is fast, 120+ is expert level." },
      { question: "How is accuracy calculated?", answer: "Correct characters divided by total characters typed, shown as a percentage." },
      { question: "What is net WPM?", answer: "Gross WPM minus a penalty for errors, giving a more realistic productivity score." },
      { question: "Does the test start automatically?", answer: "The countdown begins on your first keystroke, not when the page loads." }
    ],
    primary: "typing speed test",
    audience: "students, job seekers, and office workers",
    does: "It measures words per minute and accuracy while you type a timed prompt paragraph.",
    when: "you want to benchmark or improve your keyboard typing speed",
    workflow: "pick duration, type the prompt, review WPM and accuracy, try again",
    benefit: "Regular timed tests reveal progress and motivate consistent practice.",
    caution: "Browser-based tests may differ slightly from employer-certified typing exams.",
    related: "Use Pomodoro Timer for practice blocks, Word Counter for writing volume, or Case Converter for text cleanup."
  }),
  make({
    slug: "readability-checker",
    title: "Readability Checker",
    category: "Text Tools",
    description: "Check how readable your text is. Get Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog Index, and SMOG score. Instant, no signup.",
    intro: "Check how readable your text is. Get Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog Index, and SMOG score. Instant, no signup.",
    metaTitle: "Readability Checker Free — Flesch Score & Grade Level Online",
    metaDescription: "Free readability checker. Get Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog, and SMOG scores. Paste your text and check readability instantly.",
    howToUse: [
      "Paste at least 100 words for accurate readability scores.",
      "Click Check Readability.",
      "Review four score cards: Flesch Reading Ease, Flesch-Kincaid Grade, Gunning Fog, and SMOG.",
      "Read the text stats summary and improvement suggestions.",
      "Edit your text and re-check until scores match your audience."
    ],
    features: [
      "Flesch Reading Ease (0–100) with colour-coded labels",
      "Flesch-Kincaid Grade Level",
      "Gunning Fog Index",
      "SMOG Grade",
      "Actionable suggestions for long sentences and complex words"
    ],
    useCases: [
      "Blog posts targeting general audiences (Flesch 60–70)",
      "Academic papers and legal text (lower scores expected)",
      "Marketing copy and landing pages",
      "Children's content and educational materials (Flesch 80+)"
    ],
    tips: [
      "Blog posts for general audiences aim for Flesch 60–70 (8th–9th grade).",
      "Shorter sentences (under 20 words average) improve most scores.",
      "Replace jargon with plain language when writing for non-experts.",
      "Re-check after edits — small changes can shift grade level significantly."
    ],
    faq: [
      { question: "What is a good Flesch Reading Ease score?", answer: "60–70 is standard for web content. 80+ is easy (children). Below 50 is difficult (academic/legal)." },
      { question: "What does Flesch-Kincaid Grade mean?", answer: "It estimates the U.S. school grade level needed to understand the text. Grade 8 means readable by an 8th grader." },
      { question: "How many words do I need?", answer: "At least 100 words for reliable scores. SMOG especially needs adequate sentence count." },
      { question: "What is Gunning Fog?", answer: "It estimates years of formal education needed. It weights complex words (3+ syllables) heavily." },
      { question: "Is analysis done locally?", answer: "Yes. All formulas run in your browser." }
    ],
    primary: "readability checker",
    audience: "writers, marketers, teachers, and content editors",
    does: "It calculates four standard readability formulas and suggests improvements.",
    when: "you need to match text complexity to your target audience",
    workflow: "paste text, check scores, apply suggestions, re-check",
    benefit: "Objective scores help you write clearly for your actual readers, not your expertise level.",
    caution: "Readability formulas are guides, not rules. Technical topics may legitimately score lower.",
    related: "Use Word Counter for length, Grammar Fixer for clarity, or Case Converter for headline formatting."
  }),
  make({
    slug: "markdown-to-html",
    title: "Markdown to HTML Converter",
    category: "Developer Tools",
    popular: true,
    description: "Convert Markdown to clean HTML with live preview. Supports headings, bold, italic, tables, code blocks, blockquotes, and links. All in your browser.",
    intro: "Convert Markdown to clean HTML with live preview. Supports headings, bold, italic, tables, code blocks, blockquotes, and links. All in your browser.",
    metaTitle: "Markdown to HTML Converter Free — Live Preview Online",
    metaDescription: "Free Markdown to HTML converter with live preview. Paste Markdown and get clean HTML instantly. Supports headings, tables, code blocks, links. No signup.",
    howToUse: [
      "Paste Markdown into the left pane (or click Sample Markdown).",
      "Toggle the right pane between Preview and raw HTML.",
      "Edit Markdown and watch live updates.",
      "Copy HTML or download as an .html file.",
      "Clear to start a new conversion."
    ],
    features: [
      "Split-pane editor with live preview on desktop, tabs on mobile",
      "Headings, bold, italic, code, tables, blockquotes, lists, links, images, HR",
      "Copy HTML and download .html file",
      "Sample Markdown demo button",
      "Runs entirely in your browser"
    ],
    useCases: [
      "README files for GitHub repositories",
      "Blog post HTML export",
      "Documentation and technical writing",
      "Email template HTML generation"
    ],
    tips: [
      "CommonMark and GitHub Flavored Markdown (GFM) differ slightly on tables and strikethrough.",
      "Always preview links and images before publishing — relative paths may break.",
      "Use fenced code blocks with language tags for better syntax highlighting in target apps.",
      "Download .html for a standalone file you can open in any browser."
    ],
    faq: [
      { question: "What Markdown features are supported?", answer: "Headings, bold, italic, inline code, fenced code blocks, blockquotes, ordered/unordered lists, links, images, tables, and horizontal rules." },
      { question: "Can I see raw HTML?", answer: "Yes. Toggle the right pane to HTML mode to copy the source." },
      { question: "Is conversion done locally?", answer: "Yes. The marked library runs in your browser." },
      { question: "Can I download the output?", answer: "Yes. Download a complete .html file with your converted content." },
      { question: "What is Markdown?", answer: "A lightweight markup language using plain text formatting. Popular for READMEs, docs, and static site generators." }
    ],
    primary: "Markdown to HTML converter",
    audience: "developers, technical writers, and bloggers",
    does: "It converts Markdown syntax to HTML with a live preview and copy/download options.",
    when: "you need HTML output from Markdown notes, READMEs, or blog drafts",
    workflow: "paste Markdown, preview output, copy or download HTML",
    benefit: "Instant preview catches formatting mistakes before you publish or paste into a CMS.",
    caution: "Complex Markdown extensions (footnotes, math) may not render. Test output in your target platform.",
    related: "Use JSON Formatter for config files, HTML Formatter for cleanup, or Slug Generator for URL-friendly titles."
  })
];

export const highTrafficSlugs = new Set(highTrafficTools.map((tool) => tool.slug));

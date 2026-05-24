import type { Tool, ToolCategory } from "./tools";
import { isToolIndexedForSearch } from "./indexing-policy";

function uniqueParagraphs(paragraphs: string[]): string[] {
  const seen = new Set<string>();
  return paragraphs.filter((p) => {
    const key = p.trim().toLowerCase();
    if (key.length < 40 || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function categoryUseCases(tool: Tool): string[] {
  const { title, category, description } = tool;
  const byCategory: Partial<Record<ToolCategory, string[]>> = {
    "PDF Tools": [
      `${title} fits PDF workflows where upload limits, page order, or file hygiene block submission—${description}`,
      "Use it after you inventory sources: rename files with numeric prefixes, fix rotation, then run the tool on a duplicate—not your only signed original.",
      "Pair with Merge PDF, Split PDF, Compress PDF, or Extract PDF Pages when one step alone cannot satisfy a portal cap.",
      "Verify the output in the same reader your recipient uses (mobile, Adobe, browser preview) before you treat the job as done."
    ],
    "Image Tools": [
      `${title} helps when photos or graphics exceed upload limits or slow pages—${description}`,
      "Start from the highest-quality source you have; re-compressing social downloads or screenshots limits how much you can recover.",
      "Check results at 100% zoom on text-heavy screenshots and product photos before publishing or emailing.",
      "Chain with Image Resizer or WebP Converter when the destination platform specifies dimensions or modern formats."
    ],
    "AI Tools": [
      `${title} drafts text you must review before sending to school, clients, or employers—${description}`,
      "Paste structured context (role, audience, constraints) instead of vague prompts; AI output quality follows input clarity.",
      "Follow your institution or employer generative-AI policy; assistants should help you learn and polish—not bypass integrity rules.",
      "Pair with Grammar Fixer or Word Counter when limits, tone, or mechanics need a second pass after generation."
    ],
    "SEO Tools": [
      `${title} supports metadata and markup tasks that belong in every launch checklist—${description}`,
      "Copy generated tags into staging first; validate with SERP Preview and your CMS before production deploy.",
      "Keep titles and descriptions honest—clickbait snippets hurt trust and may be rewritten by Google anyway.",
      "Document which URLs use which meta sets so redesigns do not silently drop robots or canonical tags."
    ],
    "Developer Tools": [
      `${title} saves time on repetitive format, decode, or validation tasks in the browser—${description}`,
      "Paste sample data that resembles production shape but strip secrets, tokens, and customer identifiers first.",
      "Compare output against your language runtime or official spec when correctness matters for CI or production.",
      "Keep a scratch file of inputs that broke in the past—regression tests for your own workflows."
    ],
    "Calculator Tools": [
      `${title} estimates numeric results from the values you enter—${description}`,
      "Use it for planning and what-if scenarios; confirm contractual, medical, payroll, or academic numbers with official sources.",
      "Write down assumptions (rate, term, rounding) beside the result so future-you knows what changed.",
      "Re-run with conservative and optimistic inputs when decisions depend on ranges, not single points."
    ]
  };
  return byCategory[category] ?? [
    `${title} on freetoolkitapp is a focused browser utility—${description}`,
    "No signup is required; review output before you submit it anywhere important.",
    "Duplicate sensitive inputs locally and avoid pasting secrets into shared machines.",
    "Use related tools linked on the page when your task spans more than one step."
  ];
}

function categoryTips(tool: Tool): string[] {
  const { title, category } = tool;
  const byCategory: Partial<Record<ToolCategory, string[]>> = {
    "PDF Tools": [
      "Rename downloads with dates and matter names—application.pdf causes support nightmares.",
      "If a portal rejects a file, read the error literally (size, encryption, page count) before trying random fixes.",
      "Landscape pages buried mid-packet frustrate reviewers; fix rotation before merge or split.",
      "Search (Ctrl/Cmd+F) for a keyword from each source section after merge or extract to catch silent drops.",
      `${title} does not replace records-management policy for PDF/A, signatures, or redaction.`
    ],
    "Image Tools": [
      "Export masters from design tools when possible instead of re-compressing already lossy JPEGs.",
      "Strip EXIF GPS data before publishing photos publicly unless location is intentional.",
      "Match output format to the uploader (JPG for legacy portals, WebP for modern CMS).",
      "Compare file size and visual quality side-by-side; smaller is not always acceptable.",
      `${title} runs locally where supported—still avoid confidential imagery on untrusted devices.`
    ],
    "AI Tools": [
      "Edit AI drafts for factual claims, names, dates, and commitments before sending.",
      "Shorter prompts with bullet context often beat long unstructured paste.",
      "Reject suggestions that flatten your voice or add claims you cannot defend.",
      "For ESL writers, note repeated grammar patterns and study them—not only accept fixes.",
      `${title} output may be logged by model providers; check policy before pasting PHI or secrets.`
    ],
    "SEO Tools": [
      "One primary keyword per page; do not stuff unrelated terms into meta descriptions.",
      "Validate Open Graph images at 1200×630 safe zones—faces and logos get cropped on social apps.",
      "Keep a changelog when you change canonical or robots tags; SEO regressions hide in deploy diffs.",
      "Test structured data with Google’s Rich Results Test after copying schema markup.",
      `${title} helps implementation; rankings still require content, links, and experience.`
    ],
    "Developer Tools": [
      "Pretty-print JSON before sharing in tickets—colleagues should not decode minified blobs manually.",
      "When regex fails, simplify the pattern or use a real parser for nested structures.",
      "JWT decode shows claims only; signature verification belongs in your backend.",
      "URL-encode components, not full URLs, when building query strings piece by piece.",
      `${title} is a helper—not a substitute for unit tests or security review.`
    ],
    "Calculator Tools": [
      "Enter units explicitly; mixing monthly and annual rates is the classic EMI mistake.",
      "Round only at the end for display; keep full precision while iterating scenarios.",
      "Screenshot inputs and outputs when sharing advice so others can reproduce the math.",
      "If a grade or BMI result surprises you, re-check which formula the tool uses versus your institution.",
      `${title} displays estimates—read disclaimers on the page before medical or legal reliance.`
    ]
  };
  return byCategory[category] ?? [
    `Read ${title} limitations on this page before assuming it covers edge cases.`,
    "Work on copies; keep originals until an upload portal confirms success.",
    "If results look wrong, reduce input size or complexity and retry.",
    "Mobile browsers may struggle with very large files—use desktop when possible.",
    "Contact hello@freetoolkitapp.com with browser version if behavior seems broken."
  ];
}

function categoryMistakes(tool: Tool): string[] {
  const { title, category } = tool;
  const byCategory: Partial<Record<ToolCategory, string[]>> = {
    "PDF Tools": [
      "Treating merge, split, or compress as a substitute for redaction—black boxes in scans may still leak underlying text.",
      "Submitting the only copy of a signed PDF before verifying every page in the output packet.",
      "Ignoring encryption prompts instead of unlocking with authorized credentials first.",
      "Assuming digital signatures survive every optimization pass—test on a duplicate when compliance matters."
    ],
    "Image Tools": [
      "Over-compressing product or document photos until text becomes unreadable at normal zoom.",
      "Uploading unreleased client creative to random third-party optimizers when local tools suffice.",
      "Converting transparent PNG to JPG without checking white matte on dark-site embeds.",
      "Trusting social-media re-downloads as masters—they are often re-encoded aggressively."
    ],
    "AI Tools": [
      "Submitting AI drafts to school or work without disclosure where policy requires it.",
      "Believing fluent grammar equals factual accuracy—verify names, stats, and citations yourself.",
      "Pasting confidential memos into cloud AI tools without employer or HIPAA clearance.",
      "Accepting every suggestion until your voice disappears and the prose reads generic."
    ],
    "SEO Tools": [
      "Copying identical meta descriptions across hundreds of doorway-like pages.",
      "Blocking staging accidentally in robots.txt while forgetting to fix production.",
      "Trusting AI-generated schema for medical or financial claims without expert review.",
      "Changing URLs without 301 plans and wondering why traffic flatlines."
    ],
    "Developer Tools": [
      "Using MD5 or weak patterns where SHA-256 or proper auth is required.",
      "Decoding JWTs and treating unsigned payloads as trusted identity.",
      "Running destructive regex on production logs without a backup sample.",
      "Pasting production API keys into online formatters—use redacted fixtures."
    ],
    "Calculator Tools": [
      `Treating ${title} output as official transcripts, diagnoses, or binding financial statements.`,
      "Mixing grading scales (4.0 vs 5.0 vs percentage) without converting consciously.",
      "Ignoring local rounding rules that schools and payroll systems apply differently.",
      "Sharing calculator screenshots as proof without showing inputs and assumptions."
    ]
  };
  return byCategory[category] ?? [
    "Assuming a browser tool covers every regulatory or platform rule without reading the page.",
    "Skipping preview because the first screen looked fine.",
    "Using online utilities on classified data without organizational approval.",
    "Deleting originals before confirming the recipient accepted the export."
  ];
}

/** Build additional unique SEO paragraphs from existing tool fields—never duplicate text. */
function expandSeoFromToolFields(tool: Tool): string[] {
  const chunks: string[] = [];
  if (tool.description && tool.description !== tool.intro) {
    chunks.push(tool.description);
  }
  tool.features?.slice(0, 5).forEach((f) => {
    chunks.push(f.endsWith(".") ? f : `${f}.`);
  });
  tool.howToUse?.slice(0, 4).forEach((step, i) => {
    chunks.push(`When using ${tool.title}, step ${i + 1} is: ${step}`);
  });
  tool.faq?.slice(0, 4).forEach(({ question, answer }) => {
    chunks.push(`${question} ${answer}`);
  });
  if (tool.useCases?.length) {
    tool.useCases.slice(0, 2).forEach((u) => chunks.push(u));
  }
  return uniqueParagraphs(chunks);
}

const MIN_UNIQUE_SEO_PARAGRAPHS = 6;

/** Adds depth for indexed tools missing optional sections. Never duplicates paragraph text. */
export function applyIndexedSupplement(tool: Tool): Tool {
  if (!isToolIndexedForSearch(tool.slug)) return tool;

  const useCases = tool.useCases?.length ? tool.useCases : categoryUseCases(tool);
  const tips = tool.tips?.length ? tool.tips : categoryTips(tool);
  const commonMistakes = tool.commonMistakes?.length ? tool.commonMistakes : categoryMistakes(tool);

  let seo = uniqueParagraphs([...(tool.seo ?? [])]);
  if (seo.length < MIN_UNIQUE_SEO_PARAGRAPHS) {
    seo = uniqueParagraphs([...seo, ...expandSeoFromToolFields({ ...tool, useCases, tips, commonMistakes })]);
  }

  return {
    ...tool,
    useCases,
    tips,
    commonMistakes,
    seo
  };
}

export { MIN_UNIQUE_SEO_PARAGRAPHS, uniqueParagraphs };

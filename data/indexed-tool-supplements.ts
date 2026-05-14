import type { Tool } from "./tools";
import { isToolIndexedForSearch } from "./indexing-policy";

function defaultUseCases(tool: Tool): string[] {
  const t = tool.title;
  const bucket = tool.category.replace(/ Tools$/, "").toLowerCase();
  return [
    `You need ${t} when a ${bucket} task should stay in the browser: fewer installs, faster handoffs, and a clear preview before you export.`,
    `You are preparing work for school, clients, or the web where the bottleneck is formatting or calculation—not learning a new desktop suite tonight.`,
    `You want a no-signup page that still explains limits and privacy expectations, so you can decide responsibly before pasting sensitive content.`,
    `You are pairing this step with related utilities (merge, compress, cite, validate) to finish an end-to-end workflow without losing originals.`
  ];
}

function defaultTips(tool: Tool): string[] {
  const t = tool.title;
  return [
    `Duplicate originals when outputs might rewrite bytes; ${t} should not be the only copy of something irreplaceable.`,
    `Match export settings to the destination (format, DPI, max size, citation edition) before you promise a delivery time.`,
    `Read on-page limitation notes literally—browser tools are honest about what they cannot fix in one click.`,
    `After export, open the result once in the same environment your recipient will use (phone preview, PDF reader, LMS viewer).`,
    `If results look wrong, narrow the input: smaller files, cleaner text, or fewer variables make debugging faster.`
  ];
}

function defaultMistakes(tool: Tool): string[] {
  const t = tool.title;
  return [
    `Treating ${t} as an official grade, legal, medical, or financial determination—policies and professionals still govern outcomes.`,
    `Working on the only copy of a contract, transcript scan, or portfolio piece—duplicate first, then experiment.`,
    `Skipping preview and verification, then discovering rejections only after a government, court, or school portal blocks the upload.`,
    `Pasting passwords, API keys, or student identifiers into prompts or sample fields on untrusted networks—assume visibility.`
  ];
}

function defaultSeoAppend(tool: Tool): string[] {
  const t = tool.title;
  return [
    `${t} is included in FreeToolKit’s curated, search-visible set: the goal is a readable guide plus a working control, not a bare widget. Use the how-to steps, mistakes section, FAQs, and related links to build confidence before you export or submit.`,
    `Browser utilities trade depth for speed—when a job exceeds stated limits, plan a desktop or vendor workflow early so deadlines stay realistic.`
  ];
}

/** Adds depth for indexed tools missing optional sections after rich-tool-packs. */
export function applyIndexedSupplement(tool: Tool): Tool {
  if (!isToolIndexedForSearch(tool.slug)) return tool;

  const useCases = tool.useCases?.length ? tool.useCases : defaultUseCases(tool);
  const tips = tool.tips?.length ? tool.tips : defaultTips(tool);
  const commonMistakes = tool.commonMistakes?.length ? tool.commonMistakes : defaultMistakes(tool);
  /** Rich packs with deep editorial (10+ paragraphs) skip generic SEO append. */
  const seo =
    tool.seo.length >= 10 ? tool.seo : [...tool.seo, ...defaultSeoAppend(tool)];

  return {
    ...tool,
    useCases,
    tips,
    commonMistakes,
    seo
  };
}

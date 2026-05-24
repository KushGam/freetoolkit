import type { Tool } from "./tools";
import type { ToolContentSection } from "./tool-content-types";
import { isToolIndexedForSearch } from "./indexing-policy";

function sectionText(section: ToolContentSection): string {
  const parts: string[] = [];
  section.paragraphs?.forEach((p) => parts.push(p));
  section.subsections?.forEach((sub) => sub.paragraphs.forEach((p) => parts.push(p)));
  return parts.join(" ");
}

export function countToolEditorialWords(tool: Tool): number {
  const chunks: string[] = [tool.intro, tool.description, ...(tool.seo ?? []), ...(tool.howToUse ?? []), ...(tool.features ?? []), ...(tool.useCases ?? []), ...(tool.tips ?? []), ...(tool.commonMistakes ?? [])];
  tool.sections?.forEach((s) => chunks.push(sectionText(s)));
  tool.faq?.forEach(({ question, answer }) => chunks.push(`${question} ${answer}`));
  return chunks.join(" ").split(/\s+/).filter(Boolean).length;
}

/** Builds structured H2/H3 sections from existing unique tool fields when no blueprint exists. */
export function applyDefaultSections(tool: Tool): Tool {
  if (tool.sections?.length || !isToolIndexedForSearch(tool.slug)) return tool;

  const sections: ToolContentSection[] = [];

  sections.push({
    id: "overview",
    heading: `What ${tool.title} does and when to use it`,
    paragraphs: [tool.intro, ...(tool.seo?.slice(0, 2) ?? [])].filter(Boolean),
    subsections: tool.features?.length
      ? [
          {
            heading: "Key benefits",
            paragraphs: tool.features.slice(0, 5)
          }
        ]
      : undefined
  });

  if (tool.howToUse?.length) {
    sections.push({
      id: "how-to-use",
      heading: `How to use ${tool.title} on freetoolkitapp`,
      paragraphs: [
        `${tool.description} The workflow below runs in your browser where supported — no account required. Review output before submitting to school, work, or clients.`
      ],
      subsections: tool.howToUse.slice(0, 7).map((step, index) => ({
        heading: `Step ${index + 1}`,
        paragraphs: [step]
      }))
    });
  }

  if (tool.useCases?.length) {
    sections.push({
      id: "use-cases",
      heading: `Real-world ${tool.title.toLowerCase()} use cases`,
      subsections: tool.useCases.slice(0, 6).map((useCase, index) => ({
        heading: useCase.startsWith("Example:") ? `Example ${index + 1}` : `Scenario ${index + 1}`,
        paragraphs: [useCase.replace(/^Example:\s*/i, "")]
      }))
    });
  }

  const practiceSubsections = [
    ...(tool.tips?.slice(0, 5).map((tip, index) => ({
      heading: `Tip ${index + 1}`,
      paragraphs: [tip]
    })) ?? []),
    ...(tool.commonMistakes?.slice(0, 4).map((mistake, index) => ({
      heading: `Common mistake ${index + 1}`,
      paragraphs: [mistake]
    })) ?? [])
  ];

  if (practiceSubsections.length) {
    sections.push({
      id: "best-practices",
      heading: "Tips, limitations, and mistakes to avoid",
      paragraphs: [
        `Every browser tool has boundaries. ${tool.title} is built for everyday productivity — not as a substitute for professional advice, certified software, or platform-specific compliance checks.`
      ],
      subsections: practiceSubsections
    });
  }

  const extended = tool.seo?.slice(2, 10) ?? [];
  if (extended.length >= 2) {
    sections.push({
      id: "extended-guide",
      heading: `Extended guide: ${tool.title.toLowerCase()} in everyday workflows`,
      paragraphs: extended
    });
  }

  const filtered = sections.filter((s) => (s.paragraphs?.length ?? 0) > 0 || (s.subsections?.length ?? 0) > 0);
  if (!filtered.length) return tool;

  return { ...tool, sections: filtered };
}

export const MIN_EDITORIAL_WORDS = 850;

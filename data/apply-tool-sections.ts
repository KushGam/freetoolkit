import type { Tool } from "./tools";
import { toolSeoBlueprints } from "./seo-content-blueprints";

const blueprintBySlug = new Map(toolSeoBlueprints.map((b) => [b.slug, b]));

/** Merge structured long-form sections and SEO metadata from blueprints onto tools. */
export function applyToolSections(tool: Tool): Tool {
  const blueprint = blueprintBySlug.get(tool.slug);
  if (!blueprint) return tool;

  return {
    ...tool,
    metaTitle: blueprint.metaTitle || tool.metaTitle,
    metaDescription: blueprint.metaDescription || tool.metaDescription,
    sections: blueprint.sections,
    seoBlueprint: {
      searchIntent: blueprint.searchIntent,
      primaryKeyword: blueprint.primaryKeyword,
      secondaryKeywords: blueprint.secondaryKeywords,
      semanticKeywords: blueprint.semanticKeywords,
      longTailKeywords: blueprint.longTailKeywords,
      relatedInternalLinks: blueprint.relatedInternalLinks,
      schemaRecommendations: blueprint.schemaRecommendations
    }
  };
}

export function getToolSeoBlueprint(slug: string) {
  return blueprintBySlug.get(slug);
}

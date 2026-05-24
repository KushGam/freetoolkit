/** Structured long-form editorial blocks for tool pages (H2/H3 hierarchy). */
export type ToolContentSubsection = {
  heading: string;
  paragraphs: string[];
};

export type ToolContentSection = {
  id: string;
  heading: string;
  paragraphs?: string[];
  subsections?: ToolContentSubsection[];
};

export type SearchIntent = "informational" | "transactional" | "commercial" | "navigational";

export type SchemaRecommendation = {
  type: "FAQPage" | "HowTo" | "SoftwareApplication" | "WebPage" | "BreadcrumbList" | "Article";
  notes: string;
};

export type ToolSeoBlueprint = {
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  searchIntent: SearchIntent;
  primaryKeyword: string;
  secondaryKeywords: string[];
  semanticKeywords: string[];
  longTailKeywords: string[];
  relatedInternalLinks: Array<{ label: string; href: string; anchorContext: string }>;
  schemaRecommendations: SchemaRecommendation[];
  sections: ToolContentSection[];
};

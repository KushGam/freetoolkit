import indexedToolSlugs from "./indexed-tool-slugs.json";

const indexedSet = new Set(indexedToolSlugs as string[]);

/** Slugs we want crawlers to index (quality gate). Other tool URLs use noindex until expanded. */
export function isToolIndexedForSearch(slug: string): boolean {
  return indexedSet.has(slug);
}

export const INDEXED_TOOL_SLUGS: readonly string[] = indexedToolSlugs as string[];

import indexedToolSlugs from "./indexed-tool-slugs.json";
import sitemapPolicy from "./sitemap-policy.json";

const indexedSet = new Set(indexedToolSlugs as string[]);
const blogNoindexSet = new Set(sitemapPolicy.blogNoindex as string[]);

/** Slugs we want crawlers to index (quality gate). Other tool URLs use noindex until expanded. */
export function isToolIndexedForSearch(slug: string): boolean {
  return indexedSet.has(slug);
}

/** Blog posts excluded from sitemap and given noindex (e.g. when primary related tools are not indexed). */
export function isBlogIndexedForSearch(slug: string): boolean {
  return !blogNoindexSet.has(slug);
}

export const INDEXED_TOOL_SLUGS: readonly string[] = indexedToolSlugs as string[];
export const BLOG_NOINDEX_SLUGS: readonly string[] = sitemapPolicy.blogNoindex as string[];

/**
 * AdSense / quality gate: verifies indexed tool pages have required depth fields,
 * sitemap consistency, and related-tool slug policy.
 *
 * Run from repo root: `npm run adsense-check` (after `npm run build` for fresh sitemap).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { tools, getTool } from "../data/tools";
import sitemapPolicy from "../data/sitemap-policy.json";
import { BLOG_NOINDEX_SLUGS, INDEXED_TOOL_SLUGS, isToolIndexedForSearch } from "../data/indexing-policy";
import { getRelatedToolSlugs } from "../data/tool-relations";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const allowedStaticPaths = new Set(sitemapPolicy.staticInclude as string[]);
const alwaysExcludePaths = new Set(sitemapPolicy.alwaysExclude as string[]);
const blogNoindexPaths = new Set((sitemapPolicy.blogNoindex as string[]).map((slug) => `/blog/${slug}`));

function collectSitemapPaths(): string[] {
  const publicDir = path.join(root, "public");
  const urlsetFile = path.join(publicDir, "sitemap-0.xml");
  if (!fs.existsSync(urlsetFile)) return [];
  const paths: string[] = [];
  const files = ["sitemap-0.xml"];
  for (const name of files) {
    const filePath = path.join(publicDir, name);
    if (!fs.existsSync(filePath)) continue;
    const text = fs.readFileSync(filePath, "utf8");
    if (!text.includes("<urlset")) continue;
    const locRe = /<loc>([^<]+)<\/loc>/g;
    let locMatch: RegExpExecArray | null;
    while ((locMatch = locRe.exec(text)) !== null) {
      try {
        const u = new URL(locMatch[1].trim());
        const p = u.pathname.replace(/\/$/, "") || "/";
        paths.push(p);
      } catch {
        /* ignore bad loc */
      }
    }
  }
  return paths;
}

function main() {
  const errors: string[] = [];
  const warnings: string[] = [];

  const sitemapPaths = new Set(collectSitemapPaths());
  if (!sitemapPaths.size) {
    warnings.push("No sitemap URLs found under public/. Run `npm run build` (postbuild runs next-sitemap) before adsense-check for sitemap assertions.");
  }

  const toolSlugSet = new Set(tools.map((t) => t.slug));

  for (const slug of INDEXED_TOOL_SLUGS) {
    const tool = getTool(slug);
    if (!tool) {
      errors.push(`Indexed slug "${slug}" has no tool definition in merged tools[]`);
      continue;
    }
    if (!tool.seo || tool.seo.length < 10) {
      errors.push(`${slug}: seo[] must have length >= 10 (got ${tool.seo?.length ?? 0})`);
    }
    if (!tool.faq?.length) {
      errors.push(`${slug}: faq[] must be non-empty`);
    }
    if (!tool.useCases?.length) {
      errors.push(`${slug}: useCases[] missing or empty`);
    }
    if (!tool.tips?.length) {
      errors.push(`${slug}: tips[] missing or empty`);
    }
    if (!tool.commonMistakes?.length) {
      errors.push(`${slug}: commonMistakes[] missing or empty`);
    }

    const related = getRelatedToolSlugs(slug, 12);
    for (const r of related) {
      if (!isToolIndexedForSearch(r)) {
        errors.push(`${slug}: related tool slug "${r}" is not in indexed-tool-slugs.json`);
      }
      if (!getTool(r)) {
        errors.push(`${slug}: related tool slug "${r}" has no getTool() entry`);
      }
    }

    if (sitemapPaths.size) {
      const expected = `/${slug}`;
      if (!sitemapPaths.has(expected)) {
        errors.push(`Indexed slug "${slug}" missing from sitemap (expected loc path ${expected})`);
      }
    }
  }

  if (sitemapPaths.size) {
    for (const excluded of alwaysExcludePaths) {
      if (sitemapPaths.has(excluded)) {
        errors.push(`Sitemap must not include ${excluded}`);
      }
    }
    for (const excluded of blogNoindexPaths) {
      if (sitemapPaths.has(excluded)) {
        errors.push(`Sitemap must not include noindex blog path ${excluded}`);
      }
    }
    const thinHubs = ["/social-media-tools", "/gaming-tools", "/pdf-tools", "/image-tools", "/developer-tools", "/student-tools", "/calculator-tools", "/text-tools", "/security-tools", "/sitemap"];
    for (const hub of thinHubs) {
      if (sitemapPaths.has(hub)) {
        errors.push(`Sitemap should exclude thin or duplicate hub ${hub}`);
      }
    }
    for (const p of sitemapPaths) {
      const parts = p.split("/").filter(Boolean);
      if (parts.length === 1 && toolSlugSet.has(parts[0]) && !isToolIndexedForSearch(parts[0])) {
        errors.push(`Sitemap includes path ${p} but slug is not in indexed-tool-slugs.json`);
      }
      if (parts.length === 1 && !toolSlugSet.has(parts[0]) && !allowedStaticPaths.has(p)) {
        errors.push(`Sitemap includes unexpected single-segment path ${p} (not indexed tool or allowed static page)`);
      }
      if (parts[0] === "blog" && parts.length === 2 && blogNoindexPaths.has(p)) {
        errors.push(`Sitemap includes noindex blog ${p}`);
      }
    }
  }

  if (warnings.length) {
    console.warn("\nWarnings:\n", warnings.map((w) => `  - ${w}`).join("\n"));
  }
  if (errors.length) {
    console.error("\nAdSense readiness check FAILED:\n", errors.map((e) => `  - ${e}`).join("\n"));
    process.exit(1);
  }
  console.log(`AdSense readiness OK (${INDEXED_TOOL_SLUGS.length} indexed slugs checked).`);
}

main();

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
import { INDEXED_TOOL_SLUGS, isToolIndexedForSearch } from "../data/indexing-policy";
import { getRelatedToolSlugs } from "../data/tool-relations";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const hubSingleSegments = new Set([
  "about",
  "contact",
  "terms",
  "disclaimer",
  "privacy",
  "privacy-policy",
  "blog",
  "all-tools",
  "sitemap",
  "ads.txt",
  "ai-tools",
  "student",
  "student-tools",
  "developer",
  "developer-tools",
  "everyday",
  "pdf-tools",
  "image-tools",
  "pdf-image",
  "calculator-tools",
  "security-tools",
  "seo-tools",
  "social-media-tools",
  "gaming-tools",
  "text-tools"
]);

function collectSitemapPaths(): string[] {
  const publicDir = path.join(root, "public");
  if (!fs.existsSync(publicDir)) return [];
  const paths: string[] = [];
  for (const name of fs.readdirSync(publicDir)) {
    if (!name.endsWith(".xml") || !name.includes("sitemap")) continue;
    const text = fs.readFileSync(path.join(publicDir, name), "utf8");
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
    for (const p of sitemapPaths) {
      const parts = p.split("/").filter(Boolean);
      if (parts.length !== 1) continue;
      const seg = parts[0];
      if (hubSingleSegments.has(seg)) continue;
      if (!toolSlugSet.has(seg)) continue;
      if (!isToolIndexedForSearch(seg)) {
        errors.push(`Sitemap includes path /${seg} but slug is not in indexed-tool-slugs.json (should be excluded)`);
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

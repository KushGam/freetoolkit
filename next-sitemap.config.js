const indexedToolSlugs = require("./data/indexed-tool-slugs.json");
const sitemapPolicy = require("./data/sitemap-policy.json");

const indexedToolPaths = new Set(indexedToolSlugs.map((slug) => `/${slug}`));
const staticIncludePaths = new Set(sitemapPolicy.staticInclude);
const alwaysExcludePaths = new Set(sitemapPolicy.alwaysExclude);
const blogNoindexSlugs = new Set(sitemapPolicy.blogNoindex);

function normalizePath(path) {
  const trimmed = path.replace(/\/$/, "");
  return trimmed || "/";
}

function shouldExcludeFromSitemap(path) {
  const normalized = normalizePath(path);

  if (alwaysExcludePaths.has(normalized)) return true;

  if (normalized.startsWith("/blog/")) {
    const slug = normalized.slice("/blog/".length);
    if (blogNoindexSlugs.has(slug)) return true;
    return false;
  }

  const segments = normalized.split("/").filter(Boolean);

  if (segments.length === 0) {
    return !staticIncludePaths.has("/");
  }

  if (segments.length === 1) {
    const single = `/${segments[0]}`;
    if (indexedToolPaths.has(single)) return false;
    if (staticIncludePaths.has(single)) return false;
    return true;
  }

  return true;
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.freetoolkitapp.com",
  generateRobotsTxt: true,
  changefreq: "daily",
  exclude: [
    "/api/*",
    "/robots.txt",
    "/sitemap.xml",
    "/privacy",
    "/ads.txt",
    "/blog/valorant-sensitivity-guide",
    "/blog/palworld-breeding-guide",
    "/social-media-tools",
    "/gaming-tools",
    "/everyday",
    "/student",
    "/pdf-tools",
    "/image-tools",
    "/developer-tools",
    "/student-tools",
    "/student-tools/*",
    "/calculator-tools",
    "/text-tools",
    "/security-tools",
    "/shift-hours-calculator",
    "/ai-essay-writer",
    "/ai-interview-answer-generator",
    "/content-rewriter"
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"]
      }
    ]
  },
  transform: async (config, path) => {
    if (shouldExcludeFromSitemap(path)) {
      return null;
    }
    const normalized = normalizePath(path);
    let priority = 0.7;
    if (normalized === "/") priority = 1.0;
    else if (indexedToolPaths.has(normalized)) priority = 0.9;
    else if (
      normalized === "/ai-tools" ||
      normalized === "/pdf-image" ||
      normalized === "/developer" ||
      normalized === "/calculators" ||
      normalized === "/seo-tools" ||
      normalized === "/all-tools"
    ) {
      priority = 0.8;
    } else if (normalized.startsWith("/blog/")) {
      priority = 0.6;
    }

    return {
      loc: path,
      changefreq: "daily",
      priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? []
    };
  }
};

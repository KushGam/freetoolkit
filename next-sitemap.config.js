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
    "/calculator-tools",
    "/text-tools",
    "/security-tools",
    "/sitemap",
    "/all-tools"
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"]
      }
    ]
  },
  transform: async (config, path) => {
    if (shouldExcludeFromSitemap(path)) {
      return null;
    }
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? []
    };
  }
};

const indexedToolSlugs = require("./data/indexed-tool-slugs.json");
const indexedToolPaths = new Set(indexedToolSlugs.map((slug) => `/${slug}`));

/** Single-segment routes that are hubs or legal pages—not dynamic [slug] tools. */
const nonToolSingleSegment = new Set([
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

function shouldExcludeFromSitemap(path) {
  const trimmed = path.replace(/\/$/, "") || "/";
  if (trimmed === "/student-tools/ai-resume-cover-letter") return true;
  const segments = trimmed.split("/").filter(Boolean);
  if (segments.length !== 1) return false;
  const slug = segments[0];
  if (nonToolSingleSegment.has(slug)) return false;
  return !indexedToolPaths.has(`/${slug}`);
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.freetoolkitapp.com",
  generateRobotsTxt: true,
  exclude: ["/api/*", "/robots.txt", "/sitemap.xml", "/privacy"],
  additionalPaths: async (config) => [await config.transform(config, "/all-tools")],
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

import type { MetadataRoute } from "next";
import { blogHref, blogPosts } from "@/data/blog";
import { tools, toolHref } from "@/data/tools";
import { canonicalUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "everyday", "student", "ai-tools", "developer", "all-tools", "image-tools", "pdf-tools", "student-tools", "text-tools", "developer-tools", "calculator-tools", "security-tools", "about", "contact", "privacy", "terms"];
  return [
    ...staticRoutes.map((route) => ({
      url: canonicalUrl(route),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route ? 0.7 : 1
    })),
    ...tools.map((tool) => ({
      url: canonicalUrl(toolHref(tool)),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8
    })),
    ...blogPosts.map((post) => ({
      url: canonicalUrl(blogHref(post)),
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.75
    }))
  ];
}

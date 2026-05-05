import type { MetadataRoute } from "next";
import { tools, toolHref } from "@/data/tools";
import { siteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "everyday", "student", "ai-tools", "developer", "all-tools", "image-tools", "pdf-tools", "student-tools", "text-tools", "developer-tools", "calculator-tools", "security-tools", "about", "contact", "privacy", "terms"];
  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}/${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route ? 0.7 : 1
    })),
    ...tools.map((tool) => ({
      url: `${siteUrl}${toolHref(tool)}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}

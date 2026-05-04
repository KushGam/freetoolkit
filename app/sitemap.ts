import type { MetadataRoute } from "next";
import { tools } from "@/data/tools";
import { siteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "all-tools", "image-tools", "pdf-tools", "student-tools", "daily-tools", "calculator-tools", "text-tools", "image-add-ons", "about", "contact", "privacy", "terms"];
  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}/${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route ? 0.7 : 1
    })),
    ...tools.map((tool) => ({
      url: `${siteUrl}/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}

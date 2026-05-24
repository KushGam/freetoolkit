export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

export function slugToTitle(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const siteUrl = "https://www.freetoolkitapp.com";
export const siteName = "freetoolkitapp";
/** Google AdSense publisher ID — also used in public/ads.txt and site verification meta. */
export const adsensePubId = "ca-pub-7576421865674261";
/** Monogram — first letter of freetoolkitapp */
export const siteLogoMark = "f";

export function canonicalUrl(path = "/") {
  const normalizedPath = path === "/" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${siteUrl}${normalizedPath}`;
}

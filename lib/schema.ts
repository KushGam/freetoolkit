import { canonicalUrl, siteUrl, siteName } from "@/lib/utils";
import { founder, siteContactEmail } from "@/data/site-trust";

type FaqItem = { question: string; answer: string };

export const organizationId = `${siteUrl}/#organization`;
export const founderId = `${siteUrl}/#founder`;
export const websiteId = `${siteUrl}/#website`;

export function buildPersonSchema() {
  return {
    "@type": "Person",
    "@id": founderId,
    name: founder.name,
    jobTitle: founder.role,
    email: siteContactEmail,
    sameAs: [founder.linkedinUrl],
    worksFor: { "@id": organizationId },
    url: canonicalUrl("/about")
  };
}

export function buildOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: siteName,
    url: siteUrl,
    email: siteContactEmail,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/og-image.png?v=2`
    },
    founder: { "@id": founderId },
    description:
      "Independent productivity toolkit with curated browser-based PDF, image, AI, SEO, developer, and calculator tools."
  };
}

export function buildWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: siteName,
    url: siteUrl,
    publisher: { "@id": organizationId },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/all-tools?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function buildGlobalSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [buildOrganizationSchema(), buildPersonSchema(), buildWebSiteSchema()]
  };
}

export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer }
    }))
  };
}

export function buildBreadcrumbSchema(items: Array<{ name: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.href)
    }))
  };
}

export function buildToolSoftwareSchema(input: { name: string; description: string; href: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    applicationCategory: "WebApplication",
    operatingSystem: "Any",
    url: canonicalUrl(input.href),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };
}

export function buildBlogPostingSchema(input: {
  title: string;
  description: string;
  href: string;
  publishedAt: string;
  keywords: string[];
  section: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt,
    dateModified: input.publishedAt,
    inLanguage: "en",
    articleSection: input.section,
    mainEntityOfPage: canonicalUrl(input.href),
    keywords: input.keywords.join(", "),
    author: {
      "@type": "Person",
      "@id": founderId,
      name: founder.name,
      url: founder.linkedinUrl,
      sameAs: [founder.linkedinUrl]
    },
    publisher: {
      "@type": "Organization",
      "@id": organizationId,
      name: siteName,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-image.png?v=2`
      }
    },
    isPartOf: {
      "@type": "Blog",
      name: `${siteName} Blog`,
      url: canonicalUrl("/blog")
    }
  };
}

export function buildHowToSchema(input: { name: string; description: string; steps: string[]; href: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    step: input.steps.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: `Step ${index + 1}`,
      text
    })),
    tool: {
      "@type": "SoftwareApplication",
      name: input.name,
      url: canonicalUrl(input.href)
    }
  };
}

export function buildWebPageSchema(input: { name: string; description: string; href: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: input.name,
    description: input.description,
    url: canonicalUrl(input.href),
    isPartOf: { "@type": "WebSite", "@id": websiteId, name: siteName, url: siteUrl }
  };
}

export function withoutBrandSuffix(title: string) {
  return title.replace(/\s*\|\s*(?:FreeToolKit|freetoolkitapp)(?:\s*Blog)?\s*$/i, "").trim();
}

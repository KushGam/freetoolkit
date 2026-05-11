import { canonicalUrl, siteUrl } from "@/lib/utils";

type FaqItem = { question: string; answer: string };

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
      "@type": "Organization",
      name: "FreeToolKit"
    },
    publisher: {
      "@type": "Organization",
      name: "FreeToolKit",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/og-image.png?v=2`
      }
    },
    isPartOf: {
      "@type": "Blog",
      name: "FreeToolKit Blog",
      url: canonicalUrl("/blog")
    }
  };
}

export function withoutBrandSuffix(title: string) {
  return title.replace(/\s*\|\s*FreeToolKit(?:\s*Blog)?\s*$/i, "").trim();
}

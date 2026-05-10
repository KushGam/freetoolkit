import { CategoryToolSearch } from "@/components/CategoryToolSearch";
import { FAQ } from "@/components/FAQ";
import { Container, PageHeader } from "@/components/ui";
import { categorySeo } from "@/data/seo";
import { getToolsByCategory, type ToolCategory } from "@/data/tools";

export function CategoryPage({ category, intro }: { category: ToolCategory; intro: string }) {
  const categoryTools = getToolsByCategory(category);
  const seo = categorySeo[category];
  const faqSchema = seo?.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: seo.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer }
        }))
      }
    : null;
  return (
    <main>
      {faqSchema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} /> : null}
      <Container className="max-w-6xl py-10 sm:py-12">
      <PageHeader eyebrow="Free browser tools" title={category} description={seo?.intro ?? intro} badges={["No signup", "Fast", "Mobile friendly"]} />
      <CategoryToolSearch tools={categoryTools} />
      <section className="prose-lite mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2>About these {category.toLowerCase()}</h2>
        {(seo?.body ?? [
          "These free tools are built for everyday work on phones, tablets, and desktops. Each page includes useful instructions, privacy-friendly copy, and related internal links so you can move between tasks quickly.",
          "FreeToolKit does not require accounts or paid API keys. Image and PDF tools use browser-side processing where possible, while student tools calculate results instantly on the page."
        ]).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </section>
      {seo?.faqs?.length ? <FAQ items={seo.faqs} /> : null}
      </Container>
    </main>
  );
}

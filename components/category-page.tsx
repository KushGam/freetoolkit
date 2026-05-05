import { CategoryToolSearch } from "@/components/CategoryToolSearch";
import { Container, PageHeader } from "@/components/ui";
import { getToolsByCategory, type ToolCategory } from "@/data/tools";

export function CategoryPage({ category, intro }: { category: ToolCategory; intro: string }) {
  const categoryTools = getToolsByCategory(category);
  return (
    <main>
      <Container className="max-w-6xl py-10 sm:py-12">
      <PageHeader eyebrow="Free browser tools" title={category} description={intro} badges={["No signup", "Fast", "Mobile friendly"]} />
      <CategoryToolSearch tools={categoryTools} />
      <section className="prose-lite mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2>About these {category.toLowerCase()}</h2>
        <p>
          These free tools are built for everyday work on phones, tablets, and desktops. Each page includes useful instructions, privacy-friendly copy, and related internal links so you can move between tasks quickly.
        </p>
        <p>
          FreeToolKit does not require accounts or paid API keys. Image and PDF tools use browser-side processing where possible, while student tools calculate results instantly on the page.
        </p>
      </section>
      </Container>
    </main>
  );
}

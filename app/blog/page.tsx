import type { Metadata } from "next";
import Link from "next/link";
import { Card, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "FreeToolKit Blog | Productivity Guides",
  description: "Blog-ready FreeToolKit guide hub for future articles about AI tools, PDF workflows, image optimization, productivity, and student tools.",
  alternates: { canonical: "https://www.freetoolkitapp.com/blog" },
  openGraph: {
    title: "FreeToolKit Blog | Productivity Guides",
    description: "Future FreeToolKit guides for AI and everyday productivity workflows."
  }
};

const plannedTopics = [
  "AI productivity workflows",
  "PDF and image conversion guides",
  "Resume and student tool tutorials",
  "Browser-based privacy tips"
];

export default function BlogPage() {
  return (
    <main>
      <Container className="max-w-6xl py-10">
        <PageHeader
          eyebrow="Guides coming soon"
          title="FreeToolKit Blog"
          description="A clean, blog-ready hub for future guides about free AI tools, PDF workflows, image optimization, student productivity, and everyday browser-based tasks."
          badges={["AI tools", "PDF & Image", "Productivity"]}
        />
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plannedTopics.map((topic) => (
            <Card key={topic} className="p-5">
              <p className="text-sm font-black uppercase tracking-wide text-brand-600">Planned topic</p>
              <h2 className="mt-3 text-lg font-bold tracking-tight text-slate-950">{topic}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">This structure is ready for real articles, related tools, schema-friendly headings, and internal links.</p>
            </Card>
          ))}
        </section>
        <Card className="mt-8 p-6">
          <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950">Start with the tools</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">Until guides are published, explore the live toolkit categories below.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/ai-tools" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-black text-white">AI Tools</Link>
            <Link href="/pdf-image" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700">PDF & Image</Link>
            <Link href="/all-tools" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700">All Tools</Link>
          </div>
        </Card>
      </Container>
    </main>
  );
}

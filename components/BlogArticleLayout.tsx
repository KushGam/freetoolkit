import Link from "next/link";
import { Card, Container, PageHeader } from "@/components/ui";

export function BlogArticleLayout({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mesh-bg min-h-screen">
      <Container className="max-w-4xl py-10">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm font-bold text-ink-muted">
          <Link href="/" className="hover:text-indigo-400">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-indigo-400">Blog</Link>
          <span>/</span>
          <span className="text-ink-primary">{title}</span>
        </nav>
        <PageHeader eyebrow="freetoolkitapp guide" title={title} description={description} badges={["Productivity", "No signup", "Browser-based"]} />
        <article className="prose-lite mt-8 rounded-[2rem] border border-white/[0.08] bg-surface-card p-6 shadow-sm sm:p-8">
          {children}
        </article>
        <Card className="mt-8 p-6">
          <p className="text-sm font-black uppercase tracking-wide text-indigo-400">Related tools</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              ["AI Tools", "/ai-tools"],
              ["PDF & Image", "/pdf-image"],
              ["All Tools", "/all-tools"]
            ].map(([label, href]) => (
              <Link key={href} href={href} className="pill-link">
                {label}
              </Link>
            ))}
          </div>
        </Card>
      </Container>
    </main>
  );
}

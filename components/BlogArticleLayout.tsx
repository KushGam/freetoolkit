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
    <main>
      <Container className="max-w-4xl py-10">
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-brand-700">Blog</Link>
          <span>/</span>
          <span className="text-slate-800">{title}</span>
        </nav>
        <PageHeader eyebrow="FreeToolKit guide" title={title} description={description} badges={["Productivity", "No signup", "Browser-based"]} />
        <article className="prose-lite mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {children}
        </article>
        <Card className="mt-8 p-6">
          <p className="text-sm font-black uppercase tracking-wide text-brand-600">Related tools</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              ["AI Tools", "/ai-tools"],
              ["PDF & Image", "/pdf-image"],
              ["All Tools", "/all-tools"]
            ].map(([label, href]) => (
              <Link key={href} href={href} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700">
                {label}
              </Link>
            ))}
          </div>
        </Card>
      </Container>
    </main>
  );
}

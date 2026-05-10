import Link from "next/link";
import { Container, PageHeader } from "@/components/ui";

export default function NotFound() {
  return (
    <main>
      <Container className="max-w-5xl py-12">
        <PageHeader
          eyebrow="404"
          title="Page not found"
          description="The page you requested does not exist, but the toolkit is still here. Search all tools or return home to keep working."
          badges={["Tools", "Guides", "No signup"]}
        />
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/all-tools" className="rounded-2xl bg-brand-600 px-6 py-3.5 text-center text-sm font-black text-white shadow-sm hover:bg-brand-700">
            Search all tools
          </Link>
          <Link href="/blog" className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-center text-sm font-black text-slate-800 shadow-sm hover:bg-brand-50">
            Read guides
          </Link>
          <Link href="/" className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-center text-sm font-black text-slate-800 shadow-sm hover:bg-brand-50">
            Go home
          </Link>
        </div>
      </Container>
    </main>
  );
}

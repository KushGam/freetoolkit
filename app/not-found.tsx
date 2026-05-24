import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested freetoolkitapp page could not be found.",
  robots: { index: false, follow: true }
};

export default function NotFound() {
  return (
    <main className="mesh-bg min-h-screen">
      <Container className="max-w-5xl py-12">
        <PageHeader
          eyebrow="404"
          title="Page not found"
          description="The page you requested does not exist, but the toolkit is still here. Search all tools or return home to keep working."
          badges={["Tools", "Guides", "No signup"]}
        />
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/all-tools" className="btn-primary">
            Search all tools
          </Link>
          <Link href="/blog" className="btn-secondary">
            Read guides
          </Link>
          <Link href="/" className="btn-secondary">
            Go home
          </Link>
        </div>
      </Container>
    </main>
  );
}

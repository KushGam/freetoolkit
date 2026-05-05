import type { Metadata } from "next";
import { Card, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Read the FreeToolKit terms of use for free online image, PDF, and student tools.",
  alternates: { canonical: "https://www.freetoolkitapp.com/terms" }
};

export default function TermsPage() {
  return (
    <main>
      <Container className="max-w-4xl py-12 sm:py-16">
      <PageHeader eyebrow="Legal" title="Terms of Use" description="Terms for using FreeToolKit's free online tools." badges={["Free tools", "Review results", "Use responsibly"]} />
      <Card className="prose-lite mt-6 p-6 sm:p-8">
        <p>
          FreeToolKit is provided for general productivity and educational use. Tools are offered as-is without a guarantee that results will meet every official, legal, academic, or technical requirement.
        </p>
        <p>
          You are responsible for reviewing downloaded files and calculated results before using them. GPA, CGPA, grade, compression, and PDF outputs may vary based on browser support, school policies, source files, and device limitations.
        </p>
        <p>
          You agree not to misuse the website, attempt to disrupt service, or use FreeToolKit for unlawful activity.
        </p>
      </Card>
      </Container>
    </main>
  );
}

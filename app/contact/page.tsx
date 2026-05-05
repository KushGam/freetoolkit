import type { Metadata } from "next";
import { Card, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact FreeToolKit",
  description: "Contact FreeToolKit for feedback, bug reports, and tool suggestions.",
  alternates: { canonical: "https://www.freetoolkitapp.com/contact" }
};

export default function ContactPage() {
  return (
    <main>
      <Container className="max-w-4xl py-12 sm:py-16">
      <PageHeader eyebrow="Contact" title="Contact" description="Send feedback, report bugs, or suggest a useful new tool." badges={["Feedback", "Bug reports", "Tool ideas"]} />
      <Card className="prose-lite mt-6 p-6 sm:p-8">
        <p>
          Have feedback, a bug report, or a tool suggestion? Send a message to the FreeToolKit team at <a className="font-bold text-brand-700" href="mailto:hello@freetoolkitapp.com">hello@freetoolkitapp.com</a>.
        </p>
        <p>
          Please do not send sensitive files by email. FreeToolKit tools are designed so common file tasks can be completed directly in your browser where possible.
        </p>
      </Card>
      </Container>
    </main>
  );
}

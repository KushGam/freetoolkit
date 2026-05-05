import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact FreeToolKit",
  description: "Contact FreeToolKit for feedback, bug reports, and tool suggestions.",
  alternates: { canonical: "https://www.freetoolkitapp.com/contact" }
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Contact</h1>
      <div className="prose-lite mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-8">
        <p>
          Have feedback, a bug report, or a tool suggestion? Send a message to the FreeToolKit team at <a className="font-bold text-brand-700" href="mailto:hello@freetoolkitapp.com">hello@freetoolkitapp.com</a>.
        </p>
        <p>
          Please do not send sensitive files by email. FreeToolKit tools are designed so common file tasks can be completed directly in your browser where possible.
        </p>
      </div>
    </main>
  );
}

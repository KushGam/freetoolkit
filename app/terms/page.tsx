import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Read the FreeToolKit terms of use for free online image, PDF, and student tools.",
  alternates: { canonical: "https://www.freetoolkitapp.com/terms" }
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-black text-slate-950">Terms of Use</h1>
      <div className="prose-lite mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p>
          FreeToolKit is provided for general productivity and educational use. Tools are offered as-is without a guarantee that results will meet every official, legal, academic, or technical requirement.
        </p>
        <p>
          You are responsible for reviewing downloaded files and calculated results before using them. GPA, CGPA, grade, compression, and PDF outputs may vary based on browser support, school policies, source files, and device limitations.
        </p>
        <p>
          You agree not to misuse the website, attempt to disrupt service, or use FreeToolKit for unlawful activity.
        </p>
      </div>
    </main>
  );
}

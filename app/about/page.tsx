import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About FreeToolKit",
  description: "Learn about FreeToolKit, a free no-login website for browser-based image, PDF, and student tools."
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-black text-slate-950">About FreeToolKit</h1>
      <div className="prose-lite mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p>
          FreeToolKit is a collection of free online tools for common image, PDF, and student tasks. The goal is simple: open the page, finish the job, and move on without creating an account or paying for an API-backed workflow.
        </p>
        <p>
          The website is built with a mobile-first interface, reusable ad placements, and useful SEO content on every tool page. Image and PDF tools are designed to run in the browser where possible, while calculators and writing tools work instantly on the client side.
        </p>
      </div>
    </main>
  );
}

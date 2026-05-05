import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read the FreeToolKit privacy policy for browser-based tools, analytics, advertising, and contact information.",
  alternates: { canonical: "https://www.freetoolkitapp.com/privacy" }
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Privacy Policy</h1>
      <div className="prose-lite mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-8">
        <p>
          FreeToolKit is built to be used without login. Image and PDF tools process files in the browser where possible. The site does not intentionally upload your selected files to a FreeToolKit server for these client-side tools.
        </p>
        <p>
          FreeToolKit may use Google AdSense or another advertising provider. Advertising or analytics scripts may use cookies or similar technologies according to their own policies.
        </p>
        <p>
          If you contact us by email, we may use your email address to respond to your message. Do not send confidential documents or sensitive personal files through contact email.
        </p>
      </div>
    </main>
  );
}

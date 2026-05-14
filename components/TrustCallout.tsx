/** Short, factual trust block for legal and About-style pages (AdSense / E-E-A-T). */
export function TrustCallout({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`rounded-xl border border-slate-200 bg-slate-50/90 p-4 text-sm leading-relaxed text-slate-700 shadow-sm ${className}`}
      aria-label="How this site works"
    >
      <p className="font-semibold text-slate-900">How FreeToolKit works</p>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 marker:text-slate-400">
        <li>Most utilities run in your browser; many PDF and image workflows are designed to avoid uploading files to our servers.</li>
        <li>No signup or paid subscription is required to use the free tools listed on the site.</li>
        <li>
          A smaller set of AI-assisted tools may send the text you enter to a model provider to generate a reply—see each tool page for scope and limits.
        </li>
        <li>
          Contact:{" "}
          <a className="font-bold text-brand-700 hover:text-brand-900" href="mailto:hello@freetoolkitapp.com">
            hello@freetoolkitapp.com
          </a>
          . We do not promise specific rankings, grades, job outcomes, or legal results from any tool output.
        </li>
      </ul>
    </aside>
  );
}

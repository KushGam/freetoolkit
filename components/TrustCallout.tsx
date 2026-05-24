/** Short, factual trust block for legal and About-style pages (AdSense / E-E-A-T). */
export function TrustCallout({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`rounded-xl border border-white/[0.08] bg-surface-card/90 p-4 text-sm leading-relaxed text-ink-secondary shadow-sm ${className}`}
      aria-label="How this site works"
    >
      <p className="font-semibold text-ink-primary">How freetoolkitapp works</p>
      <ul className="mt-2 list-disc space-y-1.5 pl-5 marker:text-ink-muted">
        <li>freetoolkitapp is founder-led and independently operated — not a faceless tool directory.</li>
        <li>Most PDF and image utilities run in your browser; many workflows avoid uploading files to our servers.</li>
        <li>No signup or paid subscription is required to use the free tools listed on the site.</li>
        <li>
          AI-assisted tools send only the text or inputs you provide to generate a reply — each tool page shows a privacy label. Review output before submitting to school or work.
        </li>
        <li>
          Contact:{" "}
          <a className="font-bold text-indigo-400 hover:text-ink-primary" href="mailto:hello@freetoolkitapp.com">
            hello@freetoolkitapp.com
          </a>
          . We do not promise specific rankings, grades, job outcomes, or legal results from any tool output.
        </li>
      </ul>
    </aside>
  );
}

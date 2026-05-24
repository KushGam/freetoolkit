import Link from "next/link";

/**
 * Long-form homepage copy for E-E-A-T, AdSense depth targets, and internal linking.
 */
export function HomeSeoContent() {
  return (
    <section className="prose-lite mt-16 rounded-[2rem] border border-white/[0.08] bg-surface-card p-6 shadow-[0_20px_55px_rgba(15,23,42,0.06)] sm:p-10">
      <h2 className="font-display text-2xl font-bold tracking-tight text-ink-primary sm:text-3xl">Why freetoolkitapp exists</h2>
      <p>
        Most people do not wake up wanting &quot;utilities.&quot; They need a smaller PDF before a portal times out, a cleaner image before an upload fails, a resume draft before an application deadline, or a JSON formatter before a deploy rejects malformed config.{" "}
        <Link href="/all-tools" className="font-bold text-indigo-400 hover:text-ink-primary">freetoolkitapp</Link>{" "}
        bundles those outcomes into one focused workspace—about 60 curated tools instead of hundreds of thin pages.
      </p>
      <p>
        The platform is built with Next.js and a mobile-first layout because real work happens on phones, tablets, and laptops alike. When a page loads, you should immediately understand what the tool does, where your data goes, and what to double-check before you submit results. That transparency is why we publish{" "}
        <Link href="/blog" className="font-bold text-indigo-400 hover:text-ink-primary">long-form guides</Link>{" "}
        next to the utilities themselves.
      </p>

      <h3 className="mt-10 font-display text-xl font-bold text-ink-primary">Browser-first PDF and image workflows</h3>
      <p>
        PDFs can hide scanned pages, embedded fonts, security flags, and huge attachments. The{" "}
        <Link href="/pdf-image" className="font-bold text-indigo-400 hover:text-ink-primary">PDF &amp; Image</Link>{" "}
        hub focuses on high-traffic wins: merge packets, split chapters, compress uploads, rotate mis-scanned pages, convert images to PDF, and move between Word and PDF when you need an editable draft.
      </p>
      <p>
        Images power modern marketing but sink performance when teams forget to resize or export the wrong format. Use{" "}
        <Link href="/image-compressor" className="font-bold text-indigo-400 hover:text-ink-primary">Image Compressor</Link>,{" "}
        <Link href="/image-resizer" className="font-bold text-indigo-400 hover:text-ink-primary">Image Resizer</Link>, and{" "}
        <Link href="/webp-converter" className="font-bold text-indigo-400 hover:text-ink-primary">WebP Converter</Link>{" "}
        as a lightweight publishing pipeline. For format decisions, read{" "}
        <Link href="/blog/png-vs-jpg-vs-webp" className="font-bold text-indigo-400 hover:text-ink-primary">PNG vs JPG vs WebP</Link>.
      </p>

      <h3 className="mt-10 font-display text-xl font-bold text-ink-primary">AI writing with human review</h3>
      <p>
        The{" "}
        <Link href="/ai-tools" className="font-bold text-indigo-400 hover:text-ink-primary">AI Tools</Link>{" "}
        category covers resumes, cover letters, grammar fixes, essays, LinkedIn summaries, interview answers, study notes, summarizing, and paraphrasing. AI can explain a concept or reorganize messy notes, but it cannot replace your judgment. Always read outputs, verify facts, and follow your school&apos;s or employer&apos;s generative AI rules.
      </p>
      <p>
        For structured career documents, start with the{" "}
        <Link href="/ai-resume-cover-letter" className="font-bold text-indigo-400 hover:text-ink-primary">Resume &amp; Cover Letter</Link>{" "}
        workflow and pair it with the{" "}
        <Link href="/resume-ats-checker" className="font-bold text-indigo-400 hover:text-ink-primary">ATS Checker</Link>{" "}
        before you apply.
      </p>

      <h3 className="mt-10 font-display text-xl font-bold text-ink-primary">Developers, SEOs, and calculators</h3>
      <p>
        Shipping software still involves endless small conversions: JSON from logs, URLs from share sheets, JWT claims in support tickets. The{" "}
        <Link href="/developer" className="font-bold text-indigo-400 hover:text-ink-primary">Developer</Link>{" "}
        hub keeps those utilities fast. If you publish content, pair{" "}
        <Link href="/seo-tools" className="font-bold text-indigo-400 hover:text-ink-primary">SEO Tools</Link>{" "}
        like meta tag and schema helpers with your landing pages so titles and descriptions match what you intend to share.
      </p>
      <p>
        For everyday math, the{" "}
        <Link href="/calculators" className="font-bold text-indigo-400 hover:text-ink-primary">Calculators</Link>{" "}
        hub covers BMI, loan EMI, percentages, discounts, age, interest, units, and scientific math—instant results with no signup.
      </p>

      <h3 className="mt-10 font-display text-xl font-bold text-ink-primary">Privacy, ads, and trust</h3>
      <p>
        freetoolkitapp is ad-supported because we want tools to remain free at the point of use. That only works if visitors trust the site: clear{" "}
        <Link href="/privacy-policy" className="font-bold text-indigo-400 hover:text-ink-primary">Privacy Policy</Link>, an honest{" "}
        <Link href="/disclaimer" className="font-bold text-indigo-400 hover:text-ink-primary">Disclaimer</Link>, and a{" "}
        <Link href="/contact" className="font-bold text-indigo-400 hover:text-ink-primary">Contact</Link>{" "}
        channel for reporting issues. We avoid fake testimonials and inflated statistics because credibility is the point of upgrading from a thin utility directory to a real product.
      </p>

      <h3 className="mt-10 font-display text-xl font-bold text-ink-primary">Explore next</h3>
      <p>
        New visitors often start with{" "}
        <Link href="/merge-pdf" className="font-bold text-indigo-400 hover:text-ink-primary">Merge PDF</Link>,{" "}
        <Link href="/compress-pdf" className="font-bold text-indigo-400 hover:text-ink-primary">Compress PDF</Link>, or{" "}
        <Link href="/image-compressor" className="font-bold text-indigo-400 hover:text-ink-primary">Image Compressor</Link>.{" "}
        Power users bookmark{" "}
        <Link href="/sitemap" className="font-bold text-indigo-400 hover:text-ink-primary">the HTML sitemap</Link>{" "}
        for quick jumps. However you navigate, the goal stays constant: finish practical work quickly, understand what happened, and leave with files you are proud to send.
      </p>
    </section>
  );
}

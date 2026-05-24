import Link from "next/link";
import type { ToolContentSection } from "@/data/tool-content-types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ToolTableOfContents({ sections }: { sections: ToolContentSection[] }) {
  const items = sections.flatMap((section) => {
    const main = { id: section.id, label: section.heading, depth: 2 as const };
    const subs =
      section.subsections?.map((sub) => ({
        id: slugify(`${section.id}-${sub.heading}`),
        label: sub.heading,
        depth: 3 as const
      })) ?? [];
    return [main, ...subs];
  });

  if (items.length < 3) return null;

  return (
    <nav aria-label="On this page" className="glass-panel sticky top-24 hidden max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl p-5 lg:block">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">On this page</p>
      <ul className="mt-3 grid gap-1.5 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block rounded-lg py-1.5 text-ink-muted transition hover:bg-surface-card/5 hover:text-ink-primary ${item.depth === 3 ? "pl-3 text-xs" : "font-medium text-ink-secondary"}`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function SubsectionBlock({ id, heading, paragraphs }: { id: string; heading: string; paragraphs: string[] }) {
  return (
    <div id={id} className="scroll-mt-28">
      <h3>{heading}</h3>
      {paragraphs.map((p) => (
        <p key={p.slice(0, 48)}>{p}</p>
      ))}
    </div>
  );
}

export function ToolLongFormContent({
  sections,
  relatedLinks
}: {
  sections: ToolContentSection[];
  relatedLinks?: Array<{ label: string; href: string; anchorContext: string }>;
}) {
  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
      <article className="prose-lite min-w-0">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-28 border-t border-white/10 pt-10 first:border-t-0 first:pt-0">
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
            {section.subsections?.map((sub) => {
              const subId = slugify(`${section.id}-${sub.heading}`);
              return <SubsectionBlock key={subId} id={subId} heading={sub.heading} paragraphs={sub.paragraphs} />;
            })}
          </section>
        ))}
        {relatedLinks?.length ? (
          <section className="scroll-mt-28 border-t border-white/10 pt-10">
            <h2>Related tools and guides</h2>
            <ul className="mt-4 grid gap-3 not-prose">
              {relatedLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="group block rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/20 hover:bg-white/[0.04]">
                    <span className="font-semibold text-ink-primary group-hover:text-white">{link.label}</span>
                    <span className="mt-1 block text-sm text-ink-muted">{link.anchorContext}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
      <ToolTableOfContents sections={sections} />
    </div>
  );
}

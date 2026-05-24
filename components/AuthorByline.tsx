import { founder } from "@/data/site-trust";

export function AuthorByline({ publishedAt, updatedAt }: { publishedAt: string; updatedAt?: string }) {
  const formatted = new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(
    new Date(`${publishedAt}T00:00:00Z`)
  );

  return (
    <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
      <span>
        By{" "}
        <a
          className="font-semibold text-ink-secondary transition hover:text-indigo-400"
          href={founder.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {founder.name}
        </a>
      </span>
      <span aria-hidden="true">·</span>
      <time dateTime={publishedAt}>{formatted}</time>
      {updatedAt && updatedAt !== publishedAt ? (
        <>
          <span aria-hidden="true">·</span>
          <span>Updated {new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(`${updatedAt}T00:00:00Z`))}</span>
        </>
      ) : null}
    </p>
  );
}

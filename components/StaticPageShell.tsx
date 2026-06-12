import { SectionHeader } from "@/components/SectionHeader";

export function StaticPageShell({
  eyebrow,
  title,
  subtitle,
  children
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} align="left" />
        <div className="prose-site mt-12">{children}</div>
      </div>
    </main>
  );
}

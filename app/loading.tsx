import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <main className="mesh-bg min-h-screen">
      <Container className="max-w-6xl py-12">
        <div className="animate-pulse rounded-[2rem] border border-white/[0.08] bg-surface-card p-8 shadow-sm">
          <div className="h-4 w-32 rounded-full bg-surface-card/10" />
          <div className="mt-6 h-10 max-w-2xl rounded-2xl bg-surface-card/10" />
          <div className="mt-4 h-5 max-w-3xl rounded-full bg-surface-section" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="h-40 rounded-2xl bg-surface-section" />
            <div className="h-40 rounded-2xl bg-surface-section" />
            <div className="h-40 rounded-2xl bg-surface-section" />
          </div>
        </div>
      </Container>
    </main>
  );
}

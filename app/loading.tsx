import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <main>
      <Container className="max-w-6xl py-12">
        <div className="animate-pulse rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="h-4 w-32 rounded-full bg-slate-200" />
          <div className="mt-6 h-10 max-w-2xl rounded-2xl bg-slate-200" />
          <div className="mt-4 h-5 max-w-3xl rounded-full bg-slate-100" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="h-40 rounded-2xl bg-slate-100" />
            <div className="h-40 rounded-2xl bg-slate-100" />
            <div className="h-40 rounded-2xl bg-slate-100" />
          </div>
        </div>
      </Container>
    </main>
  );
}

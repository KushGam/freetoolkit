export function HomeToolSearch() {
  return (
    <div className="relative z-10 mx-auto mt-7 w-full max-w-3xl">
      <label className="sr-only" htmlFor="home-tool-search">Search tools</label>
      <form action="/all-tools" className="flex flex-col gap-2 rounded-[1.35rem] border border-white/[0.08] bg-gradient-to-b from-surface-card/95 to-surface-section/95 p-2 shadow-glow backdrop-blur sm:flex-row sm:items-center">
        <div className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-lg border border-white/[0.08] bg-surface-section px-4 transition focus-within:border-indigo-400/30 focus-within:ring-2 focus-within:ring-indigo-400/20">
          <span className="text-xs font-black uppercase tracking-wide text-indigo-400" aria-hidden="true">Find</span>
          <input
            id="home-tool-search"
            name="q"
            type="search"
            placeholder="Search tools..."
            autoComplete="off"
            className="min-h-12 min-w-0 flex-1 bg-transparent text-base font-semibold text-ink-primary outline-none placeholder:text-ink-muted"
          />
        </div>
        <button className="btn-primary min-h-12 rounded-lg px-6 sm:min-w-28" type="submit">
          Search
        </button>
      </form>
    </div>
  );
}

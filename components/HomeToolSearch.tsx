export function HomeToolSearch() {
  return (
    <div className="relative z-10 mx-auto mt-7 w-full max-w-3xl">
      <label className="sr-only" htmlFor="home-tool-search">Search tools</label>
      <form action="/all-tools" className="flex flex-col gap-2 rounded-[1.35rem] border border-slate-200/90 bg-gradient-to-b from-white/95 to-slate-50/95 p-2 shadow-[0_18px_45px_rgba(15,23,42,0.10)] backdrop-blur sm:flex-row sm:items-center">
        <div className="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-2xl bg-white px-4 ring-1 ring-slate-100 transition focus-within:bg-white focus-within:ring-4 focus-within:ring-brand-100">
          <span className="text-xs font-black uppercase tracking-wide text-brand-600" aria-hidden="true">Find</span>
          <input
            id="home-tool-search"
            name="q"
            type="search"
            placeholder="Search tools..."
            autoComplete="off"
            className="min-h-12 min-w-0 flex-1 bg-transparent text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>
        <button className="min-h-12 rounded-2xl bg-gradient-to-b from-brand-500 to-brand-700 px-6 text-sm font-black text-white shadow-[0_12px_24px_rgba(127,29,29,0.24)] transition hover:-translate-y-0.5 hover:from-brand-600 hover:to-brand-700 sm:min-w-28" type="submit">
          Search
        </button>
      </form>
    </div>
  );
}

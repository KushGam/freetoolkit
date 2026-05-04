import { cn } from "@/lib/utils";

export function AdSlot({
  size,
  type
}: {
  size?: "leaderboard" | "rectangle" | "responsive";
  type?: "leaderboard" | "rectangle" | "responsive";
}) {
  const variant = size ?? type ?? "responsive";

  return (
    <div
      className={cn(
        "my-8 flex items-center justify-center rounded-2xl border border-dashed border-slate-300/90 bg-slate-50 text-[11px] font-black uppercase tracking-[0.24em] text-slate-400 shadow-inner",
        variant === "leaderboard" && "mx-auto min-h-24 w-full max-w-[728px] sm:h-[90px]",
        variant === "rectangle" && "mx-auto h-[250px] w-full max-w-[300px]",
        variant === "responsive" && "min-h-28 w-full"
      )}
      aria-label="Advertisement placeholder"
    >
      <span className="rounded-full bg-white/80 px-3 py-1 ring-1 ring-slate-200">Advertisement</span>
    </div>
  );
}

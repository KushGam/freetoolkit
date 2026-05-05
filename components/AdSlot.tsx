import { AdSense } from "@/components/AdSense";

const AD_SLOTS = {
  leaderboard: "1234567890",
  rectangle: "2345678901",
  responsive: "3456789012"
};

export function AdSlot(_props: {
  size?: "leaderboard" | "rectangle" | "responsive";
  type?: "leaderboard" | "rectangle" | "responsive";
  priority?: boolean;
}) {
  const placement = _props.size ?? _props.type ?? "responsive";
  const adFormat = placement === "rectangle" ? "rectangle" : "auto";

  return (
    <div className="my-8 min-h-[120px] overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/50">
      <AdSense adSlot={AD_SLOTS[placement]} adFormat={adFormat} priority={Boolean(_props.priority)} />
    </div>
  );
}

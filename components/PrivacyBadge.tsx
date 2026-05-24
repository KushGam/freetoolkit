import { getToolPrivacyTier, privacyTierMeta, type PrivacyTier } from "@/data/site-trust";
import type { Tool } from "@/data/tools";
import { cn } from "@/lib/utils";

export function PrivacyBadge({ tier, className }: { tier: PrivacyTier; className?: string }) {
  const meta = privacyTierMeta[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        meta.badgeClass,
        className
      )}
    >
      {meta.shortLabel}
    </span>
  );
}

export function ToolPrivacyNotice({ tool }: { tool: Tool }) {
  const tier = getToolPrivacyTier(tool);
  const meta = privacyTierMeta[tier];
  return (
    <p className="mx-auto mt-5 max-w-3xl rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-center text-sm text-ink-muted">
      <PrivacyBadge tier={tier} className="mr-2 align-middle" />
      {meta.description}
    </p>
  );
}

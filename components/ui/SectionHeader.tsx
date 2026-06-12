export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left"
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-gold">{eyebrow}</p>
      <h2 className="font-heading text-[clamp(24px,3vw,36px)] font-extrabold leading-[1.1] tracking-[-0.025em] text-text">
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-2.5 max-w-lg text-[15px] leading-[1.65] text-text-2 ${align === "center" ? "mx-auto" : ""}`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

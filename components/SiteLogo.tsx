import Link from "next/link";
import { BrandMark } from "@/components/BrandMark";
import { siteName } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function SiteLogo({
  className,
  asLink = true,
  href = "/"
}: {
  className?: string;
  asLink?: boolean;
  href?: string;
}) {
  const content = (
    <>
      <BrandMark />
      <span className="text-lg font-semibold tracking-tight text-ink-primary">{siteName}</span>
    </>
  );

  if (!asLink) {
    return <span className={cn("flex items-center gap-2.5", className)}>{content}</span>;
  }

  return (
    <Link href={href} className={cn("flex items-center gap-2.5", className)} aria-label={`${siteName} home`}>
      {content}
    </Link>
  );
}

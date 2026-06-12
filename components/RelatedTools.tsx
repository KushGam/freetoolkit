import { SectionHeader } from "@/components/ui/SectionHeader";
import { ToolCard } from "@/components/ui/ToolCard";
import { getToolPrivacyTier } from "@/data/site-trust";
import { type Tool } from "@/data/tools";

function privacyLabel(tool: Tool) {
  const tier = getToolPrivacyTier(tool);
  if (tier === "ai") return "✦ AI powered";
  if (tier === "hybrid") return "⚡ Hybrid";
  return "🔒 Browser only";
}

export function RelatedTools({ tools }: { tools: Tool[] }) {
  return (
    <section className="mt-12">
      <SectionHeader eyebrow="Related" title="Related tools" align="left" />
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard
            key={tool.slug}
            slug={tool.slug}
            name={tool.title}
            desc={tool.description}
            category={tool.category}
            privacy={privacyLabel(tool)}
          />
        ))}
      </div>
    </section>
  );
}

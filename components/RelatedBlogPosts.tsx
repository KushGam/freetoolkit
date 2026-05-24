import Link from "next/link";
import { blogHref, type BlogPost } from "@/data/blog";
import { Badge, Card } from "@/components/ui";

export function RelatedBlogPosts({ posts, title = "Related guides" }: { posts: BlogPost[]; title?: string }) {
  if (!posts.length) return null;

  return (
    <section className="mt-12">
      <Badge className="border-indigo-400/20 bg-indigo-500/10 text-[11px] font-black uppercase tracking-wide text-indigo-400">Guides</Badge>
      <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink-primary">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={blogHref(post)} className="group block h-full focus:outline-none focus:ring-4 focus:ring-indigo-400/30">
            <Card className="flex h-full flex-col p-5  group-hover:border-indigo-400/30">
              <p className="text-xs font-black uppercase tracking-wide text-indigo-400">{post.category}</p>
              <h3 className="mt-3 text-lg font-bold tracking-tight text-ink-primary group-hover:text-indigo-400">{post.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-ink-muted">{post.description}</p>
              <p className="mt-4 text-xs font-bold text-ink-muted">{post.readingTime}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

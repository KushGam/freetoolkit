import Link from "next/link";
import { blogHref, type BlogPost } from "@/data/blog";
import { Badge, Card } from "@/components/ui";

export function RelatedBlogPosts({ posts, title = "Related guides" }: { posts: BlogPost[]; title?: string }) {
  if (!posts.length) return null;

  return (
    <section className="mt-12">
      <Badge className="border-brand-100 bg-brand-50 text-[11px] font-black uppercase tracking-wide text-brand-700">Guides</Badge>
      <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-950">{title}</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.slug} href={blogHref(post)} className="group block h-full focus:outline-none focus:ring-4 focus:ring-brand-100">
            <Card className="flex h-full flex-col p-5 group-hover:-translate-y-1 group-hover:border-brand-200">
              <p className="text-xs font-black uppercase tracking-wide text-brand-600">{post.category}</p>
              <h3 className="mt-3 text-lg font-bold tracking-tight text-slate-950 group-hover:text-brand-700">{post.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{post.description}</p>
              <p className="mt-4 text-xs font-bold text-slate-500">{post.readingTime}</p>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

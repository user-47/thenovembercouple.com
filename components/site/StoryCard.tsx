import Link from "next/link";
import { Frame } from "@/components/brand/Frame";
import { getPillar } from "@/content/pillars";
import { formatYmd } from "@/lib/dates";
import type { PostMeta } from "@/lib/journal";

export function StoryCard({ post, seed = 0 }: { post: PostMeta; seed?: number }) {
  const pillar = post.pillar ? getPillar(post.pillar) : undefined;
  return (
    <Link href={`/journal/${post.slug}`} className="group block">
      <Frame
        src={post.cover}
        alt={post.title}
        label={post.coverLabel ?? post.title}
        seed={seed}
        className="aspect-[4/3] rounded-sm transition-opacity duration-500 group-hover:opacity-90"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
      <p className="eyebrow mt-5 text-[0.62rem] text-bronze">
        {[pillar?.title, post.category, formatYmd(post.date, { weekday: false, year: true })].filter(Boolean).join(" · ")}
      </p>
      <h3 className="display mt-2 text-2xl leading-snug md:text-[1.7rem]">{post.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/70">{post.excerpt}</p>
      <span className="text-link mt-4 inline-block text-sm">Read the story →</span>
    </Link>
  );
}

const cols = { 1: "max-w-2xl", 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3" } as const;

/** Stories laid out to fit however many there are, so new entries never need a redesign. */
export function StoryGrid({ posts }: { posts: PostMeta[] }) {
  return (
    <div className={`grid gap-x-8 gap-y-14 ${cols[Math.min(posts.length, 3) as 1 | 2 | 3]}`}>
      {posts.map((p, i) => (
        <StoryCard key={p.slug} post={p} seed={i + 1} />
      ))}
    </div>
  );
}

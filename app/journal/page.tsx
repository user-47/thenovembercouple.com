import type { Metadata } from "next";
import Link from "next/link";
import { StoryGrid } from "@/components/site/StoryCard";
import { pillars } from "@/content/pillars";
import { getAllPosts } from "@/lib/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Travel stories, guides, homes, food and family life from The November Couple.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  const posts = getAllPosts();
  return (
    <div className="mx-auto max-w-7xl px-5 pt-12 sm:px-8 md:pt-20">
      <p className="eyebrow text-bronze">The journal</p>
      <h1 className="display mt-5 text-5xl md:text-7xl">Stories worth sharing</h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
        The longer stories behind the posts — travel, beautiful spaces, good food and family life.
      </p>
      <nav aria-label="Collections" className="mt-10 flex flex-wrap gap-2">
        {pillars.map((p) => (
          <Link key={p.slug} href={`/${p.slug}`} className="btn btn-ghost btn-sm">
            {p.title}
          </Link>
        ))}
      </nav>
      <div className="mt-16 border-t border-rule pt-14">
        <StoryGrid posts={posts} />
      </div>
    </div>
  );
}

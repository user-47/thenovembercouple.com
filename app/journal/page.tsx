import type { Metadata } from "next";
import Link from "next/link";
import { Frame } from "@/components/brand/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatYmd } from "@/lib/dates";
import { getAllPosts } from "@/lib/journal";

export const metadata: Metadata = { title: "Journal", description: "Stories, family travel guides and booking calendars from The November Couple." };

export default function JournalPage() {
  const posts = getAllPosts();
  return (
    <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-24">
      <SectionHeading eyebrow="Journal" title="Stories & guides" intro="Notes from the road — what worked, what didn't, and how to do it yourself." />
      <div className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2">
        {posts.map((p, i) => (
          <Reveal key={p.slug} delay={(i % 2) * 0.1}>
            <Link href={`/journal/${p.slug}`} className="group block">
              <Frame src={p.cover} alt={p.title} label={p.coverLabel} seed={i + 2} className="aspect-[3/2]" sizes="(max-width: 768px) 100vw, 50vw" />
              <p className="eyebrow mt-6 text-stone">
                {p.category} · {formatYmd(p.date, { weekday: false, year: true })}
              </p>
              <h2 className="display mt-2 text-3xl sm:text-4xl">{p.title}</h2>
              <p className="mt-3 text-espresso/80">{p.excerpt}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

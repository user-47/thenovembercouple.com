import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Frame } from "@/components/brand/Frame";
import { getPillar } from "@/content/pillars";
import { formatYmd } from "@/lib/dates";
import { getAllPosts, getPost } from "@/lib/journal";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const { meta } = post;
  return {
    title: meta.title,
    description: meta.excerpt,
    alternates: { canonical: `/journal/${meta.slug}` },
    openGraph: { type: "article", title: meta.title, description: meta.excerpt, publishedTime: meta.date, ...(meta.cover ? { images: [meta.cover] } : {}) },
  };
}

const components = {
  h2: (p: React.ComponentProps<"h2">) => <h2 className="display mb-4 mt-14 text-4xl" {...p} />,
  h3: (p: React.ComponentProps<"h3">) => <h3 className="display mb-3 mt-10 text-2xl" {...p} />,
  p: (p: React.ComponentProps<"p">) => <p className="my-5 text-lg leading-[1.8] text-espresso/90" {...p} />,
  ul: (p: React.ComponentProps<"ul">) => <ul className="my-6 space-y-3 pl-5 text-lg leading-relaxed text-espresso/90 [&>li]:list-[square] [&>li]:marker:text-bronze" {...p} />,
  a: ({ href = "", ...p }: React.ComponentProps<"a">) =>
    href.startsWith("/") ? <Link href={href} className="underline decoration-bronze underline-offset-4" {...p} /> : <a href={href} target="_blank" rel="noopener noreferrer" className="underline decoration-bronze underline-offset-4" {...p} />,
  strong: (p: React.ComponentProps<"strong">) => <strong className="font-medium text-ink" {...p} />,
};

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const { meta, content } = post;
  const pillar = meta.pillar ? getPillar(meta.pillar) : undefined;
  return (
    <article className="px-5 pt-12 sm:px-8 md:pt-20">
      <header className="mx-auto max-w-3xl text-center">
        <p className="eyebrow text-bronze">
          {pillar && (
            <>
              <Link href={`/${pillar.slug}`} className="link-underline">
                {pillar.title}
              </Link>
              {" · "}
            </>
          )}
          {meta.category} · {formatYmd(meta.date, { weekday: false, year: true })}
        </p>
        <h1 className="display mt-6 text-balance text-5xl sm:text-6xl">{meta.title}</h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink/75">{meta.excerpt}</p>
      </header>
      <Frame
        src={meta.cover}
        alt={meta.title}
        label={meta.coverLabel ?? meta.title}
        seed={2}
        priority
        className="mx-auto mt-12 aspect-[16/9] max-w-5xl rounded-sm"
        sizes="(max-width: 1024px) 100vw, 1024px"
      />
      <div className="mx-auto mt-12 max-w-2xl">
        <MDXRemote source={content} components={components} />
      </div>
      {meta.destination && (
        <div className="mx-auto mt-16 max-w-2xl border-t border-rule pt-10 text-center">
          <Link href={`/trips/${meta.destination}`} className="btn btn-primary">
            Read the full trip story
          </Link>
        </div>
      )}
    </article>
  );
}

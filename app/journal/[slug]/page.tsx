import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Arc } from "@/components/brand/Arc";
import { formatYmd } from "@/lib/dates";
import { getAllPosts, getPost } from "@/lib/journal";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  return post ? { title: post.meta.title, description: post.meta.excerpt, openGraph: { type: "article" } } : {};
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
  return (
    <article className="mx-auto max-w-2xl px-5 pt-16 sm:pt-24">
      <header className="text-center">
        <p className="eyebrow text-stone">
          {meta.category} · {formatYmd(meta.date, { weekday: false, year: true })}
        </p>
        <h1 className="display mt-6 text-5xl sm:text-6xl">{meta.title}</h1>
        <Arc className="mx-auto mt-8" width={160} />
      </header>
      <div className="mt-12">
        <MDXRemote source={content} components={components} />
      </div>
      {meta.destination && (
        <div className="mt-16 border-t border-rule pt-10 text-center">
          <Link href={`/trips/${meta.destination}/planner`} className="btn btn-primary">
            Open the trip planner
          </Link>
        </div>
      )}
    </article>
  );
}

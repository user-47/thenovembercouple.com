import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Frame } from "@/components/brand/Frame";
import { StoryGrid } from "@/components/site/StoryCard";
import { Icon } from "@/components/ui/Icon";
import { getPillar, pillars } from "@/content/pillars";
import { site } from "@/content/site";
import { getAllDestinations, tripCities, tripDateRange } from "@/lib/destinations";
import { getAllPosts } from "@/lib/journal";

export const dynamicParams = false;

export function generateStaticParams() {
  return pillars.map((p) => ({ pillar: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ pillar: string }> }): Promise<Metadata> {
  const p = getPillar((await params).pillar);
  if (!p) return {};
  return { title: p.title, description: p.description, alternates: { canonical: `/${p.slug}` }, openGraph: { title: `${p.title} · ${site.name}`, description: p.description } };
}

export default async function PillarPage({ params }: { params: Promise<{ pillar: string }> }) {
  const p = getPillar((await params).pillar);
  if (!p) notFound();
  const posts = getAllPosts(p.slug);
  const trips = p.slug === "travel" ? getAllDestinations().filter((b) => b.destination.status === "live") : [];
  const empty = posts.length === 0 && trips.length === 0;

  return (
    <>
      <section className="mx-auto grid max-w-7xl items-end gap-10 px-5 pt-12 sm:px-8 md:grid-cols-12 md:pt-20">
        <div className="md:col-span-6">
          <p className="eyebrow inline-flex items-center gap-3 text-bronze">
            <Icon name={p.icon} className="h-5 w-5" /> Collection
          </p>
          <h1 className="display mt-5 text-5xl md:text-7xl">{p.title}</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/80">{p.description}</p>
        </div>
        <Frame src={p.image} alt={p.imageAlt ?? p.title} position={p.imagePosition} label={`${p.title} — collection cover`} seed={pillars.indexOf(p)} className="aspect-[16/10] rounded-sm md:col-span-6" sizes="(max-width: 768px) 100vw, 50vw" priority />
      </section>

      {trips.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8 md:pt-28">
          <p className="eyebrow text-bronze">Trips</p>
          <ul className="mt-8 divide-y divide-rule border-y border-rule">
            {trips.map(({ destination: d, itinerary }) => (
              <li key={d.slug}>
                <Link href={`/trips/${d.slug}`} className="group grid items-center gap-6 py-8 md:grid-cols-12">
                  <Frame src={d.coverImage} alt={d.coverImageAlt ?? d.name} position="50% 62%" label={`${d.name} — trip cover`} seed={1} className="aspect-[4/3] rounded-sm md:col-span-4" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="md:col-span-7 md:col-start-6">
                    <p className="eyebrow text-[0.62rem] text-stone">
                      {tripDateRange(d.ourTrip.start, d.ourTrip.end)} · {itinerary.days.length} days
                    </p>
                    <h2 className="display mt-3 text-4xl md:text-5xl">{d.name}</h2>
                    <p className="mt-3 text-ink/75">{tripCities(d.cities).join(" · ")}</p>
                    <p className="mt-4 max-w-xl leading-relaxed text-ink/80">{d.tagline}</p>
                    <span className="text-link mt-5 inline-block text-sm">Read the story →</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {posts.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8 md:pt-28">
          <p className="eyebrow text-bronze">Stories</p>
          <div className="mt-8">
            <StoryGrid posts={posts} />
          </div>
        </section>
      )}

      {empty && (
        <section className="mx-auto max-w-2xl px-5 pt-24 text-center sm:px-8">
          <p className="display text-3xl md:text-4xl">The first {p.title.toLowerCase()} stories are on their way.</p>
          <p className="mt-4 text-ink/75">Follow along on Instagram while we put them together.</p>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-8">
            <Icon name="instagram" className="h-4 w-4" strokeWidth={1.5} /> {site.instagramHandle}
          </a>
        </section>
      )}
    </>
  );
}

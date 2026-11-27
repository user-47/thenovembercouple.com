import Link from "next/link";
import { Frame } from "@/components/brand/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import type { DestinationBundle } from "@/lib/destinations";
import type { PostMeta } from "@/lib/journal";
import { tripCities } from "./LatestTripCard";

interface Card {
  key: string;
  href: string;
  kind: string;
  title: string;
  meta: string;
  image?: string;
  label: string;
  cta: string;
}

/** Trips and guides in one library. Ends with an honest "next trip" card, never an invented one. */
export function TripGrid({ trips, posts }: { trips: DestinationBundle[]; posts: PostMeta[] }) {
  const cards: Card[] = [
    ...trips.map(({ destination: d, itinerary }) => {
      const cities = tripCities(d.cities);
      return {
        key: `trip-${d.slug}`,
        href: `/trips/${d.slug}`,
        kind: "Trip",
        title: d.name,
        meta: `${itinerary.days.length} days · ${cities.slice(0, 3).join(", ")}${cities.length > 3 ? ` +${cities.length - 3}` : ""} · ${site.kidsAges}`,
        image: d.coverImage,
        label: d.name,
        cta: "See the trip",
      };
    }),
    ...posts.map((p) => ({
      key: `post-${p.slug}`,
      href: `/journal/${p.slug}`,
      kind: p.category,
      title: p.title,
      meta: p.excerpt,
      image: p.cover,
      label: p.coverLabel ?? p.category,
      cta: "Read the guide",
    })),
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-28">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-stone">The library</p>
          <h2 className="display mt-4 text-4xl md:text-5xl">Trips and guides</h2>
        </div>
        <Link href="/journal" className="text-link shrink-0 text-sm">
          All stories →
        </Link>
      </div>
      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <li key={c.key}>
            <Reveal delay={(i % 4) * 0.06} className="h-full">
              <Link href={c.href} className="group flex h-full flex-col border border-rule bg-paper transition-colors hover:border-stone">
                <Frame src={c.image} alt={c.title} label={c.label} seed={i + 1} className="aspect-[4/5]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                <div className="flex flex-1 flex-col p-5">
                  <p className="eyebrow text-[0.62rem] text-stone">{c.kind}</p>
                  <h3 className="display mt-2 text-2xl leading-tight">{c.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-espresso/80">{c.meta}</p>
                  <span className="text-link mt-auto pt-5 text-sm">{c.cta} →</span>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
        <li>
          <div className="flex h-full min-h-64 flex-col justify-between border border-dashed border-rule p-5">
            <p className="eyebrow text-[0.62rem] text-stone">Next trip</p>
            <div>
              <p className="display text-2xl leading-tight">Coming soon</p>
              <p className="mt-2 text-sm leading-relaxed text-espresso/80">Follow along on Instagram to see where we go next.</p>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="text-link mt-5 inline-block text-sm">
                {site.instagramHandle} ↗
              </a>
            </div>
          </div>
        </li>
      </ul>
    </section>
  );
}

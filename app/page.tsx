import Image from "next/image";
import { Arc, Ring } from "@/components/brand/Arc";
import { BrandsBand } from "@/components/site/BrandsBand";
import { InstagramSection } from "@/components/site/InstagramGrid";
import { LatestTripCard } from "@/components/site/LatestTripCard";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { PlanningExtra } from "@/components/site/PlanningExtra";
import { TripGrid } from "@/components/site/TripGrid";
import mediaKit from "@/content/media-kit.json";
import { site } from "@/content/site";
import { getAllDestinations, getLatestTrip } from "@/lib/destinations";
import { getAllPosts } from "@/lib/journal";

export default function Home() {
  const latest = getLatestTrip();
  const trips = getAllDestinations().filter((b) => b.destination.status === "live");
  const posts = getAllPosts().slice(0, 2);
  const photo = site.heroImage;

  const followers = mediaKit.stats.find((s) => s.label === "Instagram followers")?.value;
  const trust = [
    latest && `Latest trip: ${latest.destination.name}, ${latest.itinerary.days.length} days`,
    followers && `${followers} on Instagram`,
    "New guides, a few times a year",
  ].filter((t): t is string => Boolean(t));

  return (
    <>
      {/* Hero — the couple, not a destination */}
      <section
        className={`relative flex overflow-hidden ${
          photo ? "min-h-[86svh] items-end" : "-mt-16 min-h-[88svh] items-center sm:-mt-20"
        }`}
      >
        {photo ? (
          <>
            <Image src={photo} alt={site.heroImageAlt} fill priority className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
          </>
        ) : (
          <Ring
            oval
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[min(80vw,700px)] w-[min(98vw,1000px)] -translate-x-1/2 -translate-y-1/2 opacity-60 sm:block"
          />
        )}
        <div
          className={`relative mx-auto w-full max-w-7xl px-5 sm:px-8 ${
            photo ? "pb-14 pt-32 text-paper sm:pb-20" : "pb-16 pt-28 text-center sm:pt-32"
          }`}
        >
          <div className={photo ? "max-w-2xl" : "mx-auto max-w-3xl"}>
            <p className={`eyebrow ${photo ? "text-paper/85" : "text-stone"}`}>
              {site.name} · {site.homeBase}
            </p>
            <h1 className="display mt-6 text-balance text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.04]">
              Lifestyle, travel and everyday tips, from a <em className={photo ? "" : "bronze-text"}>family of four</em>.
            </h1>
            <p className={`mt-6 text-pretty text-lg leading-relaxed ${photo ? "text-paper/90" : "mx-auto max-w-xl text-espresso/85"}`}>
              We&rsquo;re {site.couple}. We travel with {site.kids} and share the trips, the planning and the everyday in between, so you
              can do it too.
            </p>
            <div className={`mt-10 flex flex-col gap-4 sm:flex-row sm:items-center ${photo ? "" : "sm:justify-center"}`}>
              <a href="#start" className={`btn btn-lg ${photo ? "border-paper bg-paper text-ink hover:bg-bronze-light" : "btn-primary"}`}>
                Start here
              </a>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="text-link px-2 py-3 text-sm">
                Follow on Instagram ↗
              </a>
            </div>
            <ul
              className={`mt-12 flex flex-col gap-2 text-xs sm:flex-row sm:flex-wrap sm:gap-x-6 ${
                photo ? "text-paper/75" : "text-stone sm:justify-center"
              }`}
            >
              {trust.map((t) => (
                <li key={t} className="figure">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <InstagramSection />

      {latest && <LatestTripCard trip={latest} id="start" />}

      {latest && <PlanningExtra d={latest.destination} />}

      <TripGrid trips={trips} posts={posts} />

      <BrandsBand />

      {/* Newsletter — one lead magnet */}
      <section className="mx-auto max-w-xl px-5 pt-16 text-center sm:px-8 md:pt-28">
        <Arc className="mx-auto" width={160} />
        <h2 className="display mt-8 text-4xl md:text-5xl">Letters from the road</h2>
        <p className="mt-4 text-espresso/80">New trip planners and booking dates, a few times a year. No spam.</p>
        <div className="mx-auto max-w-md text-left">
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}

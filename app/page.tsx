import Image from "next/image";
import Link from "next/link";
import { Arc, Ring } from "@/components/brand/Arc";
import { Frame } from "@/components/brand/Frame";
import { InstagramGrid } from "@/components/site/InstagramGrid";
import { NewsletterForm } from "@/components/site/NewsletterForm";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import mediaKit from "@/content/media-kit.json";
import { site } from "@/content/site";
import { getAllDestinations } from "@/lib/destinations";
import { getAllPosts } from "@/lib/journal";

export default function Home() {
  const [japan] = getAllDestinations();
  const latest = getAllPosts().slice(0, 2);
  const partners = mediaKit.partners as { name: string; logo?: string }[];

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-16 flex min-h-[92svh] items-center justify-center overflow-hidden sm:-mt-20">
        {site.heroImage ? (
          <>
            <Image src={site.heroImage} alt="" fill priority className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-ink/35" />
          </>
        ) : (
          <Ring className="pointer-events-none absolute left-1/2 top-1/2 h-[min(120vw,820px)] w-[min(120vw,820px)] -translate-x-1/2 -translate-y-1/2 opacity-70" />
        )}
        <div className={`relative px-5 text-center ${site.heroImage ? "text-paper" : ""}`}>
          <p className="eyebrow">The November Couple</p>
          <h1 className="display mt-6 text-[clamp(3.6rem,13vw,10rem)] leading-[0.92]">
            Lifestyle,
            <br />
            <em className={site.heroImage ? "" : "bronze-text"}>Travel.</em>
          </h1>
          <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed opacity-90">
            A family of four, sharing home, travel and the everyday life in between.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/trips/japan" className={`btn ${site.heroImage ? "border-paper bg-paper text-ink" : "btn-primary"}`}>
              Follow our Japan trip
            </Link>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={`btn ${site.heroImage ? "border-paper text-paper hover:bg-paper hover:text-ink" : "btn-ghost"}`}>
              {site.instagramHandle}
            </a>
          </div>
        </div>
        <span className="eyebrow absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.6rem] opacity-60">Scroll</span>
      </section>

      {/* Now: Japan */}
      {japan && (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <Frame
                src={japan.destination.coverImage}
                alt={`${japan.destination.name} trip`}
                label={japan.destination.nameLocal}
                sublabel={japan.destination.ourTrip.label}
                seed={1}
                className="aspect-[4/5]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </Reveal>
            <Reveal className="lg:col-span-5 lg:col-start-8" delay={0.1}>
              <p className="eyebrow text-bronze">Now · {japan.destination.ourTrip.label}</p>
              <h2 className="display mt-4 text-5xl sm:text-6xl">
                {japan.destination.name}, with a three- and five-year-old
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-espresso/85">
                Our {japan.itinerary.days.length}-day itinerary — and a planner that tells you the exact day and minute every ticket goes on
                sale, in your own time zone. Ghibli, Pokémon Café, Disney, Shibuya Sky: never miss a release.
              </p>
              <ul className="mt-8 space-y-3 border-y border-rule py-6 text-sm">
                {[
                  `${japan.activities.length} hand-picked experiences across ${japan.destination.cities.length} regions`,
                  "Copy our whole trip onto your dates in one tap",
                  "Calendar alerts & email reminders before each release",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <span className="text-bronze">—</span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/trips/japan/planner" className="btn btn-primary">
                  Plan your Japan trip
                </Link>
                <Link href="/trips/japan" className="btn btn-ghost">
                  See our itinerary
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Instagram */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="On Instagram" title="From the road" />
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="eyebrow link-underline shrink-0">
            {site.instagramHandle} ↗
          </a>
        </div>
        <div className="mt-10">
          <InstagramGrid />
        </div>
      </section>

      {/* Journal */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8 sm:pt-36">
          <SectionHeading eyebrow="Journal" title="Stories & guides" />
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {latest.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.1}>
                <Link href={`/journal/${p.slug}`} className="group block">
                  <Frame src={p.cover} alt={p.title} label={p.coverLabel} seed={i + 2} className="aspect-[3/2]" sizes="(max-width: 768px) 100vw, 50vw" />
                  <p className="eyebrow mt-6 text-stone">{p.category}</p>
                  <h3 className="display mt-2 text-3xl group-hover:text-espresso">{p.title}</h3>
                  <p className="mt-2 text-espresso/80">{p.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Brands */}
      <section className="mx-auto mt-28 max-w-7xl px-5 sm:mt-36 sm:px-8">
        <div className="relative overflow-hidden bg-ink px-6 py-20 text-center text-paper sm:px-16">
          <Ring className="pointer-events-none absolute -right-24 -top-24 opacity-30" size={420} />
          <p className="eyebrow text-bronze-light">For brands</p>
          <h2 className="display mx-auto mt-5 max-w-3xl text-5xl sm:text-6xl">Stories people save, plan &amp; book.</h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-paper/75">{mediaKit.statement}</p>
          {partners.length > 0 && (
            <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {partners.map((p) => (
                <li key={p.name} className="eyebrow text-paper/60">
                  {p.name}
                </li>
              ))}
            </ul>
          )}
          <Link href="/work-with-us" className="btn mt-10 border-paper bg-paper text-ink hover:bg-bronze-light">
            Work with us
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-xl px-5 pt-28 text-center sm:pt-36">
        <Arc className="mx-auto" width={160} />
        <h2 className="display mt-8 text-4xl sm:text-5xl">Letters from the road</h2>
        <p className="mt-4 text-espresso/80">New trip planners and booking dates, a few times a year. Nothing more.</p>
        <div className="mx-auto max-w-md text-left">
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}

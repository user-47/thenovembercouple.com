import Link from "next/link";
import { Frame } from "@/components/brand/Frame";
import { Collaboration } from "@/components/site/Collaboration";
import { ExploreGrid } from "@/components/site/ExploreGrid";
import { StoryGrid } from "@/components/site/StoryCard";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { RuleHeading } from "@/components/ui/RuleHeading";
import { pillars } from "@/content/pillars";
import { site } from "@/content/site";
import { getLatestTrip, tripCities } from "@/lib/destinations";
import { getAllPosts } from "@/lib/journal";

/** Real hero photo goes here, e.g. "/images/hero.jpg". */
const heroImage: string | undefined = undefined;

export default function Home() {
  const latest = getLatestTrip();
  const posts = getAllPosts().slice(0, 3);

  return (
    <>
      {/* B. Hero */}
      <section className="relative overflow-hidden lg:min-h-[calc(100svh-7rem)]">
        <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:absolute lg:inset-0 lg:aspect-auto">
          <Frame src={heroImage} alt="The November Couple on the road" quiet priority sizes="100vw" seed={1} className="h-full w-full" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-linen via-linen/85 to-transparent lg:block lg:via-35% lg:to-70%" />
          {!heroImage && (
            <p className="absolute bottom-4 right-5 rounded-full bg-linen/80 px-3 py-1 text-[0.68rem] text-ink/70 sm:right-8">
              Photo placeholder · Hero — Japan suggested
            </p>
          )}
        </div>
        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:flex lg:min-h-[calc(100svh-7rem)] lg:items-center lg:py-24">
          <div className="max-w-xl">
            <p className="eyebrow text-bronze">{site.tagline}</p>
            <h1 className="display mt-6 text-balance text-[clamp(2.75rem,6vw,5rem)] leading-[1.02]">Life is better experienced together.</h1>
            <span className="mt-8 block h-px w-16 bg-antique" />
            <p className="mt-8 max-w-md text-lg leading-relaxed text-ink/80">
              Travel, beautiful spaces, good food and the little moments that make life memorable.
            </p>
            <Link href="/journal" className="btn btn-primary btn-lg mt-10">
              Explore our journal <Icon name="arrow" className="h-4 w-4" strokeWidth={1.6} />
            </Link>
          </div>
        </div>
      </section>

      {/* C. About */}
      <section className="border-y border-rule bg-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-12 lg:gap-10">
          <Reveal className="relative mx-auto aspect-[10/9] w-full max-w-md lg:col-span-4">
            <Polaroid className="left-0 top-[4%] w-[56%] -rotate-[5deg]" label="The two of us, on the road" seed={0} />
            <Polaroid className="right-0 top-0 w-[42%] rotate-[4deg]" label="A favourite place" seed={2} />
            <Polaroid className="bottom-0 right-[10%] w-[40%] -rotate-[2deg]" label="A meal to remember" seed={3} />
          </Reveal>
          <div className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-10">
            <p className="eyebrow text-bronze">Who we are</p>
            <h2 className="display mt-4 text-4xl md:text-5xl">A couple, a family, and a shared curiosity</h2>
            <p className="mt-6 leading-relaxed text-ink/80">
              We&rsquo;re {site.couple}, based in {site.homeBase}. We share the trips we take, the homes and spaces we love, good food,
              family life and the everyday moments in between.
            </p>
            <Link href="/about" className="text-link mt-6 inline-flex items-center gap-2 text-sm">
              Learn more about us <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <ul className="grid grid-cols-3 gap-y-8 sm:grid-cols-5 lg:col-span-4 lg:grid-cols-3">
            {pillars.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} className="group flex flex-col items-center gap-3 text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-taupe/60 text-ink transition-colors group-hover:bg-ink group-hover:text-linen">
                    <Icon name={p.icon} className="h-7 w-7" strokeWidth={1.2} />
                  </span>
                  <span className="text-xs leading-snug text-ink/80">{p.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* D. Featured travel story */}
      {latest && (
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <RuleHeading>Latest travel</RuleHeading>
              <h2 className="display mt-8 text-5xl md:text-6xl">{latest.destination.name}: our latest adventure</h2>
              <p className="eyebrow mt-5 text-[0.62rem] text-stone">
                {latest.destination.ourTrip.label} · {latest.itinerary.days.length} days · {tripCities(latest.destination.cities).join(", ")}
              </p>
              <p className="mt-6 text-lg leading-relaxed text-ink/80">{latest.destination.intro}</p>
              <p className="mt-4 leading-relaxed text-ink/70">
                More than a post: the full day-by-day story, every ticket we booked and when, and a planner to make the trip your own.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href={`/trips/${latest.destination.slug}`} className="btn btn-primary btn-lg">
                  Read the story <Icon name="arrow" className="h-4 w-4" strokeWidth={1.6} />
                </Link>
                <Link href={`/trips/${latest.destination.slug}/planner`} className="text-link px-1 py-2 text-sm">
                  Plan your own trip
                </Link>
              </div>
            </div>
            <Reveal className="lg:col-span-7" delay={0.1}>
              <Frame
                src={latest.destination.coverImage}
                alt={`Our ${latest.destination.name} trip`}
                label={`${latest.destination.name} — featured story image`}
                seed={1}
                className="aspect-[4/3] rounded-sm lg:aspect-[16/11]"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* E. Explore our world */}
      <section className="mx-auto max-w-7xl px-5 sm:px-8">
        <RuleHeading>Explore our world</RuleHeading>
        <div className="mt-10">
          <ExploreGrid />
        </div>
      </section>

      {/* F. Latest stories */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8 md:pt-32">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-bronze">From the journal</p>
              <h2 className="display mt-4 text-4xl md:text-5xl">Latest stories</h2>
            </div>
            <Link href="/journal" className="text-link shrink-0 text-sm">
              View all stories →
            </Link>
          </div>
          <div className="mt-12">
            <StoryGrid posts={posts} />
          </div>
        </section>
      )}

      {/* G. Collaboration — the newsletter (H) and footer (I) follow from the layout */}
      <div className="pt-24 md:pt-32">
        <Collaboration />
      </div>
    </>
  );
}

function Polaroid({ className, label, seed }: { className: string; label: string; seed: number }) {
  return (
    <div className={`absolute bg-white p-2 pb-7 shadow-[0_18px_40px_-18px_rgba(33,26,22,0.35)] ${className}`}>
      <Frame alt={label} seed={seed} quiet className="aspect-[4/5]" sizes="200px" />
      <p className="absolute inset-x-2 bottom-1.5 truncate text-center text-[0.58rem] text-ink/45">Photo placeholder</p>
    </div>
  );
}

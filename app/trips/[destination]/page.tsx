import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arc, Ring } from "@/components/brand/Arc";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { describeRule } from "@/lib/booking-rules";
import { formatYmd } from "@/lib/dates";
import { getAllDestinations, getDestination } from "@/lib/destinations";

export function generateStaticParams() {
  return getAllDestinations().map((d) => ({ destination: d.destination.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ destination: string }> }): Promise<Metadata> {
  const b = getDestination((await params).destination);
  if (!b) return {};
  return {
    title: `${b.destination.name} — our family itinerary & trip planner`,
    description: `${b.destination.tagline} ${b.itinerary.days.length} days, every booking date, and a planner to make it yours.`,
  };
}

const statusLabel = { booked: "Booked", reserved: "Reserved", "to-book": "To book" } as const;

export default async function DestinationPage({ params }: { params: Promise<{ destination: string }> }) {
  const b = getDestination((await params).destination);
  if (!b) notFound();
  const { destination: d, itinerary, activities } = b;
  const bySlug = new Map(activities.map((a) => [a.slug, a]));
  const mustBook = activities.filter((a) => a.booking.sellOutRisk === "extreme" || a.booking.sellOutRisk === "high");

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 text-center sm:px-8 sm:pt-24">
          <Ring className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 opacity-50" size={560} />
          <p className="eyebrow relative text-stone">
            {d.ourTrip.label} · {itinerary.days.length} days
          </p>
          <h1 className="display relative mt-6 text-7xl sm:text-8xl md:text-9xl">{d.name}</h1>
          {d.nameLocal && <p className="display relative mt-2 text-3xl text-bronze">{d.nameLocal}</p>}
          <p className="relative mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-espresso/85">{d.intro}</p>
          <div className="relative mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={`/trips/${d.slug}/planner`} className="btn btn-primary">
              Open the trip planner
            </Link>
            <a href="#itinerary" className="btn btn-ghost">
              See our itinerary
            </a>
          </div>
          <p className="relative mt-6 text-xs text-stone">{itinerary.summary}</p>
        </div>
      </section>

      {/* Book early */}
      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="eyebrow text-bronze-light">The golden rule</p>
              <h2 className="display mt-4 text-5xl">In {d.name}, the best things sell out in minutes.</h2>
              <p className="mt-6 leading-relaxed text-paper/75">
                Many tickets are released on a fixed day at a fixed time ({d.timezoneLabel}). Add them to your plan and we&rsquo;ll tell you the
                exact moment — in your own time zone — and remind you.
              </p>
            </div>
            <ul className="divide-y divide-paper/15 border-y border-paper/15 md:col-span-8">
              {mustBook.map((a) => (
                <li key={a.slug}>
                  <Link href={`/trips/${d.slug}/${a.slug}`} className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between">
                    <span className="display text-2xl group-hover:text-bronze-light">{a.name}</span>
                    <span className="text-sm text-paper/70">{describeRule(a.booking.rule, d.timezoneLabel)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section id="itinerary" className="mx-auto max-w-5xl scroll-mt-24 px-5 pt-24 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Our itinerary"
          title={`Our ${itinerary.days.length} days`}
          intro="Exactly what we planned — paced for a three- and five-year-old. Copy it into the planner and it maps onto your own dates."
        />

        <ol className="mt-20 space-y-20">
          {itinerary.days.map((day) => (
            <li key={day.day}>
              <Reveal>
                {day.transfer && (
                  <p className="mb-10 border-y border-bronze/40 py-4 text-center text-sm italic text-espresso">{day.transfer}</p>
                )}
                <div className="grid gap-6 md:grid-cols-12">
                  <div className="md:col-span-4">
                    <p className="eyebrow text-bronze">Day {day.day}</p>
                    <p className="display mt-2 text-4xl">{formatYmd(day.date)}</p>
                    <p className="eyebrow mt-3 text-stone">{day.location}</p>
                  </div>
                  <div className="md:col-span-8">
                    <h3 className="display text-3xl italic">{day.title}</h3>
                    <ul className="mt-6 divide-y divide-rule border-t border-rule">
                      {day.entries.map((e, i) => {
                        const a = e.activity ? bySlug.get(e.activity) : undefined;
                        return (
                          <li key={i} className="grid grid-cols-[5.5rem_1fr] gap-4 py-4 text-[0.95rem]">
                            <span className="text-sm font-medium text-espresso">{e.time}</span>
                            <span className="leading-relaxed">
                              {a ? (
                                <Link href={`/trips/${d.slug}/${a.slug}`} className="link-underline">
                                  {e.title}
                                </Link>
                              ) : (
                                e.title
                              )}
                              {e.status && (
                                <span className={`eyebrow ml-3 inline-block px-2 py-0.5 text-[0.55rem] ${e.status === "to-book" ? "border border-alert text-alert" : "bg-ok text-paper"}`}>
                                  {statusLabel[e.status]}
                                </span>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className="mt-24 text-center">
          <Arc className="mx-auto" width={180} />
          <p className="display mt-8 text-4xl">Make it yours.</p>
          <p className="mx-auto mt-4 max-w-md text-espresso/80">
            Copy our whole trip in one tap, swap things out, and get a calendar of every ticket release.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={`/trips/${d.slug}/planner`} className="btn btn-primary">
              Plan your {d.name} trip
            </Link>
            {d.essentials.length > 0 && (
              <Link href={`/trips/${d.slug}/essentials`} className="btn btn-ghost">
                Travel essentials
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

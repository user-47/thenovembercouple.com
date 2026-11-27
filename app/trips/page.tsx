import type { Metadata } from "next";
import Link from "next/link";
import { Frame } from "@/components/brand/Frame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { getAllDestinations } from "@/lib/destinations";
import { formatYmd } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Our Trips",
  description: "Every trip we've taken as a family — with planners that tell you exactly what to book and when.",
};

export default function TripsPage() {
  const all = getAllDestinations();
  return (
    <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-24">
      <SectionHeading
        eyebrow="Our trips"
        title={
          <>
            Plan it the way <em className="bronze-text">we did</em>
          </>
        }
        intro="Each trip comes with our day-by-day itinerary and a planner that works out exactly when every ticket goes on sale — then reminds you."
      />
      <div className="mt-16 grid gap-10 md:grid-cols-2">
        {all.map(({ destination: d, itinerary, activities }, i) => (
          <Reveal key={d.slug} delay={i * 0.1}>
            <Link href={`/trips/${d.slug}`} className="group block">
              <Frame
                src={d.coverImage}
                alt={d.name}
                label={d.name}
                sublabel={d.ourTrip.label}
                seed={i + 1}
                className="aspect-[4/5] sm:aspect-[5/6]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="mt-6 flex items-start justify-between gap-6">
                <div>
                  <p className="eyebrow text-stone">
                    {formatYmd(d.ourTrip.start, { weekday: false })} – {formatYmd(d.ourTrip.end, { weekday: false, year: true })}
                  </p>
                  <h2 className="display mt-2 text-5xl">{d.name}</h2>
                  <p className="mt-3 max-w-md text-espresso/85">{d.tagline}</p>
                  <p className="mt-3 text-xs text-stone">
                    {itinerary.days.length} days · {activities.length} experiences
                  </p>
                </div>
                <span className="eyebrow link-underline mt-8 shrink-0">{d.status === "live" ? "Plan →" : "Soon"}</span>
              </div>
            </Link>
          </Reveal>
        ))}
        <Reveal delay={0.2}>
          <div className="flex aspect-[4/5] flex-col items-center justify-center border border-dashed border-rule p-10 text-center sm:aspect-[5/6]">
            <p className="eyebrow text-stone">Next November</p>
            <p className="display mt-4 text-4xl">Where should we go?</p>
            <p className="mt-4 max-w-xs text-sm text-espresso/80">Tell us on Instagram — the next planner might be yours.</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

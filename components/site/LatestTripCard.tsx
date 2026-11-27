import Link from "next/link";
import { Frame } from "@/components/brand/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";
import { tripCities, tripDateRange, type DestinationBundle } from "@/lib/destinations";

export function LatestTripCard({ trip, id }: { trip: DestinationBundle; id?: string }) {
  const { destination: d, itinerary, activities } = trip;
  const days = itinerary.days.length;
  const glance = [
    [String(days), "days"],
    [String(activities.length), "experiences"],
    [site.kidsAges, "travelling with"],
    [String(activities.filter((a) => a.booking.level === "essential").length), "must pre-book"],
  ];

  return (
    <section id={id} className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8 md:py-28">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <Frame
            src={d.coverImage}
            alt={`Our ${d.name} trip`}
            label={d.name}
            sublabel={d.ourTrip.label}
            seed={1}
            className="aspect-[4/5]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Reveal>
        <Reveal className="lg:col-span-6" delay={0.1}>
          <p className="eyebrow text-bronze">Latest trip</p>
          <h2 className="display mt-4 text-5xl md:text-6xl">{d.name}</h2>
          <p className="mt-4 text-sm text-stone">
            <span className="figure">{days} days</span> · {tripCities(d.cities).join(", ")} ·{" "}
            <span className="figure">{tripDateRange(d.ourTrip.start, d.ourTrip.end)}</span>
          </p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-espresso/90">{d.intro}</p>
          <dl className="mt-8 grid grid-cols-2 border-y border-rule sm:grid-cols-4">
            {glance.map(([v, k], i) => (
              <div key={k} className={`py-5 ${i % 2 ? "pl-5" : ""} ${i > 0 ? "sm:border-l sm:border-rule sm:pl-5" : ""} ${i > 1 ? "border-t border-rule sm:border-t-0" : ""}`}>
                <dt className="sr-only">{k}</dt>
                <dd>
                  <span className="figure block text-lg text-ink">{v}</span>
                  <span className="mt-1 block text-xs text-stone">{k}</span>
                </dd>
              </div>
            ))}
          </dl>
          <Link href={`/trips/${d.slug}`} className="btn btn-primary btn-lg mt-8 w-full sm:w-auto">
            See the {d.name} trip →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Frame } from "@/components/brand/Frame";
import type { Activity, Destination } from "@/lib/schema";
import { describeRule } from "@/lib/booking-rules";
import { durationLabel, price } from "@/lib/format";
import { AddToTrip } from "./AddToTrip";
import { LevelBadge } from "./shared";

export function ActivityCard({ a, d, index }: { a: Activity; d: Destination; index: number }) {
  const href = `/trips/${d.slug}/${a.slug}`;
  const meta = [a.city, durationLabel(a.durationHrs), price(a.priceFrom, d.currencySymbol)].filter(Boolean);
  return (
    <article className="group flex flex-col bg-paper">
      <Link href={href} className="block" tabIndex={-1} aria-hidden>
        <Frame
          src={a.image}
          alt={a.name}
          label={a.name}
          sublabel={a.city}
          seed={index}
          className="aspect-[4/5] transition-transform duration-700 group-hover:scale-[1.01]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <LevelBadge level={a.booking.level} />
          {a.tncDays?.length ? (
            <span className="eyebrow text-[0.6rem] text-bronze">On our trip · Day {a.tncDays.join(" & ")}</span>
          ) : null}
        </div>
        <h3 className="display mt-3 text-2xl leading-tight">
          <Link href={href} className="link-underline">
            {a.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-espresso/85">{a.summary}</p>
        <p className="mt-3 text-xs text-stone">{meta.join(" · ")}</p>
        {a.booking.level !== "none" && <p className="mt-1 text-xs text-stone">{describeRule(a.booking.rule, d.timezoneLabel)}</p>}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <Link href={href} className="eyebrow link-underline text-[0.62rem]">
            Details
          </Link>
          <AddToTrip destination={d.slug} slug={a.slug} name={a.name} />
        </div>
      </div>
    </article>
  );
}

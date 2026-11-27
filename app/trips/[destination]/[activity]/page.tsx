import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Frame } from "@/components/brand/Frame";
import { AddToTrip } from "@/components/planner/AddToTrip";
import { LevelBadge } from "@/components/planner/shared";
import { describeRule } from "@/lib/booking-rules";
import { formatYmd } from "@/lib/dates";
import { getActivity, getAllDestinations } from "@/lib/destinations";
import { goHref } from "@/lib/affiliates";
import { durationLabel, price } from "@/lib/format";

export function generateStaticParams() {
  return getAllDestinations().flatMap((b) => b.activities.map((a) => ({ destination: b.destination.slug, activity: a.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ destination: string; activity: string }> }): Promise<Metadata> {
  const p = await params;
  const r = getActivity(p.destination, p.activity);
  if (!r) return {};
  const when = r.activity.booking.level !== "none" ? ` When tickets go on sale: ${describeRule(r.activity.booking.rule, r.destination.timezoneLabel)}.` : "";
  return { title: `${r.activity.name} — tickets, tips & when to book`, description: `${r.activity.summary}${when}` };
}

export default async function ActivityPage({ params }: { params: Promise<{ destination: string; activity: string }> }) {
  const p = await params;
  const r = getActivity(p.destination, p.activity);
  if (!r) notFound();
  const { destination: d, activity: a, activities } = r;
  const related = activities.filter((x) => x.slug !== a.slug && x.city === a.city).slice(0, 3);
  const hasAffiliate = a.booking.links.some((l) => l.kind === "affiliate");
  const facts = [
    ["Where", [a.area, a.city].filter(Boolean).join(", ")],
    ["Time needed", durationLabel(a.durationHrs)],
    ["Price", [price(a.priceFrom, d.currencySymbol), a.priceNote].filter(Boolean).join(" · ") || null],
    ["Booking", a.booking.level === "none" ? "No booking needed" : describeRule(a.booking.rule, d.timezoneLabel)],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <article className="mx-auto max-w-7xl px-5 pt-10 sm:px-8 sm:pt-14">
      <nav className="eyebrow text-[0.62rem] text-stone" aria-label="Breadcrumb">
        <Link href="/trips" className="link-underline">Trips</Link> /{" "}
        <Link href={`/trips/${d.slug}`} className="link-underline">{d.name}</Link> /{" "}
        <Link href={`/trips/${d.slug}/planner`} className="link-underline">Planner</Link>
      </nav>

      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Frame src={a.image} alt={a.name} label={a.name} sublabel={a.city} seed={a.slug.length} className="aspect-[4/5]" sizes="(max-width: 1024px) 100vw, 50vw" priority />
        </div>

        <div className="lg:col-span-6 lg:pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <LevelBadge level={a.booking.level} />
            {a.kidFriendly && <span className="eyebrow text-[0.6rem] text-stone">Kid-friendly</span>}
            {a.tncDays?.length ? <span className="eyebrow text-[0.6rem] text-bronze">On our trip · Day {a.tncDays.join(" & ")}</span> : null}
          </div>
          <h1 className="display mt-5 text-5xl sm:text-6xl">{a.name}</h1>
          {a.nameLocal && <p className="display mt-2 text-2xl text-bronze">{a.nameLocal}</p>}
          <p className="mt-6 text-lg leading-relaxed text-espresso/90">{a.summary}</p>

          <dl className="mt-8 divide-y divide-rule border-y border-rule">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 py-3 text-sm">
                <dt className="eyebrow pt-0.5 text-[0.6rem] text-stone">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          {a.booking.howTo && <p className="mt-6 text-sm leading-relaxed text-espresso/80">{a.booking.howTo}</p>}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <AddToTrip destination={d.slug} slug={a.slug} name={a.name} />
            {a.booking.links.map((l, i) => (
              <a
                key={l.url}
                href={goHref(d.slug, a.slug, i)}
                target="_blank"
                rel={l.kind === "affiliate" ? "noopener sponsored" : "noopener"}
                className={`btn btn-sm ${i === 0 ? "btn-primary" : "btn-ghost"}`}
              >
                {l.label} ↗
              </a>
            ))}
          </div>
          {hasAffiliate && (
            <p className="mt-4 text-[0.7rem] text-stone">
              Some links are affiliate links — we may earn a small commission at no extra cost to you.{" "}
              <Link href="/disclosure" className="underline">Learn more</Link>
            </p>
          )}

          {(a.tncTip || a.kidNotes) && (
            <div className="mt-10 space-y-6 bg-paper p-7">
              {a.tncTip && (
                <div>
                  <p className="eyebrow text-bronze">Our tip</p>
                  <p className="display mt-2 text-2xl italic leading-snug">&ldquo;{a.tncTip}&rdquo;</p>
                </div>
              )}
              {a.kidNotes && (
                <div>
                  <p className="eyebrow text-stone">With little ones</p>
                  <p className="mt-2 text-sm leading-relaxed">{a.kidNotes}</p>
                </div>
              )}
            </div>
          )}

          <p className="mt-6 text-[0.7rem] text-stone">
            Booking details last checked {formatYmd(a.lastVerified, { weekday: false, year: true })}. Release rules change — always confirm on the official site.
            {a.sourceUrl && (
              <>
                {" "}
                <a href={a.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline">Source</a>
              </>
            )}
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-28">
          <p className="eyebrow text-stone">Also in {a.city}</p>
          <ul className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((x) => (
              <li key={x.slug} className="border-t border-ink pt-4">
                <Link href={`/trips/${d.slug}/${x.slug}`} className="display link-underline text-2xl">{x.name}</Link>
                <p className="mt-2 line-clamp-2 text-sm text-espresso/80">{x.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}

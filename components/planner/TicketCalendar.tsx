"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getBookingWindow, type BookingWindow } from "@/lib/booking-rules";
import { buildIcs, googleCalendarUrl, outlookCalendarUrl, type CalendarItem } from "@/lib/calendar";
import { formatYmd, parseYmd, monthShort } from "@/lib/dates";
import { countdown, fmtDateTime, fmtTime, localTimeZone, shortTzName } from "@/lib/format";
import { track } from "@vercel/analytics";
import { goHref, linkLabel, orderedLinks } from "@/lib/affiliates";
import type { Activity } from "@/lib/schema";
import type { Trip } from "@/lib/trip-store";
import { StatusPill, useNow, type PlannerData } from "./shared";
import { SaveTrip } from "./SaveTrip";

interface Row {
  a: Activity;
  visitDate: string;
  w: BookingWindow;
  cal: CalendarItem;
}

const verb = (w: BookingWindow) =>
  w.kind === "lottery" ? "Lottery entries open" : w.kind === "recommended" ? "Book by" : "Tickets open";

export function TicketCalendar({ data, trip }: { data: PlannerData; trip: Trip }) {
  const { destination: d, activities } = data;
  const now = useNow();
  const localTz = useMemo(localTimeZone, []);
  const sameTz = shortTzName(localTz) === shortTzName(d.timezone);
  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

  const { rows, undated, walkins } = useMemo(() => {
    const rows: Row[] = [];
    const undated: Activity[] = [];
    const walkins: { a: Activity; visitDate: string }[] = [];
    for (const item of trip.items) {
      const a = activities.find((x) => x.slug === item.slug);
      if (!a) continue;
      if (!item.date) {
        if (a.booking.level !== "none") undated.push(a);
        continue;
      }
      const w = getBookingWindow(a.booking.rule, item.date, d.timezone, now);
      if (w.kind === "none") {
        walkins.push({ a, visitDate: item.date });
        continue;
      }
      const when = w.hasTime && w.actionAt ? ` at ${fmtTime(w.actionAt, d.timezone)} ${d.timezoneLabel}` : "";
      const bookLines = orderedLinks(a.booking.links).map(({ link, index }) => `${linkLabel(link)}: ${siteUrl}${goHref(d.slug, a.slug, index)}`);
      const cal: CalendarItem = {
        uid: `${d.slug}-${a.slug}-${item.date}@thenovembercouple.com`,
        title: `🎟 ${verb(w)}: ${a.name}${when}`,
        description: [
          `For your visit on ${formatYmd(item.date, { year: true })}.`,
          a.booking.howTo,
          bookLines.join("\n"),
          "Planned with The November Couple trip planner.",
        ]
          .filter(Boolean)
          .join("\n\n"),
        url: `${siteUrl}/trips/${d.slug}/${a.slug}`,
        window: w,
      };
      rows.push({ a, visitDate: item.date, w, cal });
    }
    rows.sort((x, y) => (x.w.actionAt?.getTime() ?? 0) - (y.w.actionAt?.getTime() ?? 0));
    return { rows, undated, walkins };
  }, [trip.items, activities, d, now, siteUrl]);

  const upcoming = rows.filter((r) => r.w.status !== "visit-passed");
  // "Book ahead" items only need action once their book-by date is within two weeks.
  const SOON = 14 * 86_400_000;
  const isActNow = (r: Row) =>
    r.w.status === "late" ||
    r.w.status === "closed" ||
    (r.w.status === "open" && (r.w.kind !== "recommended" || (r.w.actionAt?.getTime() ?? 0) - now.getTime() < SOON));
  const actNow = upcoming.filter(isActNow);
  const later = upcoming.filter((r) => !isActNow(r));

  function downloadIcs() {
    const ics = buildIcs(
      upcoming.map((r) => r.cal),
      `${d.name} — ticket dates`,
    );
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tnc-${d.slug}-ticket-dates.ics`;
    link.click();
    URL.revokeObjectURL(url);
    track("ics_download", { destination: d.slug, events: upcoming.length });
  }

  if (trip.items.length === 0) {
    return (
      <Empty>
        Add a few activities and we&rsquo;ll work out exactly when each ticket goes on sale — in {d.timezoneLabel} and your
        own time zone.
      </Empty>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-8">
        {actNow.length > 0 && group("Act now", actNow)}
        {later.length > 0 && group("Coming up", later)}
        {upcoming.length === 0 && (
          <Empty>
            Give your activities a date in <em>My trip</em> to see when to book them.
          </Empty>
        )}

        {undated.length > 0 && (
          <section className="mt-12">
            <h3 className="eyebrow text-stone">Pick a day to see the booking date</h3>
            <ul className="mt-4 divide-y divide-rule border-y border-rule">
              {undated.map((a) => (
                <li key={a.slug} className="flex items-center justify-between py-3 text-sm">
                  <span>{a.name}</span>
                  <span className="text-stone">No date yet</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {walkins.length > 0 && (
          <section className="mt-12">
            <h3 className="eyebrow text-stone">No tickets needed</h3>
            <p className="mt-3 text-sm leading-relaxed text-espresso/80">
              {walkins.map((x) => x.a.name).join(" · ")}
            </p>
          </section>
        )}
      </div>

      <aside className="lg:col-span-4">
        <div className="sticky top-28 space-y-6">
          <div className="bg-ink p-7 text-paper">
            <p className="eyebrow text-bronze-light">Never miss a release</p>
            <p className="display mt-3 text-3xl">Add every date to your calendar</p>
            <p className="mt-3 text-sm leading-relaxed text-paper/75">
              One file with all {upcoming.length} booking dates, each with an alert the day before and 15 minutes before.
              Works with Apple, Google and Outlook calendars.
            </p>
            <button type="button" onClick={downloadIcs} disabled={upcoming.length === 0} className="btn mt-6 w-full border-paper bg-paper text-ink hover:bg-bronze-light">
              Download calendar (.ics)
            </button>
          </div>
          <SaveTrip destination={d.slug} trip={trip} />
          {!sameTz && (
            <p className="text-xs leading-relaxed text-stone">
              Times are shown in {d.timezoneLabel} (where tickets are released) and in your time zone ({localTz.replace(/_/g, " ")}).
            </p>
          )}
        </div>
      </aside>
    </div>
  );

  function group(title: string, rows: Row[]) {
    return (
      <section className="mb-12">
        <h3 className="eyebrow text-stone">{title}</h3>
        <ol className="mt-4 divide-y divide-rule border-y border-rule">{rows.map(rowView)}</ol>
      </section>
    );
  }

  function rowView(r: Row) {
    const { a, w } = r;
    const [book, ...rest] = orderedLinks(a.booking.links);
    const official = book?.link.kind === "affiliate" ? rest.find((x) => x.link.kind === "official") : undefined;
    const g = googleCalendarUrl(r.cal);
    const o = outlookCalendarUrl(r.cal);
    const ad = w.actionDate ? parseYmd(w.actionDate) : null;
    return (
      <li key={a.slug} className="grid grid-cols-[4.5rem_1fr] gap-5 py-6 sm:grid-cols-[5.5rem_1fr]">
        <div className="text-center">
          {ad && (
            <>
              <div className="eyebrow text-[0.6rem] text-stone">{monthShort(w.actionDate!)}</div>
              <div className="display text-5xl leading-none">{ad.d}</div>
              <div className="mt-1 text-[0.65rem] text-stone">{ad.y}</div>
            </>
          )}
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill w={w} risk={a.booking.sellOutRisk} />
            {w.status === "upcoming" && w.actionAt && <span className="text-xs text-stone">{countdown(w.actionAt, now)}</span>}
          </div>
          <h4 className="display mt-2 text-2xl leading-tight">
            <Link href={`/trips/${d.slug}/${a.slug}`} className="link-underline">
              {a.name}
            </Link>
          </h4>
          <p className="mt-1 text-sm text-espresso/85">
            {verb(w)} {formatYmd(w.actionDate!)}
            {w.kind === "lottery" && w.endDate && <> – {formatYmd(w.endDate)}</>}
            {w.hasTime && w.actionAt && (
              <>
                {" "}
                · <strong className="font-medium">{fmtTime(w.actionAt, d.timezone)} {d.timezoneLabel}</strong>
                {!sameTz && <span className="text-stone"> ({fmtDateTime(w.actionAt, localTz)} your time)</span>}
              </>
            )}
          </p>
          <p className="mt-1 text-xs text-stone">For your visit on {formatYmd(r.visitDate)}</p>
          {a.booking.howTo && <p className="mt-3 max-w-xl text-sm leading-relaxed text-espresso/75">{a.booking.howTo}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {book && (
              <a
                href={goHref(d.slug, a.slug, book.index)}
                target="_blank"
                rel={book.link.kind === "affiliate" ? "noopener sponsored" : "noopener"}
                className="btn btn-primary btn-sm"
              >
                {book.link.kind === "affiliate" ? linkLabel(book.link) : "Official site"} ↗
              </a>
            )}
            {official && (
              <a href={goHref(d.slug, a.slug, official.index)} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">
                Official site ↗
              </a>
            )}
            {g && (
              <a href={g} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                + Google
              </a>
            )}
            {o && (
              <a href={o} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                + Outlook
              </a>
            )}
          </div>
        </div>
      </li>
    );
  }
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="display mx-auto max-w-xl py-16 text-center text-2xl leading-snug text-espresso/80">{children}</p>;
}

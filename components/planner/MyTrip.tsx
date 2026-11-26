"use client";

import Link from "next/link";
import { getBookingWindow } from "@/lib/booking-rules";
import { formatYmd } from "@/lib/dates";
import { useTripStore, type Trip } from "@/lib/trip-store";
import { StatusPill, tripDays, useNow, type PlannerData } from "./shared";

export function MyTrip({ data, trip, onBrowse }: { data: PlannerData; trip: Trip; onBrowse: () => void }) {
  const { destination: d, activities } = data;
  const setItemDate = useTripStore((s) => s.setItemDate);
  const remove = useTripStore((s) => s.remove);
  const now = useNow();
  const days = tripDays(trip.startDate, trip.endDate);

  if (trip.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <p className="display text-3xl leading-snug">Your {d.name} trip is a blank page.</p>
        <p className="mt-4 text-espresso/80">Browse the activities, or copy our itinerary above and make it your own.</p>
        <button type="button" onClick={onBrowse} className="btn btn-primary mt-8">
          Browse activities
        </button>
      </div>
    );
  }

  // Group by date (unscheduled last)
  const dates = Array.from(new Set(trip.items.map((i) => i.date ?? "")))
    .sort((a, b) => (a === "" ? 1 : b === "" ? -1 : a.localeCompare(b)));

  return (
    <div className="space-y-12">
      {dates.map((date) => {
        const dayIdx = days.findIndex((x) => x.date === date);
        return (
          <section key={date || "unscheduled"}>
            <h3 className="flex items-baseline gap-4 border-b border-ink pb-3">
              <span className="eyebrow text-stone">{date ? (dayIdx >= 0 ? `Day ${dayIdx + 1}` : "Extra day") : "Not scheduled"}</span>
              {date && <span className="display text-3xl">{formatYmd(date)}</span>}
            </h3>
            <ul className="divide-y divide-rule">
              {trip.items
                .filter((i) => (i.date ?? "") === date)
                .map((item) => {
                  const a = activities.find((x) => x.slug === item.slug);
                  if (!a) return null;
                  const w = item.date ? getBookingWindow(a.booking.rule, item.date, d.timezone, now) : null;
                  return (
                    <li key={item.slug} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <Link href={`/trips/${d.slug}/${a.slug}`} className="display link-underline text-2xl">
                          {a.name}
                        </Link>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-stone">
                          <span>{a.city}</span>
                          {w && <StatusPill w={w} risk={a.booking.sellOutRisk} />}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="sr-only" htmlFor={`d-${item.slug}`}>
                          Day for {a.name}
                        </label>
                        {days.length > 0 ? (
                          <select
                            id={`d-${item.slug}`}
                            className="field w-52 text-sm"
                            value={item.date ?? ""}
                            onChange={(e) => setItemDate(d.slug, item.slug, e.target.value || null)}
                          >
                            <option value="">Not sure yet</option>
                            {days.map((x) => (
                              <option key={x.date} value={x.date}>
                                {x.label}
                              </option>
                            ))}
                            {item.date && !days.some((x) => x.date === item.date) && <option value={item.date}>{formatYmd(item.date)}</option>}
                          </select>
                        ) : (
                          <input
                            id={`d-${item.slug}`}
                            type="date"
                            className="field w-44 text-sm"
                            value={item.date ?? ""}
                            onChange={(e) => setItemDate(d.slug, item.slug, e.target.value || null)}
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => remove(d.slug, item.slug)}
                          className="text-xs text-stone hover:text-alert"
                          aria-label={`Remove ${a.name}`}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

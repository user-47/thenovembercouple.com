"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { addDays, diffDays } from "@/lib/dates";
import { useHydrated, useTrip, useTripStore } from "@/lib/trip-store";
import { getBookingWindow } from "@/lib/booking-rules";
import { ActivityCard } from "./ActivityCard";
import { MyTrip } from "./MyTrip";
import { TicketCalendar } from "./TicketCalendar";
import type { PlannerData } from "./shared";

type Tab = "discover" | "trip" | "calendar";

export function Planner({
  data,
  ourDays,
}: {
  data: PlannerData;
  /** The couple's itinerary as [{ day, slugs }] for "copy our trip". */
  ourDays: { day: number; slugs: string[] }[];
}) {
  const { destination: d, activities } = data;
  const hydrated = useHydrated();
  const trip = useTrip(d.slug);
  const { setDates, add, replace } = useTripStore.getState();
  const [tab, setTab] = useState<Tab>("discover");
  const [notice, setNotice] = useState<string | null>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Filters
  const [city, setCity] = useState<string>("All");
  const [category, setCategory] = useState<string>("All");
  const [kids, setKids] = useState(false);
  const [mustBook, setMustBook] = useState(false);
  const [ours, setOurs] = useState(false);
  const [q, setQ] = useState("");

  // Restore a saved trip from a magic link: /trips/japan/planner?trip=<token>
  const params = useSearchParams();
  const token = params.get("trip");
  useEffect(() => {
    if (!hydrated || !token || trip.token === token) return;
    fetch(`/api/trip/${encodeURIComponent(token)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((t) => {
        replace(d.slug, {
          startDate: t.startDate,
          endDate: t.endDate,
          items: t.items,
          token,
          email: t.email,
          savedAt: new Date().toISOString(),
        });
        setTab("calendar");
        setNotice("Welcome back — your saved trip is loaded.");
      })
      .catch(() => setNotice("We couldn't find that saved trip. The link may have expired."));
  }, [hydrated, token, trip.token, d.slug, replace]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return activities.filter(
      (a) =>
        (city === "All" || a.city === city) &&
        (category === "All" || a.categories.includes(category)) &&
        (!kids || a.kidFriendly) &&
        (!mustBook || a.booking.level === "essential") &&
        (!ours || (a.tncDays?.length ?? 0) > 0) &&
        (!needle || `${a.name} ${a.nameLocal ?? ""} ${a.area ?? ""} ${a.summary}`.toLowerCase().includes(needle)),
    );
  }, [activities, city, category, kids, mustBook, ours, q]);

  const actionCount = useMemo(() => {
    if (!hydrated) return 0;
    const now = new Date();
    return trip.items.filter((i) => {
      const a = activities.find((x) => x.slug === i.slug);
      if (!a || !i.date) return false;
      const w = getBookingWindow(a.booking.rule, i.date, d.timezone, now);
      if (w.status === "late") return true;
      if (w.status !== "open") return false;
      return w.kind !== "recommended" || (w.actionAt?.getTime() ?? 0) - now.getTime() < 14 * 86_400_000;
    }).length;
  }, [hydrated, trip.items, activities, d.timezone]);

  function copyOurTrip() {
    if (!trip.startDate) {
      setNotice(`Pick your arrival date first — we'll map our ${ourDays.length} days onto yours.`);
      startRef.current?.focus();
      return;
    }
    const lastDay = Math.max(...ourDays.map((x) => x.day));
    if (!trip.endDate) setDates(d.slug, trip.startDate, addDays(trip.startDate, lastDay - 1));
    let n = 0;
    for (const { day, slugs } of ourDays) {
      for (const slug of slugs) {
        if (!trip.items.some((i) => i.slug === slug)) {
          add(d.slug, slug, addDays(trip.startDate, day - 1));
          n++;
        }
      }
    }
    setNotice(n ? `Added ${n} activities from our trip, mapped onto your dates.` : "Our trip is already in your plan.");
    setTab("trip");
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const nights = trip.startDate && trip.endDate ? diffDays(trip.endDate, trip.startDate) : null;

  return (
    <div>
      {/* Trip dates */}
      <div className="border-y border-rule bg-paper">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 md:grid-cols-12 md:items-end">
          <label className="md:col-span-3">
            <span className="eyebrow text-stone">Arrive</span>
            <input
              ref={startRef}
              type="date"
              className="field"
              value={hydrated ? (trip.startDate ?? "") : ""}
              onChange={(e) => setDates(d.slug, e.target.value || null, trip.endDate)}
            />
          </label>
          <label className="md:col-span-3">
            <span className="eyebrow text-stone">Leave</span>
            <input
              type="date"
              className="field"
              min={trip.startDate ?? undefined}
              value={hydrated ? (trip.endDate ?? "") : ""}
              onChange={(e) => setDates(d.slug, trip.startDate, e.target.value || null)}
            />
          </label>
          <p className="text-sm text-espresso/80 md:col-span-2">
            {hydrated && nights !== null && nights >= 0 ? `${nights} nights` : "Your dates"}
          </p>
          <div className="md:col-span-4 md:text-right">
            <button type="button" onClick={copyOurTrip} className="btn btn-ghost w-full md:w-auto">
              Copy our {ourDays.length}-day trip
            </button>
          </div>
        </div>
        {notice && (
          <div className="mx-auto max-w-7xl px-5 pb-6 sm:px-8">
            <p role="status" className="flex items-center justify-between gap-4 bg-linen px-4 py-3 text-sm">
              {notice}
              <button type="button" onClick={() => setNotice(null)} className="text-xs text-stone" aria-label="Dismiss">
                ✕
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div ref={tabsRef} className="sticky top-16 z-40 scroll-mt-16 border-b border-rule bg-linen/95 backdrop-blur sm:top-20 sm:scroll-mt-20">
        <div role="tablist" aria-label="Planner" className="no-scrollbar mx-auto flex max-w-7xl gap-8 overflow-x-auto px-5 sm:px-8">
          {(
            [
              ["discover", "Discover", activities.length],
              ["trip", "My trip", hydrated ? trip.items.length : 0],
              ["calendar", "Ticket calendar", actionCount],
            ] as const
          ).map(([id, label, count]) => (
            <button
              key={id}
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`eyebrow relative whitespace-nowrap py-5 ${tab === id ? "text-ink" : "text-stone hover:text-ink"}`}
            >
              {label}
              {count > 0 && (
                <span
                  className={`ml-2 inline-flex min-w-5 items-center justify-center px-1.5 py-0.5 text-[0.58rem] tracking-normal ${
                    id === "calendar" ? "bg-alert text-paper" : "bg-ink text-paper"
                  }`}
                >
                  {count}
                </span>
              )}
              {tab === id && <span className="absolute inset-x-0 bottom-0 h-px bg-ink" />}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        {tab === "discover" && (
          <>
            <div className="space-y-5">
              <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
                {["All", ...d.cities].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    aria-pressed={city === c}
                    className={`eyebrow whitespace-nowrap border px-4 py-2 text-[0.62rem] transition-colors ${
                      city === c ? "border-ink bg-ink text-paper" : "border-rule hover:border-ink"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-center">
                <label className="lg:col-span-4">
                  <span className="sr-only">Search activities</span>
                  <input className="field" placeholder="Search — e.g. Pokémon, temple, aquarium" value={q} onChange={(e) => setQ(e.target.value)} />
                </label>
                <label className="lg:col-span-3">
                  <span className="sr-only">Category</span>
                  <select className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="All">All categories</option>
                    {d.categories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm sm:col-span-2 lg:col-span-5 lg:justify-end">
                  <Toggle checked={kids} onChange={setKids}>
                    Kid-friendly
                  </Toggle>
                  <Toggle checked={mustBook} onChange={setMustBook}>
                    Must pre-book
                  </Toggle>
                  <Toggle checked={ours} onChange={setOurs}>
                    On our trip
                  </Toggle>
                </div>
              </div>
            </div>

            <p className="mt-8 text-xs text-stone">
              {filtered.length} of {activities.length} experiences
            </p>
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((a, i) => (
                <ActivityCard key={a.slug} a={a} d={d} index={i} />
              ))}
            </div>
            {filtered.length === 0 && <p className="display py-16 text-center text-2xl text-espresso/70">Nothing matches those filters.</p>}
          </>
        )}

        {tab === "trip" && hydrated && <MyTrip data={data} trip={trip} onBrowse={() => setTab("discover")} />}
        {tab === "calendar" && hydrated && <TicketCalendar data={data} trip={trip} />}
      </div>

      {/* Mobile trip bar */}
      {hydrated && trip.items.length > 0 && tab === "discover" && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-paper/95 px-5 py-3 backdrop-blur md:hidden">
          <button type="button" className="btn btn-primary w-full" onClick={() => setTab("calendar")}>
            See when to book · {trip.items.length} saved
          </button>
        </div>
      )}
    </div>
  );
}

function Toggle({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-[var(--ink)]" />
      {children}
    </label>
  );
}

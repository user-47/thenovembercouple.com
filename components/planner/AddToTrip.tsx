"use client";

import { useEffect, useRef, useState } from "react";
import { useHydrated, useTrip, useTripStore } from "@/lib/trip-store";
import { tripDays } from "./shared";

/** Add an activity to the follower's trip, choosing which day. */
export function AddToTrip({
  destination,
  slug,
  name,
  full = false,
}: {
  destination: string;
  slug: string;
  name: string;
  full?: boolean;
}) {
  const hydrated = useHydrated();
  const trip = useTrip(destination);
  const add = useTripStore((s) => s.add);
  const remove = useTripStore((s) => s.remove);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const item = trip.items.find((i) => i.slug === slug);
  const days = tripDays(trip.startDate, trip.endDate);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const choose = (date: string | null) => {
    add(destination, slug, date);
    setOpen(false);
  };

  if (!hydrated) return <button className={`btn btn-ghost btn-sm ${full ? "w-full" : ""}`} disabled>Add to trip</button>;

  return (
    <div ref={ref} className={`relative ${full ? "w-full" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={item ? `${name} is in your trip — change day` : `Add ${name} to your trip`}
        className={`btn btn-sm ${item ? "btn-primary" : "btn-ghost"} ${full ? "w-full" : ""}`}
      >
        {item ? "✓ In your trip" : "+ Add to trip"}
      </button>

      {open && (
        <div className="absolute bottom-full right-0 z-30 mb-2 w-72 border border-rule bg-paper p-4 shadow-[0_20px_50px_-20px_rgba(17,17,17,0.35)]">
          <p className="eyebrow text-stone">Which day?</p>
          {days.length > 0 ? (
            <ul className="no-scrollbar mt-3 max-h-64 overflow-y-auto">
              {days.map((d) => (
                <li key={d.date}>
                  <button
                    type="button"
                    onClick={() => choose(d.date)}
                    className={`w-full px-2 py-2 text-left text-sm hover:bg-linen ${item?.date === d.date ? "bg-linen font-medium" : ""}`}
                  >
                    {d.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <label className="mt-3 block text-sm">
              <span className="text-espresso/80">Pick your visit date</span>
              <input type="date" className="field mt-1" defaultValue={item?.date ?? ""} onChange={(e) => e.target.value && choose(e.target.value)} />
            </label>
          )}
          <div className="mt-3 flex items-center justify-between border-t border-rule pt-3">
            <button type="button" onClick={() => choose(null)} className="text-xs underline-offset-4 hover:underline">
              Not sure yet
            </button>
            {item && (
              <button
                type="button"
                onClick={() => {
                  remove(destination, slug);
                  setOpen(false);
                }}
                className="text-xs text-alert underline-offset-4 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

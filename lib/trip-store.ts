"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TripItem {
  slug: string;
  date: string | null; // YYYY-MM-DD, null = not scheduled yet
}

export interface Trip {
  startDate: string | null;
  endDate: string | null;
  items: TripItem[];
  /** Set once saved to the server (magic-link token). */
  token?: string;
  email?: string;
  savedAt?: string;
}

const emptyTrip = (): Trip => ({ startDate: null, endDate: null, items: [] });

interface TripState {
  trips: Record<string, Trip>; // keyed by destination slug
  setDates: (dest: string, start: string | null, end: string | null) => void;
  add: (dest: string, slug: string, date: string | null) => void;
  setItemDate: (dest: string, slug: string, date: string | null) => void;
  remove: (dest: string, slug: string) => void;
  replace: (dest: string, trip: Trip) => void;
  markSaved: (dest: string, token: string, email: string) => void;
  clear: (dest: string) => void;
}

const update = (s: TripState, dest: string, fn: (t: Trip) => Trip) => ({
  trips: { ...s.trips, [dest]: { ...fn(s.trips[dest] ?? emptyTrip()), savedAt: undefined } },
});

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      trips: {},
      setDates: (dest, startDate, endDate) => set((s) => update(s, dest, (t) => ({ ...t, startDate, endDate }))),
      add: (dest, slug, date) =>
        set((s) =>
          update(s, dest, (t) => ({
            ...t,
            items: t.items.some((i) => i.slug === slug)
              ? t.items.map((i) => (i.slug === slug ? { ...i, date: date ?? i.date } : i))
              : [...t.items, { slug, date }],
          })),
        ),
      setItemDate: (dest, slug, date) =>
        set((s) => update(s, dest, (t) => ({ ...t, items: t.items.map((i) => (i.slug === slug ? { ...i, date } : i)) }))),
      remove: (dest, slug) => set((s) => update(s, dest, (t) => ({ ...t, items: t.items.filter((i) => i.slug !== slug) }))),
      replace: (dest, trip) => set((s) => ({ trips: { ...s.trips, [dest]: trip } })),
      markSaved: (dest, token, email) =>
        set((s) => ({
          trips: { ...s.trips, [dest]: { ...(s.trips[dest] ?? emptyTrip()), token, email, savedAt: new Date().toISOString() } },
        })),
      clear: (dest) => set((s) => ({ trips: { ...s.trips, [dest]: emptyTrip() } })),
    }),
    { name: "tnc-trips", version: 1 },
  ),
);

export function useTrip(dest: string): Trip {
  return useTripStore((s) => s.trips[dest]) ?? EMPTY;
}
const EMPTY: Trip = emptyTrip();

/** True once the persisted store has loaded from localStorage (avoids hydration mismatch). */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => {
    const unsub = useTripStore.persist.onFinishHydration(() => setH(true));
    if (useTripStore.persist.hasHydrated()) setH(true);
    return unsub;
  }, []);
  return h;
}

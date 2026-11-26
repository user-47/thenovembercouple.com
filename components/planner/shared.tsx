"use client";

import { useEffect, useState } from "react";
import type { Activity, Destination } from "@/lib/schema";
import type { BookingWindow } from "@/lib/booking-rules";
import { addDays, diffDays, eachDay, formatYmd } from "@/lib/dates";

export interface PlannerData {
  destination: Destination;
  activities: Activity[];
}

export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function tripDays(start: string | null, end: string | null) {
  if (!start) return [];
  const last = end && diffDays(end, start) >= 0 ? end : addDays(start, 6);
  return eachDay(start, last).map((date, i) => ({ date, label: `Day ${i + 1} · ${formatYmd(date)}` }));
}

export function LevelBadge({ level }: { level: Activity["booking"]["level"] }) {
  const map = {
    essential: { text: "Must pre-book", cls: "border-espresso text-espresso" },
    recommended: { text: "Book ahead", cls: "border-bronze text-bronze" },
    none: { text: "Walk in", cls: "border-rule text-stone" },
  } as const;
  const m = map[level];
  return <span className={`eyebrow inline-block border px-2 py-1 text-[0.6rem] ${m.cls}`}>{m.text}</span>;
}

export function StatusPill({ w, risk }: { w: BookingWindow; risk: Activity["booking"]["sellOutRisk"] }) {
  const hot = risk === "extreme" || risk === "high";
  const map: Record<BookingWindow["status"], { text: string; cls: string }> = {
    upcoming: { text: w.kind === "lottery" ? "Lottery opens soon" : "Opens soon", cls: "bg-paper text-espresso border border-rule" },
    open: {
      text: w.kind === "recommended" ? "Book any time before" :w.kind === "lottery" ? "Lottery open" : hot ? "On sale — sells out fast" : "On sale now",
      cls: hot ? "bg-alert text-paper" : "bg-ok text-paper",
    },
    closed: { text: "Lottery closed — check general sale", cls: "bg-stone text-paper" },
    late: { text: "Book ASAP", cls: "bg-alert text-paper" },
    "visit-passed": { text: "Date passed", cls: "bg-rule text-espresso" },
    walkin: { text: "No booking needed", cls: "bg-paper text-stone border border-rule" },
  };
  const m = map[w.status];
  return <span className={`eyebrow inline-block px-2 py-1 text-[0.58rem] ${m.cls}`}>{m.text}</span>;
}

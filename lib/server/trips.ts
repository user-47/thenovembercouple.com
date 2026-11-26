import "server-only";
import { getBookingWindow, getReminderTimes, type BookingWindow } from "@/lib/booking-rules";
import { formatYmd } from "@/lib/dates";
import type { DestinationBundle } from "@/lib/destinations";
import { fmtDateTime, fmtTime } from "@/lib/format";

export function whenText(w: BookingWindow, b: DestinationBundle, viewerTz?: string | null): string {
  const d = b.destination;
  if (!w.actionDate) return "No booking needed";
  const verb = w.kind === "lottery" ? "Lottery entries open" : w.kind === "recommended" ? "Book by" : "Tickets open";
  let s = `${verb} ${formatYmd(w.actionDate)}`;
  if (w.kind === "lottery" && w.endDate) s += ` – ${formatYmd(w.endDate)}`;
  if (w.hasTime && w.actionAt) {
    s += ` at ${fmtTime(w.actionAt, d.timezone)} ${d.timezoneLabel}`;
    if (viewerTz && viewerTz !== d.timezone) {
      try {
        s += ` (${fmtDateTime(w.actionAt, viewerTz)} your time)`;
      } catch {
        /* invalid tz — skip */
      }
    }
  }
  return s;
}

export function planReminders(b: DestinationBundle, items: { slug: string; date: string | null }[], now = new Date()) {
  const rows: { activity_slug: string; visit_date: string; label: string; send_at: string }[] = [];
  const summary: { name: string; window: BookingWindow; visitDate: string }[] = [];
  for (const it of items) {
    if (!it.date) continue;
    const a = b.activities.find((x) => x.slug === it.slug);
    if (!a) continue;
    const w = getBookingWindow(a.booking.rule, it.date, b.destination.timezone, now);
    if (w.kind === "none" || w.status === "visit-passed") continue;
    summary.push({ name: a.name, window: w, visitDate: it.date });
    for (const r of getReminderTimes(w, now)) {
      rows.push({ activity_slug: a.slug, visit_date: it.date, label: r.label, send_at: r.at.toISOString() });
    }
  }
  summary.sort((x, y) => (x.window.actionAt?.getTime() ?? 0) - (y.window.actionAt?.getTime() ?? 0));
  return { rows, summary };
}

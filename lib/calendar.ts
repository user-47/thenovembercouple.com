import { createEvents, type EventAttributes } from "ics";
import type { BookingWindow } from "./booking-rules";
import { addDays, parseYmd } from "./dates";

export interface CalendarItem {
  uid: string;
  title: string;
  description: string;
  url?: string;
  window: BookingWindow;
}

function eventTimes(w: BookingWindow): { start: Date; end: Date; allDay: boolean } | null {
  if (!w.actionAt || !w.actionDate) return null;
  if (w.hasTime) return { start: w.actionAt, end: new Date(w.actionAt.getTime() + 30 * 60_000), allDay: false };
  return { start: w.actionAt, end: new Date(w.actionAt.getTime() + 86_400_000), allDay: true };
}

/** Build a single .ics file with one event (and alarms) per booking action. */
export function buildIcs(items: CalendarItem[], calName: string): string {
  const events: EventAttributes[] = [];
  for (const it of items) {
    const t = eventTimes(it.window);
    if (!t || !it.window.actionDate) continue;
    const common = {
      uid: it.uid,
      title: it.title,
      description: it.description,
      url: it.url,
      calName,
      productId: "thenovembercouple.com",
      alarms:
        it.window.kind === "release"
          ? [
              { action: "display" as const, description: it.title, trigger: { days: 1, before: true } },
              { action: "display" as const, description: it.title, trigger: { minutes: 15, before: true } },
            ]
          : [{ action: "display" as const, description: it.title, trigger: { hours: 15, before: true } }],
    };
    if (t.allDay) {
      const s = parseYmd(it.window.actionDate);
      const e = parseYmd(addDays(it.window.actionDate, 1));
      events.push({ ...common, start: [s.y, s.m, s.d], end: [e.y, e.m, e.d] });
    } else {
      events.push({
        ...common,
        start: t.start.getTime(),
        startInputType: "utc",
        startOutputType: "utc",
        end: t.end.getTime(),
        endInputType: "utc",
        endOutputType: "utc",
      });
    }
  }
  const { error, value } = createEvents(events);
  if (error || !value) throw error ?? new Error("Could not build calendar");
  return value;
}

const gcalStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export function googleCalendarUrl(it: CalendarItem): string | null {
  const t = eventTimes(it.window);
  if (!t || !it.window.actionDate) return null;
  const dates = t.allDay
    ? `${it.window.actionDate.replace(/-/g, "")}/${addDays(it.window.actionDate, 1).replace(/-/g, "")}`
    : `${gcalStamp(t.start)}/${gcalStamp(t.end)}`;
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: it.title,
    dates,
    details: it.description + (it.url ? `\n\n${it.url}` : ""),
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export function outlookCalendarUrl(it: CalendarItem): string | null {
  const t = eventTimes(it.window);
  if (!t) return null;
  const p = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: it.title,
    startdt: t.allDay ? it.window.actionDate! : t.start.toISOString(),
    enddt: t.allDay ? addDays(it.window.actionDate!, 1) : t.end.toISOString(),
    allday: String(t.allDay),
    body: it.description + (it.url ? `\n\n${it.url}` : ""),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${p.toString()}`;
}

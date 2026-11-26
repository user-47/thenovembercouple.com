import { fromZonedTime } from "date-fns-tz";
import type { BookingRule } from "./schema";
import { addDays, addMonths, firstOfMonth, lastOfMonth, parseYmd, toYmd } from "./dates";

export type WindowKind = "release" | "lottery" | "recommended" | "none";

export type WindowStatus =
  | "upcoming" // tickets/entries open in the future
  | "open" // on sale now / lottery open / fine to book now
  | "closed" // lottery entry window has closed
  | "late" // past the recommended book-by date — still try
  | "visit-passed" // the visit date is in the past
  | "walkin"; // no booking needed

export interface BookingWindow {
  kind: WindowKind;
  status: WindowStatus;
  /** The calendar date (destination-local) on which to act. */
  actionDate: string | null;
  /** Exact instant to act. When `hasTime` is false this is 00:00 destination-local. */
  actionAt: Date | null;
  hasTime: boolean;
  /** Lottery: last day of the entry window (destination-local). */
  endDate?: string;
  endAt?: Date;
}

const at = (ymd: string, time: string | undefined, tz: string) =>
  fromZonedTime(`${ymd}T${time ?? "00:00"}:00`, tz);

/**
 * Work out when a follower needs to act for a given visit date.
 * Pure: pass `now` for deterministic tests.
 */
export function getBookingWindow(
  rule: BookingRule,
  visitDate: string,
  tz: string,
  now: Date = new Date(),
): BookingWindow {
  const visitEnd = at(addDays(visitDate, 1), undefined, tz);
  const visitPassed = now >= visitEnd;

  switch (rule.type) {
    case "none":
      return { kind: "none", status: visitPassed ? "visit-passed" : "walkin", actionDate: null, actionAt: null, hasTime: false };

    case "daysBefore":
    case "monthsBefore":
    case "monthlyRelease": {
      let actionDate: string;
      if (rule.type === "daysBefore") actionDate = addDays(visitDate, -rule.days);
      else if (rule.type === "monthsBefore") actionDate = addMonths(visitDate, -rule.months);
      else {
        const releaseMonth = addMonths(firstOfMonth(visitDate), -rule.monthsAhead);
        const { y, m } = parseYmd(releaseMonth);
        actionDate = toYmd(y, m, rule.dayOfMonth);
      }
      const actionAt = at(actionDate, rule.time, tz);
      const status: WindowStatus = visitPassed ? "visit-passed" : now < actionAt ? "upcoming" : "open";
      return { kind: "release", status, actionDate, actionAt, hasTime: Boolean(rule.time) };
    }

    case "lottery": {
      const actionDate = addMonths(firstOfMonth(visitDate), -rule.entryMonthsBefore);
      const endDate = rule.entryWindowDays ? addDays(actionDate, rule.entryWindowDays - 1) : lastOfMonth(actionDate);
      const actionAt = at(actionDate, undefined, tz);
      const endAt = at(addDays(endDate, 1), undefined, tz);
      const status: WindowStatus = visitPassed
        ? "visit-passed"
        : now < actionAt
          ? "upcoming"
          : now < endAt
            ? "open"
            : "closed";
      return { kind: "lottery", status, actionDate, actionAt, hasTime: false, endDate, endAt };
    }

    case "recommended": {
      const actionDate = addDays(visitDate, -rule.daysBefore);
      const actionAt = at(actionDate, undefined, tz);
      const deadline = at(addDays(actionDate, 1), undefined, tz);
      const status: WindowStatus = visitPassed ? "visit-passed" : now < deadline ? "open" : "late";
      return { kind: "recommended", status, actionDate, actionAt, hasTime: false };
    }
  }
}

/** Instants at which to remind someone (email + calendar alarms). Past times are dropped. */
export function getReminderTimes(w: BookingWindow, now: Date = new Date()): { at: Date; label: string }[] {
  if (!w.actionAt) return [];
  const H = 3_600_000;
  let out: { at: Date; label: string }[] = [];
  if (w.kind === "release") {
    out = [
      { at: new Date(w.actionAt.getTime() - 24 * H), label: "Tickets open tomorrow" },
      { at: new Date(w.actionAt.getTime() - 1 * H), label: "Tickets open in 1 hour" },
    ];
  } else if (w.kind === "lottery") {
    out = [{ at: w.actionAt, label: "Lottery entries are open" }];
    if (w.endAt) out.push({ at: new Date(w.endAt.getTime() - 72 * H), label: "Lottery closes in 3 days" });
  } else if (w.kind === "recommended") {
    out = [{ at: new Date(w.actionAt.getTime() - 72 * H), label: "Book within the next 3 days" }];
  }
  return out.filter((r) => r.at > now);
}

export function describeRule(rule: BookingRule, tzLabel: string): string {
  switch (rule.type) {
    case "none":
      return "No booking needed";
    case "daysBefore":
      return `Released ${rule.days} days before${rule.time ? ` · ${fmt12(rule.time)} ${tzLabel}` : ""}`;
    case "monthsBefore":
      return `Released ${rule.months} month${rule.months > 1 ? "s" : ""} before${rule.time ? ` · ${fmt12(rule.time)} ${tzLabel}` : ""}`;
    case "monthlyRelease":
      return `Whole month released on the ${ordinal(rule.dayOfMonth)} of the ${rule.monthsAhead === 1 ? "previous month" : `month ${rule.monthsAhead} months before`}${rule.time ? ` · ${fmt12(rule.time)} ${tzLabel}` : ""}`;
    case "lottery":
      return `Lottery — enter ${rule.entryMonthsBefore} months before`;
    case "recommended":
      return rule.daysBefore === 0 ? "Book ahead when you can" : `Book ~${rule.daysBefore} days ahead`;
  }
}

export function fmt12(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${suffix}`;
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

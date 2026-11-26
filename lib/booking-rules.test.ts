import { describe, expect, it } from "vitest";
import { getBookingWindow, getReminderTimes } from "./booking-rules";
import { addMonths } from "./dates";

const TZ = "Asia/Tokyo";
const before = new Date("2026-01-01T00:00:00Z");

describe("getBookingWindow", () => {
  it("Ghibli Museum: visit Nov 27 → 10th of previous month, 10:00 JST", () => {
    const w = getBookingWindow({ type: "monthlyRelease", dayOfMonth: 10, monthsAhead: 1, time: "10:00" }, "2026-11-27", TZ, before);
    expect(w.actionDate).toBe("2026-10-10");
    expect(w.actionAt?.toISOString()).toBe("2026-10-10T01:00:00.000Z"); // 10:00 JST = 01:00 UTC
    expect(w.status).toBe("upcoming");
  });

  it("Ghibli across a year boundary: visit Jan 5 → Dec 10 of prior year", () => {
    const w = getBookingWindow({ type: "monthlyRelease", dayOfMonth: 10, monthsAhead: 1, time: "10:00" }, "2027-01-05", TZ, before);
    expect(w.actionDate).toBe("2026-12-10");
  });

  it("Tokyo Disney: visit Nov 27 → 60 days before at 14:00 JST", () => {
    const w = getBookingWindow({ type: "daysBefore", days: 60, time: "14:00" }, "2026-11-27", TZ, before);
    expect(w.actionDate).toBe("2026-09-28");
    expect(w.actionAt?.toISOString()).toBe("2026-09-28T05:00:00.000Z");
  });

  it("Pokémon Café: visit Dec 4 → 31 days before at 18:00 JST", () => {
    const w = getBookingWindow({ type: "daysBefore", days: 31, time: "18:00" }, "2026-12-04", TZ, before);
    expect(w.actionDate).toBe("2026-11-03");
    expect(w.actionAt?.toISOString()).toBe("2026-11-03T09:00:00.000Z");
  });

  it("Shibuya Sky: visit Nov 29 → 14 days before at 00:00 JST (= previous day 15:00 UTC)", () => {
    const w = getBookingWindow({ type: "daysBefore", days: 14, time: "00:00" }, "2026-11-29", TZ, new Date("2026-11-14T17:00:00Z"));
    expect(w.actionDate).toBe("2026-11-15");
    expect(w.actionAt?.toISOString()).toBe("2026-11-14T15:00:00.000Z");
    expect(w.status).toBe("open");
  });

  it("USJ: 3 months before, clamps to month length", () => {
    expect(addMonths("2026-05-31", -3)).toBe("2026-02-28");
    const w = getBookingWindow({ type: "monthsBefore", months: 3 }, "2026-12-04", TZ, before);
    expect(w.actionDate).toBe("2026-09-04");
    expect(w.hasTime).toBe(false);
  });

  it("Nintendo Museum lottery: Dec visit → entries during September", () => {
    const w = getBookingWindow({ type: "lottery", entryMonthsBefore: 3 }, "2026-12-15", TZ, new Date("2026-10-05T00:00:00Z"));
    expect(w.actionDate).toBe("2026-09-01");
    expect(w.endDate).toBe("2026-09-30");
    expect(w.status).toBe("closed");
  });

  it("recommended: book-by date and late status", () => {
    const w = getBookingWindow({ type: "recommended", daysBefore: 14 }, "2026-11-28", TZ, new Date("2026-11-20T00:00:00Z"));
    expect(w.actionDate).toBe("2026-11-14");
    expect(w.status).toBe("late");
  });

  it("visit in the past → visit-passed", () => {
    const w = getBookingWindow({ type: "daysBefore", days: 60, time: "14:00" }, "2026-11-27", TZ, new Date("2026-12-01T00:00:00Z"));
    expect(w.status).toBe("visit-passed");
  });

  it("works for other destinations' timezones (Bali, UTC+8)", () => {
    const w = getBookingWindow({ type: "daysBefore", days: 7, time: "09:00" }, "2027-03-10", "Asia/Makassar", before);
    expect(w.actionAt?.toISOString()).toBe("2027-03-03T01:00:00.000Z");
  });
});

describe("getReminderTimes", () => {
  it("release → 24h and 1h before, past ones dropped", () => {
    const w = getBookingWindow({ type: "daysBefore", days: 60, time: "14:00" }, "2026-11-27", TZ, before);
    const all = getReminderTimes(w, before).map((r) => r.at.toISOString());
    expect(all).toEqual(["2026-09-27T05:00:00.000Z", "2026-09-28T04:00:00.000Z"]);
    const late = getReminderTimes(w, new Date("2026-09-28T03:00:00Z"));
    expect(late).toHaveLength(1);
  });
});

import { describe, expect, it } from "vitest";
import { getBookingWindow } from "./booking-rules";
import { buildIcs, googleCalendarUrl, outlookCalendarUrl } from "./calendar";

const now = new Date("2026-01-01T00:00:00Z");
const timed = getBookingWindow({ type: "monthlyRelease", dayOfMonth: 10, monthsAhead: 1, time: "10:00" }, "2026-11-27", "Asia/Tokyo", now);
const allDay = getBookingWindow({ type: "recommended", daysBefore: 21 }, "2026-11-28", "Asia/Tokyo", now);

describe("calendar export", () => {
  it("builds an .ics with a UTC timed event, an all-day event and alarms", () => {
    const ics = buildIcs(
      [
        { uid: "a@tnc", title: "Tickets open: Ghibli Museum", description: "d", window: timed },
        { uid: "b@tnc", title: "Book by: teamLab", description: "d", window: allDay },
      ],
      "Japan",
    );
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("DTSTART:20261010T010000Z");
    expect(ics).toContain("DTSTART;VALUE=DATE:20261107");
    expect(ics.match(/BEGIN:VALARM/g)?.length).toBe(3);
  });

  it("builds Google and Outlook links", () => {
    const item = { uid: "a", title: "Tickets open", description: "d", window: timed };
    expect(googleCalendarUrl(item)).toContain("dates=20261010T010000Z%2F20261010T013000Z");
    expect(outlookCalendarUrl(item)).toContain("startdt=2026-10-10T01%3A00%3A00.000Z");
  });
});

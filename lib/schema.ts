import { z } from "zod";

/** YYYY-MM-DD calendar date (interpreted in the destination's timezone). */
export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");
const hhmm = z.string().regex(/^\d{2}:\d{2}$/, "Expected HH:mm");

/**
 * How/when tickets for an activity become available, relative to the visit date.
 * All times are local to the destination (e.g. JST for Japan).
 */
export const bookingRuleSchema = z.discriminatedUnion("type", [
  // Rolling release N days before the visit (Disney 60d @14:00, Pokémon Café 31d @18:00…)
  z.object({ type: z.literal("daysBefore"), days: z.number().int().positive(), time: hhmm.optional() }),
  // Rolling release N calendar months before the visit (USJ: 3 months)
  z.object({ type: z.literal("monthsBefore"), months: z.number().int().positive(), time: hhmm.optional() }),
  // A whole month released on a fixed day of an earlier month (Ghibli: 10th of prior month @10:00)
  z.object({
    type: z.literal("monthlyRelease"),
    dayOfMonth: z.number().int().min(1).max(28),
    monthsAhead: z.number().int().positive().default(1),
    time: hhmm.optional(),
  }),
  // Lottery entry window during a month N months before the visit (Nintendo Museum)
  z.object({
    type: z.literal("lottery"),
    entryMonthsBefore: z.number().int().positive(),
    entryWindowDays: z.number().int().positive().optional(), // default: whole month
    note: z.string().optional(),
  }),
  // No hard release — just book by N days before (teamLab, kimono rental, restaurants)
  z.object({ type: z.literal("recommended"), daysBefore: z.number().int().nonnegative() }),
  // Walk in
  z.object({ type: z.literal("none") }),
]);
export type BookingRule = z.infer<typeof bookingRuleSchema>;

export const linkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
  kind: z.enum(["official", "affiliate"]),
  partner: z.string().optional(), // key in lib/affiliates.ts, e.g. "klook"
});
export type ActivityLink = z.infer<typeof linkSchema>;

export const activitySchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  nameLocal: z.string().optional(),
  city: z.string(),
  area: z.string().optional(),
  categories: z.array(z.string()).min(1),
  kidFriendly: z.boolean(),
  kidNotes: z.string().optional(),
  durationHrs: z.number().positive().optional(),
  priceFrom: z.number().nonnegative().nullable().optional(), // destination currency, adult, approx.
  priceNote: z.string().optional(),
  image: z.string().optional(),
  summary: z.string(),
  tncTip: z.string().optional(),
  tncDays: z.array(z.number().int().positive()).optional(), // days on the couple's itinerary
  booking: z.object({
    level: z.enum(["essential", "recommended", "none"]),
    rule: bookingRuleSchema,
    sellOutRisk: z.enum(["extreme", "high", "medium", "low"]).default("low"),
    howTo: z.string().optional(),
    links: z.array(linkSchema).default([]),
  }),
  lastVerified: isoDate,
  sourceUrl: z.string().url().optional(),
});
export type Activity = z.infer<typeof activitySchema>;

export const destinationSchema = z.object({
  slug: z.string(),
  name: z.string(),
  nameLocal: z.string().optional(),
  tagline: z.string(),
  intro: z.string(),
  status: z.enum(["live", "coming-soon"]),
  timezone: z.string(), // IANA, e.g. Asia/Tokyo
  timezoneLabel: z.string(), // e.g. JST
  currency: z.string(), // ISO 4217
  currencySymbol: z.string(),
  ourTrip: z.object({ start: isoDate, end: isoDate, label: z.string() }),
  coverImage: z.string().optional(),
  cities: z.array(z.string()),
  categories: z.array(z.string()),
  essentials: z
    .array(
      z.object({
        title: z.string(),
        body: z.string(),
        links: z.array(linkSchema).default([]),
      }),
    )
    .default([]),
});
export type Destination = z.infer<typeof destinationSchema>;

export const itineraryEntrySchema = z.object({
  time: z.string(),
  title: z.string(),
  note: z.string().optional(),
  activity: z.string().optional(), // activity slug
  status: z.enum(["booked", "reserved", "to-book"]).optional(),
});

export const itinerarySchema = z.object({
  summary: z.string(),
  days: z.array(
    z.object({
      day: z.number().int().positive(),
      date: isoDate,
      location: z.string(),
      title: z.string(),
      transfer: z.string().optional(),
      entries: z.array(itineraryEntrySchema),
    }),
  ),
});
export type Itinerary = z.infer<typeof itinerarySchema>;
export type ItineraryDay = Itinerary["days"][number];

import { rawDestinations } from "@/content/destinations";
import {
  activitySchema,
  destinationSchema,
  itinerarySchema,
  type Activity,
  type Destination,
  type Itinerary,
} from "./schema";

export interface DestinationBundle {
  destination: Destination;
  itinerary: Itinerary;
  activities: Activity[];
}

let cache: DestinationBundle[] | null = null;

/** Load + validate every destination. Throws at build time if content is malformed. */
export function getAllDestinations(): DestinationBundle[] {
  if (cache) return cache;
  cache = rawDestinations.map((raw) => {
    const destination = destinationSchema.parse(raw.destination);
    const itinerary = itinerarySchema.parse(raw.itinerary);
    const activities = activitySchema.array().parse(raw.activities);

    const slugs = new Set<string>();
    for (const a of activities) {
      if (slugs.has(a.slug)) throw new Error(`[${destination.slug}] duplicate activity slug "${a.slug}"`);
      slugs.add(a.slug);
    }
    for (const day of itinerary.days) {
      for (const e of day.entries) {
        if (e.activity && !slugs.has(e.activity)) {
          throw new Error(`[${destination.slug}] itinerary day ${day.day} references unknown activity "${e.activity}"`);
        }
      }
    }
    return { destination, itinerary, activities };
  });
  return cache;
}

export function getDestination(slug: string): DestinationBundle | undefined {
  return getAllDestinations().find((d) => d.destination.slug === slug);
}

export function getActivity(destinationSlug: string, activitySlug: string) {
  const bundle = getDestination(destinationSlug);
  const activity = bundle?.activities.find((a) => a.slug === activitySlug);
  return bundle && activity ? { ...bundle, activity } : undefined;
}

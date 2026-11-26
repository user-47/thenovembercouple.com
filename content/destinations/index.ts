/**
 * Destination registry.
 * To add a trip: create content/destinations/<slug>/{destination,itinerary,activities}.json
 * and add one entry below. Everything else (pages, planner, reminders) is generated.
 */
import japanDestination from "./japan/destination.json";
import japanItinerary from "./japan/itinerary.json";
import japanActivities from "./japan/activities.json";

export const rawDestinations = [
  { destination: japanDestination, itinerary: japanItinerary, activities: japanActivities },
];

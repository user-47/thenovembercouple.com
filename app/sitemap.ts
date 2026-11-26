import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { getAllDestinations } from "@/lib/destinations";
import { getAllPosts } from "@/lib/journal";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${site.url}${p}`;
  const pages = ["", "/trips", "/journal", "/about", "/work-with-us", "/contact"].map((p) => ({ url: u(p) }));
  const trips = getAllDestinations().flatMap(({ destination: d, activities }) => [
    { url: u(`/trips/${d.slug}`) },
    { url: u(`/trips/${d.slug}/planner`) },
    ...(d.essentials.length ? [{ url: u(`/trips/${d.slug}/essentials`) }] : []),
    ...activities.map((a) => ({ url: u(`/trips/${d.slug}/${a.slug}`), lastModified: a.lastVerified })),
  ]);
  const posts = getAllPosts().map((p) => ({ url: u(`/journal/${p.slug}`), lastModified: p.date }));
  return [...pages, ...trips, ...posts];
}

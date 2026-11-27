import type { ActivityLink } from "./schema";

/**
 * Affiliate partners. Links in content carry the plain partner URL; the /go route
 * appends the tracking parameter from env so IDs never live in content files.
 */
export const partners: Record<string, { name: string; param: string; env: string }> = {
  klook: { name: "Klook", param: "aid", env: "AFFILIATE_KLOOK_AID" },
  getyourguide: { name: "GetYourGuide", param: "partner_id", env: "AFFILIATE_GYG_PARTNER_ID" },
  viator: { name: "Viator", param: "pid", env: "AFFILIATE_VIATOR_PID" },
};

export function withAffiliate(url: string, partner?: string): string {
  if (!partner) return url;
  const p = partners[partner];
  const id = p ? process.env[p.env] : undefined;
  if (!p || !id) return url;
  const u = new URL(url);
  u.searchParams.set(p.param, id);
  return u.toString();
}

/** Internal tracked URL for an activity link. */
export function goHref(destination: string, activity: string, index: number) {
  return `/go/${destination}/${activity}/${index}`;
}

/** Affiliate links first (the primary "Book" button), official links after. Keeps each link's index for goHref. */
export function orderedLinks(links: ActivityLink[]) {
  return links
    .map((link, index) => ({ link, index }))
    .sort((a, b) => Number(b.link.kind === "affiliate") - Number(a.link.kind === "affiliate"));
}

export function linkLabel(link: ActivityLink) {
  return link.kind === "affiliate" ? `Book on ${link.label}` : link.label;
}

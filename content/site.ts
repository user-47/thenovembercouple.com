export const site = {
  name: "The November Couple",
  shortName: "TNC",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thenovembercouple.com",
  description:
    "The November Couple — a family of four sharing real family travel, lifestyle and the trips we actually plan. Trip planners, travel guides and brand partnerships.",
  tagline: "A family of four, sharing travel, home and everyday life.",
  instagram: "https://www.instagram.com/thenovembercouple/",
  instagramHandle: "@thenovembercouple",
  contactEmail: "hello@thenovembercouple.com",
  /** Optional hero image in /public, e.g. "/images/hero.jpg". Leave null for the typographic hero. */
  heroImage: null as string | null,
  nav: [
    { href: "/trips", label: "Trips" },
    { href: "/journal", label: "Journal" },
    { href: "/about", label: "About" },
    { href: "/work-with-us", label: "Work with us" },
  ],
};

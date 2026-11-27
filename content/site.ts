export const site = {
  name: "The November Couple",
  shortName: "TNC",
  tagline: "Travel. Live. Explore. Together.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://thenovembercouple.com",
  description:
    "The November Couple is a lifestyle, travel and experiences journal — travel stories, beautiful homes, good food, family life and the everyday moments worth sharing.",
  couple: "Olumide and Tosin",
  homeBase: "Calgary",
  kidsAges: "Ages 3 & 5",
  contactEmail: "hello@thenovembercouple.com",
  instagram: "https://www.instagram.com/thenovembercouple/",
  instagramHandle: "@thenovembercouple",
  /** Add other profiles here as they're confirmed; only listed ones render. */
  socials: [{ label: "Instagram", href: "https://www.instagram.com/thenovembercouple/", icon: "instagram" }] as const,
  nav: [
    { href: "/", label: "Home" },
    { href: "/travel", label: "Travel" },
    { href: "/luxury-homes", label: "Luxury Homes" },
    { href: "/food-and-dining", label: "Food & Dining" },
    { href: "/lifestyle", label: "Lifestyle" },
    { href: "/about", label: "About" },
  ],
};

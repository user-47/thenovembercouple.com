/**
 * Content pillars. Each one is a collection page at /<slug>; journal posts join one
 * with `pillar: <slug>` in their frontmatter.
 */
export const pillars = [
  {
    slug: "travel",
    title: "Travel",
    cardTitle: "Travel",
    icon: "plane",
    description: "Destination stories, itineraries, recommendations and the travel tips we wish we’d had before we left.",
    image: undefined as string | undefined,
  },
  {
    slug: "luxury-homes",
    title: "Luxury Homes",
    cardTitle: "Luxury Homes",
    icon: "home",
    description: "Beautiful homes, architectural details, interiors and property tours — spaces worth exploring.",
    image: undefined as string | undefined,
  },
  {
    slug: "food-and-dining",
    title: "Food & Dining",
    cardTitle: "Food & Dining",
    icon: "dining",
    description: "Restaurant discoveries, dining experiences and the meals worth travelling for.",
    image: undefined as string | undefined,
  },
  {
    slug: "parenting-and-family",
    title: "Parenting & Family",
    cardTitle: "Parenting & Family",
    icon: "family",
    description: "Family experiences, activities and the real moments of raising two little ones.",
    image: undefined as string | undefined,
  },
  {
    slug: "lifestyle",
    title: "Lifestyle & Home",
    cardTitle: "Lifestyle & Home",
    icon: "sofa",
    description: "Home decor, DIY projects, furniture, storage and the everyday finds that make life easier.",
    image: undefined as string | undefined,
  },
] as const;

export type Pillar = (typeof pillars)[number];
export type PillarSlug = Pillar["slug"];

export const getPillar = (slug: string) => pillars.find((p) => p.slug === slug);

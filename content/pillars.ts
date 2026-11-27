/**
 * Content pillars. Each one is a collection page at /<slug>; journal posts join one
 * with `pillar: <slug>` in their frontmatter. `image` is the cover used on the homepage
 * card and the collection page; put photos in public/images/.
 */
export const pillars = [
  {
    slug: "travel",
    title: "Travel",
    cardTitle: "Travel",
    icon: "plane",
    description: "Destination stories, itineraries, recommendations and the travel tips we wish we’d had before we left.",
    image: "/images/tokyo/denboin-dori-gate.jpg" as string | undefined,
    imageAlt: "The red Denbōin-dōri gate in Asakusa, Tokyo, at night" as string | undefined,
    imagePosition: "50% 72%" as string | undefined,
  },
  {
    slug: "luxury-homes",
    title: "Luxury Homes",
    cardTitle: "Luxury Homes",
    icon: "home",
    description: "Beautiful homes, architectural details, interiors and property tours — spaces worth exploring.",
    image: undefined as string | undefined,
    imageAlt: undefined as string | undefined,
    imagePosition: undefined as string | undefined,
  },
  {
    slug: "food-and-dining",
    title: "Food & Dining",
    cardTitle: "Food & Dining",
    icon: "dining",
    description: "Restaurant discoveries, dining experiences and the meals worth travelling for.",
    image: "/images/tokyo/ningyo-yaki-shop.jpg" as string | undefined,
    imageAlt: "Boxes of ningyo-yaki cakes at a sweet shop in Asakusa, Tokyo" as string | undefined,
    imagePosition: "50% 62%" as string | undefined,
  },
  {
    slug: "parenting-and-family",
    title: "Parenting & Family",
    cardTitle: "Parenting & Family",
    icon: "family",
    description: "Family experiences, activities and the real moments of raising two little ones.",
    image: undefined as string | undefined,
    imageAlt: undefined as string | undefined,
    imagePosition: undefined as string | undefined,
  },
  {
    slug: "lifestyle",
    title: "Lifestyle & Home",
    cardTitle: "Lifestyle & Home",
    icon: "sofa",
    description: "Home decor, DIY projects, furniture, storage and the everyday finds that make life easier.",
    image: undefined as string | undefined,
    imageAlt: undefined as string | undefined,
    imagePosition: undefined as string | undefined,
  },
] as const;

export type Pillar = (typeof pillars)[number];
export type PillarSlug = Pillar["slug"];

export const getPillar = (slug: string) => pillars.find((p) => p.slug === slug);

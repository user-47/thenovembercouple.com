import { site } from "@/content/site";

interface BeholdPost {
  id: string;
  permalink: string;
  mediaType?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  sizes?: { medium?: { mediaUrl?: string } };
  prunedCaption?: string;
  caption?: string;
}

/** Latest Instagram posts via a Behold.so JSON feed (set BEHOLD_FEED_ID). */
async function getPosts(): Promise<BeholdPost[]> {
  const id = process.env.BEHOLD_FEED_ID;
  if (!id) return [];
  try {
    const res = await fetch(`https://feeds.behold.so/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (Array.isArray(json) ? json : (json.posts ?? [])).slice(0, 4);
  } catch {
    return [];
  }
}

/** "From the road": the four latest posts. Renders nothing until the feed is live — never fake tiles. */
export async function InstagramSection() {
  const posts = await getPosts();
  if (posts.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-28">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-stone">On Instagram</p>
          <h2 className="display mt-4 text-4xl md:text-5xl">From the road</h2>
          <p className="mt-3 text-espresso/80">What we&rsquo;re sharing right now.</p>
        </div>
        <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="text-link shrink-0 text-sm">
          {site.instagramHandle} ↗
        </a>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
        {posts.map((p) => {
          const src = p.sizes?.medium?.mediaUrl ?? (p.mediaType === "VIDEO" ? p.thumbnailUrl : p.mediaUrl);
          return (
            <a key={p.id} href={p.permalink} target="_blank" rel="noopener noreferrer" className="group relative block aspect-[4/5] overflow-hidden bg-paper">
              {src && (
                // eslint-disable-next-line @next/next/no-img-element -- remote CDN image, size varies per post
                <img src={src} alt={(p.prunedCaption ?? p.caption ?? "Instagram post").slice(0, 120)} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              )}
            </a>
          );
        })}
      </div>
    </section>
  );
}

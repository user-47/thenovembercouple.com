import { Frame } from "@/components/brand/Frame";
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

/** Latest Instagram posts via a Behold.so JSON feed (set BEHOLD_FEED_ID). Falls back to placeholders. */
async function getPosts(): Promise<BeholdPost[]> {
  const id = process.env.BEHOLD_FEED_ID;
  if (!id) return [];
  try {
    const res = await fetch(`https://feeds.behold.so/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const json = await res.json();
    return (Array.isArray(json) ? json : (json.posts ?? [])).slice(0, 8);
  } catch {
    return [];
  }
}

const placeholders = ["東京", "京都", "大阪", "奈良", "11月", "旅", "家族", "秋"];

export async function InstagramGrid() {
  const posts = await getPosts();
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
      {posts.length > 0
        ? posts.map((p) => {
            const src = p.sizes?.medium?.mediaUrl ?? (p.mediaType === "VIDEO" ? p.thumbnailUrl : p.mediaUrl);
            return (
              <a key={p.id} href={p.permalink} target="_blank" rel="noopener noreferrer" className="group relative block aspect-[4/5] overflow-hidden bg-paper">
                {src && (
                  // eslint-disable-next-line @next/next/no-img-element -- remote CDN image, size varies per post
                  <img src={src} alt={(p.prunedCaption ?? p.caption ?? "Instagram post").slice(0, 120)} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
              </a>
            );
          })
        : placeholders.map((label, i) => (
            <a key={label} href={site.instagram} target="_blank" rel="noopener noreferrer" className="block transition-opacity hover:opacity-85">
              <Frame alt="Follow us on Instagram" label={label} seed={i} className="aspect-[4/5]" sizes="25vw" />
            </a>
          ))}
    </div>
  );
}

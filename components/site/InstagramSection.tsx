import { Icon } from "@/components/ui/Icon";
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
    return (Array.isArray(json) ? json : (json.posts ?? [])).slice(0, 6);
  } catch {
    return [];
  }
}

/**
 * "Follow along": the latest Instagram posts plus links to Instagram and YouTube.
 * Until the feed is connected (or if it fails), only the links show — never fake tiles.
 */
export async function InstagramSection() {
  const posts = await getPosts();
  return (
    <section aria-labelledby="follow-along" className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="flex flex-col gap-6 border-t border-rule pt-16 sm:flex-row sm:items-end sm:justify-between md:pt-20">
        <div>
          <p className="eyebrow text-bronze">Follow along</p>
          <h2 id="follow-along" className="display mt-4 text-4xl md:text-5xl">
            From the road
          </h2>
          <p className="mt-3 max-w-md leading-relaxed text-ink/75">The everyday moments, as they happen, on Instagram and YouTube.</p>
        </div>
        <ul className="flex flex-wrap gap-3">
          {site.socials.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm gap-2">
                <Icon name={s.icon} className="h-4 w-4" strokeWidth={1.5} />
                {s.icon === "instagram" ? site.instagramHandle : s.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      {posts.length > 0 && (
        <ul className="mt-10 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-6">
          {posts.map((p) => {
            const src = p.sizes?.medium?.mediaUrl ?? (p.mediaType === "VIDEO" ? p.thumbnailUrl : p.mediaUrl);
            const alt = (p.prunedCaption ?? p.caption ?? "Instagram post").slice(0, 120);
            return (
              <li key={p.id}>
                <a href={p.permalink} target="_blank" rel="noopener noreferrer" className="group relative block aspect-[4/5] overflow-hidden bg-paper">
                  {src && (
                    // eslint-disable-next-line @next/next/no-img-element -- remote CDN image, size varies per post
                    <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  )}
                  <span className="sr-only"> (opens Instagram in a new tab)</span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

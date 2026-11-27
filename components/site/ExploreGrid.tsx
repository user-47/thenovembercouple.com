import Link from "next/link";
import { Frame } from "@/components/brand/Frame";
import { Icon } from "@/components/ui/Icon";
import { pillars } from "@/content/pillars";

export function ExploreGrid() {
  return (
    <ul className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5">
      {pillars.map((p, i) => (
        <li key={p.slug} className="w-[68%] shrink-0 snap-start sm:w-auto">
          <Link href={`/${p.slug}`} className="group relative block overflow-hidden rounded-sm">
            <Frame src={p.image} alt={p.title} seed={i} quiet className="aspect-[4/5] transition-transform duration-700 group-hover:scale-[1.03]" sizes="(max-width: 640px) 70vw, 20vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-5 text-center text-linen">
              <Icon name={p.icon} className="h-7 w-7" strokeWidth={1.2} />
              <span className="display text-2xl leading-tight">{p.cardTitle}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

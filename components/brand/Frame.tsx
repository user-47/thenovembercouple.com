import Image from "next/image";
import { Ring } from "./Arc";

const tones = [
  "from-[#dcd3c3] to-[#cbbfa9]",
  "from-[#e2d9cb] to-[#d3c2a8]",
  "from-[#d6cdbf] to-[#bfb09a]",
  "from-[#ddd2c0] to-[#c6b293]",
];

/**
 * Photo frame. With `src` it renders the image; without, an editorial typographic
 * placeholder (local-script name + ring) so the layout looks intentional before photos land.
 */
export function Frame({
  src,
  alt,
  label,
  sublabel,
  seed = 0,
  className = "",
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
}: {
  src?: string;
  alt: string;
  label?: string;
  sublabel?: string;
  seed?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div
          role="img"
          aria-label={alt}
          className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br ${tones[seed % tones.length]}`}
        >
          <Ring className="absolute opacity-60" size={260} />
          {label && (
            <span
              className={`display relative max-w-[70%] text-center text-espresso/80 ${
                label.length > 7 ? "text-3xl leading-snug sm:text-4xl" : label.length > 4 ? "text-4xl sm:text-5xl" : "text-5xl sm:text-6xl"
              }`}
            >
              {label}
            </span>
          )}
          {sublabel && <span className="eyebrow relative mt-4 text-espresso/70">{sublabel}</span>}
        </div>
      )}
    </div>
  );
}

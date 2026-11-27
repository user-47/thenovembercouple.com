import Image from "next/image";
import { Icon } from "@/components/ui/Icon";

const tones = [
  "from-[#e6dccd] to-[#d3c2ab]",
  "from-[#e2d6c5] to-[#cdb99d]",
  "from-[#ddd0bd] to-[#c7b195]",
  "from-[#e8dfd2] to-[#d6c6b0]",
];

/**
 * Photo frame. Shows the real photo when `src` is set; until then, a clearly labelled
 * placeholder describing the shot that belongs here.
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
  quiet = false,
}: {
  src?: string;
  alt: string;
  /** What photo belongs here, e.g. "Japan — hero". */
  label?: string;
  sublabel?: string;
  seed?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Hide the caption, for small frames or ones overlaid with their own text. */
  quiet?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div role="img" aria-label={`Photo placeholder: ${alt}`} className={`absolute inset-0 bg-gradient-to-br ${tones[seed % tones.length]}`}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink/45">
            <Icon name="image" className="h-7 w-7" strokeWidth={1.1} />
            {!quiet && (
              <>
                <span className="eyebrow text-[0.58rem]">Photo placeholder</span>
                {label && <span className="max-w-[80%] text-balance text-center text-xs text-ink/55">{label}</span>}
                {sublabel && <span className="text-[0.7rem] text-ink/45">{sublabel}</span>}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

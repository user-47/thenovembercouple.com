import Image from "next/image";

/**
 * The TNC emblem. Pure-vector files in /public/brand (lettering converted to outlines),
 * so it renders crisply at any size without depending on web fonts.
 */
export function Emblem({
  size,
  tone = "dark",
  variant = "full",
  className = "",
  priority = false,
}: {
  size: number;
  tone?: "dark" | "light";
  variant?: "full" | "compact";
  className?: string;
  priority?: boolean;
}) {
  const src = variant === "compact" ? "/brand/tnc-icon.svg" : tone === "light" ? "/brand/tnc-emblem-light.svg" : "/brand/tnc-emblem.svg";
  return <Image src={src} alt="The November Couple" width={size} height={size} unoptimized priority={priority} className={className} />;
}

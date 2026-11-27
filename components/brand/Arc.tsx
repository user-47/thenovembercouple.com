import { useId } from "react";

/** The hand-drawn bronze arc from the logo, as a reusable divider / frame. */
export function Arc({
  className = "",
  flip = false,
  width = 220,
}: {
  className?: string;
  flip?: boolean;
  width?: number;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      aria-hidden
      viewBox="0 0 220 24"
      width={width}
      height={(width / 220) * 24}
      className={className}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <defs>
        <linearGradient id={`arc-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--espresso)" stopOpacity="0" />
          <stop offset="0.25" stopColor="var(--espresso)" />
          <stop offset="0.7" stopColor="var(--bronze)" />
          <stop offset="1" stopColor="var(--bronze-light)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M4 22 Q110 -6 216 22" fill="none" stroke={`url(#arc-${id})`} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** A full circle of broken arcs — the logo's ring, used to frame text or as a loader. */
export function Ring({ className = "", size = 320, oval = false }: { className?: string; size?: number; oval?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      preserveAspectRatio={oval ? "none" : undefined}
    >
      <defs>
        <linearGradient id={`ring-${id}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--espresso)" />
          <stop offset="1" stopColor="var(--bronze-light)" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#ring-${id})`} strokeLinecap="round">
        <path d="M58 22 A92 92 0 0 1 142 22" strokeWidth="1.3" />
        <path d="M60 180 A92 92 0 0 0 140 180" strokeWidth="1.6" />
        <path d="M10 88 A92 92 0 0 0 10 112" strokeWidth="1.1" />
        <path d="M190 88 A92 92 0 0 1 190 112" strokeWidth="1.1" />
      </g>
    </svg>
  );
}

const paths = {
  plane: (
    <path d="M3.5 13.5 10 11l-3.5-6.5 2-.75L14 9.5l4.6-1.75a1.9 1.9 0 0 1 1.4 3.53L6.3 16.5l-2.8-1.1Zm2.5 7h12" />
  ),
  home: (
    <>
      <path d="M3.5 11 12 4l8.5 7" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M10 20v-5.5h4V20" />
    </>
  ),
  dining: (
    <>
      <path d="M7 3v18M4.5 3v4.5a2.5 2.5 0 0 0 5 0V3" />
      <path d="M17 21V3c-1.9 1.3-3 4-3 7.5 0 1.6.9 2.5 3 2.5" />
    </>
  ),
  family: (
    <>
      <circle cx="7.5" cy="6.5" r="2.25" />
      <circle cx="16.5" cy="6.5" r="2.25" />
      <circle cx="12" cy="12.75" r="1.75" />
      <path d="M3.5 20v-5a4 4 0 0 1 6.4-3.2M20.5 20v-5a4 4 0 0 0-6.4-3.2M9 20v-1.5a3 3 0 0 1 6 0V20" />
    </>
  ),
  sofa: (
    <>
      <path d="M5 11V8.5A2.5 2.5 0 0 1 7.5 6h9A2.5 2.5 0 0 1 19 8.5V11" />
      <path d="M3 13a2 2 0 0 1 4 0v1.5h10V13a2 2 0 0 1 4 0v5H3Z" />
      <path d="M5.5 18v2M18.5 18v2" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.75" />
      <circle cx="17.25" cy="6.75" r="0.6" fill="currentColor" />
    </>
  ),
  arrow: <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
  image: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="1.5" />
      <circle cx="9" cy="10" r="1.75" />
      <path d="m3.5 17 5-4.5 4 3.5 3-2.5 5 4" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className = "h-5 w-5", strokeWidth = 1.3 }: { name: IconName; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      {paths[name]}
    </svg>
  );
}

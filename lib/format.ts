export function fmtInstant(d: Date, timeZone: string, opts: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat("en-US", { timeZone, ...opts }).format(d);
}

export const fmtTime = (d: Date, timeZone: string) =>
  fmtInstant(d, timeZone, { hour: "numeric", minute: "2-digit" });

export const fmtDateTime = (d: Date, timeZone: string) =>
  fmtInstant(d, timeZone, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export function localTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export function shortTzName(timeZone: string, at: Date = new Date()): string {
  try {
    const part = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" })
      .formatToParts(at)
      .find((p) => p.type === "timeZoneName");
    return part?.value ?? timeZone;
  } catch {
    return timeZone;
  }
}

export function countdown(target: Date, now: Date): string {
  const ms = target.getTime() - now.getTime();
  const abs = Math.abs(ms);
  const m = Math.round(abs / 60_000);
  const h = Math.round(abs / 3_600_000);
  const d = Math.round(abs / 86_400_000);
  const v = m < 60 ? `${m} min` : h < 48 ? `${h} hours` : `${d} days`;
  return ms >= 0 ? `in ${v}` : `${v} ago`;
}

export function price(n: number | null | undefined, symbol: string): string | null {
  if (n === null || n === undefined) return null;
  if (n === 0) return "Free";
  return `from ${symbol}${n.toLocaleString("en-US")}`;
}

export function durationLabel(h?: number): string | null {
  if (!h) return null;
  if (h >= 8) return "Full day";
  if (h >= 4.5) return "Half day+";
  return `${h % 1 === 0 ? h : h.toFixed(1)} hr${h > 1 ? "s" : ""}`;
}

/** Pure calendar-date helpers on YYYY-MM-DD strings (no timezone drift). */

export function parseYmd(ymd: string): { y: number; m: number; d: number } {
  const [y, m, d] = ymd.split("-").map(Number);
  return { y, m, d };
}

export function toYmd(y: number, m: number, d: number): string {
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toISOString().slice(0, 10);
}

export function addDays(ymd: string, days: number): string {
  const { y, m, d } = parseYmd(ymd);
  return toYmd(y, m, d + days);
}

/** Add calendar months, clamping the day to the target month's length. */
export function addMonths(ymd: string, months: number): string {
  const { y, m, d } = parseYmd(ymd);
  const target = new Date(Date.UTC(y, m - 1 + months, 1));
  const ty = target.getUTCFullYear();
  const tm = target.getUTCMonth() + 1;
  const last = new Date(Date.UTC(ty, tm, 0)).getUTCDate();
  return toYmd(ty, tm, Math.min(d, last));
}

export function firstOfMonth(ymd: string): string {
  const { y, m } = parseYmd(ymd);
  return toYmd(y, m, 1);
}

export function lastOfMonth(ymd: string): string {
  const { y, m } = parseYmd(ymd);
  return toYmd(y, m + 1, 0);
}

export function diffDays(a: string, b: string): number {
  const pa = parseYmd(a);
  const pb = parseYmd(b);
  return Math.round((Date.UTC(pa.y, pa.m - 1, pa.d) - Date.UTC(pb.y, pb.m - 1, pb.d)) / 86_400_000);
}

export function eachDay(start: string, end: string): string[] {
  const out: string[] = [];
  const n = diffDays(end, start);
  for (let i = 0; i <= n && i < 120; i++) out.push(addDays(start, i));
  return out;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Wed Nov 25" — formatted from the calendar date itself, not a timezone. */
export function formatYmd(ymd: string, opts: { weekday?: boolean; year?: boolean } = {}): string {
  const { y, m, d } = parseYmd(ymd);
  const wd = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${opts.weekday === false ? "" : wd + " "}${MONTHS[m - 1]} ${d}${opts.year ? `, ${y}` : ""}`;
}

export function monthShort(ymd: string): string {
  return MONTHS[parseYmd(ymd).m - 1];
}

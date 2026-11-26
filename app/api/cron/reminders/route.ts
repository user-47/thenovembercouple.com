import { NextResponse } from "next/server";
import { ReminderEmail } from "@/emails/templates";
import { getBookingWindow } from "@/lib/booking-rules";
import { formatYmd } from "@/lib/dates";
import { getDestination } from "@/lib/destinations";
import { sendEmail, siteUrl } from "@/lib/server/email";
import { db } from "@/lib/server/supabase";
import { whenText } from "@/lib/server/trips";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Reminders more than this late are skipped rather than sent ("opens in 1 hour" is useless 5 hours later). */
const STALE_MS = 3 * 3_600_000;

interface DueRow {
  id: number;
  activity_slug: string;
  visit_date: string;
  label: string;
  send_at: string;
  trips: {
    destination_slug: string;
    share_token: string;
    timezone: string | null;
    subscribers: { email: string; confirmed: boolean; unsubscribed_at: string | null; unsubscribe_token: string };
  };
}

/**
 * Sends due reminder emails. Call every 10–15 minutes with
 * `Authorization: Bearer $CRON_SECRET` (Vercel Cron does this automatically).
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = db();
  if (!supabase) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const now = new Date();
  const { data, error } = await supabase
    .from("reminders")
    .select(
      "id, activity_slug, visit_date, label, send_at, trips!inner(destination_slug, share_token, timezone, subscribers!inner(email, confirmed, unsubscribed_at, unsubscribe_token))",
    )
    .is("sent_at", null)
    .lte("send_at", now.toISOString())
    .order("send_at")
    .limit(200);
  if (error) {
    console.error("[cron/reminders]", error);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  const base = siteUrl();
  let sent = 0;
  let skipped = 0;
  for (const r of (data ?? []) as unknown as DueRow[]) {
    const sub = r.trips.subscribers;
    const bundle = getDestination(r.trips.destination_slug);
    const activity = bundle?.activities.find((a) => a.slug === r.activity_slug);
    const stale = now.getTime() - new Date(r.send_at).getTime() > STALE_MS;

    // Unconfirmed: leave pending (they may confirm later) unless it's gone stale.
    if (!sub.confirmed && !stale) continue;

    let ok = false;
    if (sub.confirmed && !sub.unsubscribed_at && !stale && bundle && activity) {
      const w = getBookingWindow(activity.booking.rule, r.visit_date, bundle.destination.timezone, now);
      const bookIdx = Math.max(0, activity.booking.links.findIndex((l) => l.kind === "official"));
      const unsubscribeUrl = `${base}/api/unsubscribe?token=${sub.unsubscribe_token}`;
      ok = await sendEmail({
        to: sub.email,
        subject: `${r.label}: ${activity.name}`,
        react: ReminderEmail({
          siteUrl: base,
          label: r.label,
          activityName: activity.name,
          whenText: whenText(w, bundle, r.trips.timezone),
          visitText: formatYmd(r.visit_date, { year: true }),
          howTo: activity.booking.howTo,
          bookUrl: activity.booking.links.length ? `${base}/go/${bundle.destination.slug}/${activity.slug}/${bookIdx}` : `${base}/trips/${bundle.destination.slug}/${activity.slug}`,
          tripUrl: `${base}/trips/${bundle.destination.slug}/planner?trip=${r.trips.share_token}`,
          unsubscribeUrl,
        }),
        headers: { "List-Unsubscribe": `<${unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
      });
    }
    await supabase
      .from("reminders")
      .update({ sent_at: now.toISOString(), skipped: !ok })
      .eq("id", r.id);
    if (ok) sent++;
    else skipped++;
  }

  return NextResponse.json({ sent, skipped });
}

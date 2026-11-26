import { NextResponse } from "next/server";
import { z } from "zod";
import { ConfirmEmail, TripSavedEmail } from "@/emails/templates";
import { getDestination } from "@/lib/destinations";
import { isoDate } from "@/lib/schema";
import { sendEmail, siteUrl } from "@/lib/server/email";
import { db } from "@/lib/server/supabase";
import { planReminders, whenText } from "@/lib/server/trips";

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  newsletter: z.boolean().default(false),
  website: z.string().nullish(), // honeypot
  destination: z.string().max(60),
  startDate: isoDate.nullable(),
  endDate: isoDate.nullable(),
  items: z.array(z.object({ slug: z.string().max(80), date: isoDate.nullable() })).max(120),
  timezone: z.string().max(64).optional(),
  token: z.string().max(80).optional(),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check your email address and try again." }, { status: 400 });
  const body = parsed.data;
  if (body.website) return NextResponse.json({ token: "ok", confirmed: false }); // bot

  const bundle = getDestination(body.destination);
  if (!bundle) return NextResponse.json({ error: "Unknown destination." }, { status: 400 });
  const items = body.items.filter((i) => bundle.activities.some((a) => a.slug === i.slug));

  const supabase = db();
  if (!supabase) {
    return NextResponse.json(
      { error: "Saving isn't switched on yet — your plan is stored on this device, and the calendar download works now." },
      { status: 503 },
    );
  }

  // 1 · Subscriber
  let { data: sub } = await supabase.from("subscribers").select("*").eq("email", body.email).maybeSingle();
  if (!sub) {
    const ins = await supabase.from("subscribers").insert({ email: body.email, newsletter_opt_in: body.newsletter }).select().single();
    if (ins.error) return fail(ins.error);
    sub = ins.data;
  } else if (body.newsletter || sub.unsubscribed_at) {
    const upd = await supabase
      .from("subscribers")
      .update({ newsletter_opt_in: sub.newsletter_opt_in || body.newsletter, unsubscribed_at: null })
      .eq("id", sub.id)
      .select()
      .single();
    if (upd.error) return fail(upd.error);
    sub = upd.data;
  }

  // 2 · Trip (update when the token belongs to this subscriber, otherwise create)
  const tripFields = {
    subscriber_id: sub.id,
    destination_slug: bundle.destination.slug,
    start_date: body.startDate,
    end_date: body.endDate,
    timezone: body.timezone ?? null,
    updated_at: new Date().toISOString(),
  };
  let trip: { id: string; share_token: string } | null = null;
  if (body.token) {
    const { data } = await supabase
      .from("trips")
      .update(tripFields)
      .eq("share_token", body.token)
      .eq("subscriber_id", sub.id)
      .select("id, share_token")
      .maybeSingle();
    trip = data;
  }
  if (!trip) {
    const ins = await supabase.from("trips").insert(tripFields).select("id, share_token").single();
    if (ins.error) return fail(ins.error);
    trip = ins.data;
  }

  // 3 · Items + reminders (replace)
  const { rows, summary } = planReminders(bundle, items);
  await supabase.from("trip_items").delete().eq("trip_id", trip.id);
  await supabase.from("reminders").delete().eq("trip_id", trip.id).is("sent_at", null);
  if (items.length) {
    const r = await supabase.from("trip_items").insert(items.map((i) => ({ trip_id: trip!.id, activity_slug: i.slug, visit_date: i.date })));
    if (r.error) return fail(r.error);
  }
  if (rows.length) {
    const r = await supabase.from("reminders").insert(rows.map((x) => ({ ...x, trip_id: trip!.id })));
    if (r.error) return fail(r.error);
  }

  // 4 · Email
  const base = siteUrl();
  const tripUrl = `${base}/trips/${bundle.destination.slug}/planner?trip=${trip.share_token}`;
  if (sub.confirmed) {
    await sendEmail({
      to: sub.email,
      subject: `Your ${bundle.destination.name} trip is saved`,
      react: TripSavedEmail({
        siteUrl: base,
        tripUrl,
        destinationName: bundle.destination.name,
        rows: summary.map((s) => ({ name: s.name, when: whenText(s.window, bundle, body.timezone) })),
        unsubscribeUrl: `${base}/api/unsubscribe?token=${sub.unsubscribe_token}`,
      }),
    });
  } else {
    const confirmUrl = `${base}/api/confirm?token=${sub.confirm_token}&trip=${trip.share_token}&d=${bundle.destination.slug}`;
    await sendEmail({ to: sub.email, subject: "Confirm your email to switch on reminders", react: ConfirmEmail({ siteUrl: base, confirmUrl, kind: "trip" }) });
  }

  return NextResponse.json({ token: trip.share_token, confirmed: Boolean(sub.confirmed) });
}

function fail(error: unknown) {
  console.error("[trip/save]", error);
  return NextResponse.json({ error: "We couldn't save your trip just now. Please try again in a moment." }, { status: 500 });
}

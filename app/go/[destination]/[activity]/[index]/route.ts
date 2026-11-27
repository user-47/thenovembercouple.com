import { after, NextResponse } from "next/server";
import { track } from "@vercel/analytics/server";
import { withAffiliate } from "@/lib/affiliates";
import { getActivity } from "@/lib/destinations";
import { db } from "@/lib/server/supabase";

/** Tracked outbound link: logs the click, appends affiliate IDs, redirects. */
export async function GET(_req: Request, { params }: { params: Promise<{ destination: string; activity: string; index: string }> }) {
  const p = await params;
  const r = getActivity(p.destination, p.activity);
  const link = r?.activity.booking.links[Number(p.index)];
  if (!r || !link) return NextResponse.redirect(new URL(`/trips/${p.destination}`, _req.url));

  const target = link.kind === "affiliate" ? withAffiliate(link.url, link.partner) : link.url;

  after(async () => {
    await track("outbound_click", {
      destination: r.destination.slug,
      activity: r.activity.slug,
      kind: link.kind,
      partner: link.partner ?? null,
    }).catch(() => {});
    const supabase = db();
    if (!supabase) return;
    await supabase.from("affiliate_clicks").insert({
      destination_slug: r.destination.slug,
      activity_slug: r.activity.slug,
      partner: link.partner ?? null,
      kind: link.kind,
      url: link.url,
    });
  });

  return NextResponse.redirect(target, { status: 302, headers: { "x-robots-tag": "noindex" } });
}

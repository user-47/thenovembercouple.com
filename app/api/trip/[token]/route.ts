import { NextResponse } from "next/server";
import { db } from "@/lib/server/supabase";

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = db();
  if (!supabase || !/^[a-f0-9]{16,80}$/.test(token)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: trip } = await supabase
    .from("trips")
    .select("id, destination_slug, start_date, end_date, trip_items(activity_slug, visit_date)")
    .eq("share_token", token)
    .maybeSingle();
  if (!trip) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(
    {
      destination: trip.destination_slug,
      startDate: trip.start_date,
      endDate: trip.end_date,
      items: (trip.trip_items ?? []).map((i: { activity_slug: string; visit_date: string | null }) => ({ slug: i.activity_slug, date: i.visit_date })),
    },
    { headers: { "cache-control": "no-store" } },
  );
}

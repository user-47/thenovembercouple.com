import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/server/email";
import { db } from "@/lib/server/supabase";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const trip = url.searchParams.get("trip");
  const dest = url.searchParams.get("d");
  const base = siteUrl();
  const supabase = db();
  if (!supabase || !/^[a-f0-9]{16,80}$/.test(token)) return NextResponse.redirect(`${base}/subscribed?status=invalid`);

  const { data } = await supabase
    .from("subscribers")
    .update({ confirmed: true, confirmed_at: new Date().toISOString() })
    .eq("confirm_token", token)
    .select("id")
    .maybeSingle();
  if (!data) return NextResponse.redirect(`${base}/subscribed?status=invalid`);

  if (trip && dest && /^[a-z0-9-]+$/.test(dest) && /^[a-f0-9]{16,80}$/.test(trip)) {
    return NextResponse.redirect(`${base}/trips/${dest}/planner?trip=${trip}`);
  }
  return NextResponse.redirect(`${base}/subscribed`);
}

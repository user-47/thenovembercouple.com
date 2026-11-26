import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/server/email";
import { db } from "@/lib/server/supabase";

async function unsubscribe(token: string | null) {
  const supabase = db();
  if (!supabase || !token || !/^[a-f0-9]{16,80}$/.test(token)) return false;
  const { data } = await supabase
    .from("subscribers")
    .update({ unsubscribed_at: new Date().toISOString(), newsletter_opt_in: false })
    .eq("unsubscribe_token", token)
    .select("id")
    .maybeSingle();
  return Boolean(data);
}

export async function GET(req: Request) {
  const ok = await unsubscribe(new URL(req.url).searchParams.get("token"));
  return NextResponse.redirect(`${siteUrl()}/subscribed?status=${ok ? "unsubscribed" : "invalid"}`);
}

/** RFC 8058 one-click unsubscribe (List-Unsubscribe-Post). */
export async function POST(req: Request) {
  const ok = await unsubscribe(new URL(req.url).searchParams.get("token"));
  return NextResponse.json({ ok }, { status: ok ? 200 : 400 });
}

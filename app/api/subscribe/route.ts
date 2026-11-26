import { NextResponse } from "next/server";
import { z } from "zod";
import { ConfirmEmail } from "@/emails/templates";
import { sendEmail, siteUrl } from "@/lib/server/email";
import { db } from "@/lib/server/supabase";

const schema = z.object({ email: z.string().trim().toLowerCase().email().max(254), website: z.string().nullish() });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const supabase = db();
  if (!supabase) return NextResponse.json({ error: "Sign-ups open soon — follow us on Instagram in the meantime." }, { status: 503 });

  const { email } = parsed.data;
  const { data: existing } = await supabase.from("subscribers").select("*").eq("email", email).maybeSingle();
  const res = existing
    ? await supabase.from("subscribers").update({ newsletter_opt_in: true, unsubscribed_at: null }).eq("id", existing.id).select().single()
    : await supabase.from("subscribers").insert({ email, newsletter_opt_in: true }).select().single();
  if (res.error) {
    console.error("[subscribe]", res.error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  if (!res.data.confirmed) {
    const base = siteUrl();
    await sendEmail({
      to: email,
      subject: "Confirm your subscription",
      react: ConfirmEmail({ siteUrl: base, confirmUrl: `${base}/api/confirm?token=${res.data.confirm_token}`, kind: "newsletter" }),
    });
  }
  return NextResponse.json({ ok: true });
}

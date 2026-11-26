import { NextResponse } from "next/server";
import { z } from "zod";
import { InquiryAutoReply, InquiryNotification } from "@/emails/templates";
import { site } from "@/content/site";
import { emailConfigured, sendEmail, siteUrl } from "@/lib/server/email";
import { db } from "@/lib/server/supabase";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  company: z.string().trim().min(1).max(160),
  website: z.string().trim().max(300).optional().or(z.literal("")),
  budget: z.string().max(60).optional(),
  timeline: z.string().max(60).optional(),
  deliverables: z.array(z.string().max(60)).max(12).default([]),
  message: z.string().trim().min(10).max(5000),
  hp: z.string().nullish(), // honeypot
  turnstileToken: z.string().nullish(),
});

async function verifyTurnstile(token: string | null | undefined, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
  }).catch(() => null);
  const json = await res?.json().catch(() => null);
  return Boolean(json?.success);
}

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please complete the required fields." }, { status: 400 });
  const f = parsed.data;
  if (f.hp) return NextResponse.json({ ok: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  if (!(await verifyTurnstile(f.turnstileToken, ip))) {
    return NextResponse.json({ error: "Please complete the verification and try again." }, { status: 400 });
  }

  const supabase = db();
  if (!supabase && !emailConfigured()) {
    return NextResponse.json({ error: `Our form is being set up — please email us at ${site.contactEmail}.` }, { status: 503 });
  }

  const record = {
    name: f.name,
    email: f.email,
    company: f.company,
    website: f.website || null,
    budget: f.budget || null,
    timeline: f.timeline || null,
    deliverables: f.deliverables,
    message: f.message,
  };
  if (supabase) {
    const { error } = await supabase.from("brand_inquiries").insert(record);
    if (error) console.error("[inquiry]", error);
  }

  const base = siteUrl();
  await sendEmail({
    to: process.env.INQUIRY_TO_EMAIL ?? site.contactEmail,
    subject: `Brand inquiry — ${f.company}`,
    replyTo: f.email,
    react: InquiryNotification({ siteUrl: base, ...f, website: f.website || undefined }),
  });
  await sendEmail({ to: f.email, subject: "Thank you — The November Couple", react: InquiryAutoReply({ siteUrl: base, name: f.name }) });

  return NextResponse.json({ ok: true });
}

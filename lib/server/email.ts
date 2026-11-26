import "server-only";
import type { ReactElement } from "react";
import { Resend } from "resend";

let resend: Resend | null = null;

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  react: ReactElement;
  replyTo?: string;
  headers?: Record<string, string>;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[email:dev] would send "${opts.subject}" to ${opts.to}`);
    return false;
  }
  resend ??= new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? "The November Couple <hello@thenovembercouple.com>",
    to: opts.to,
    subject: opts.subject,
    react: opts.react,
    replyTo: opts.replyTo,
    headers: opts.headers,
  });
  if (error) {
    console.error("[email] send failed", error);
    return false;
  }
  return true;
}

export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

import type { Metadata } from "next";
import Link from "next/link";
import { Arc } from "@/components/brand/Arc";

export const metadata: Metadata = { title: "Subscription", robots: { index: false } };

const copy = {
  ok: ["You're in.", "Thank you for confirming — our next letter will find you."],
  unsubscribed: ["You've been unsubscribed.", "We're sorry to see you go. You won't receive any more emails from us."],
  invalid: ["That link has expired.", "It may have been used already. If you need help, just reply to any of our emails."],
} as const;

export default async function SubscribedPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const status = (await searchParams).status;
  const [title, body] = copy[status === "unsubscribed" || status === "invalid" ? status : "ok"];
  return (
    <div className="mx-auto max-w-xl px-5 pt-24 text-center sm:pt-32">
      <h1 className="display text-5xl sm:text-6xl">{title}</h1>
      <Arc className="mx-auto mt-8" width={160} />
      <p className="mt-8 text-lg text-espresso/85">{body}</p>
      <Link href="/trips" className="btn btn-primary mt-10">
        Explore our trips
      </Link>
    </div>
  );
}

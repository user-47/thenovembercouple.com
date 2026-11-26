"use client";

import { useState } from "react";
import { localTimeZone } from "@/lib/format";
import { useTripStore, type Trip } from "@/lib/trip-store";

export function SaveTrip({ destination, trip }: { destination: string; trip: Trip }) {
  const markSaved = useTripStore((s) => s.markSaved);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") ?? "");
    setState("loading");
    const res = await fetch("/api/trip/save", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email,
        newsletter: f.get("newsletter") === "on",
        website: f.get("website"),
        destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        items: trip.items,
        timezone: localTimeZone(),
        token: trip.token,
      }),
    }).catch(() => null);
    const json = await res?.json().catch(() => null);
    if (res?.ok && json?.token) {
      markSaved(destination, json.token, email);
      setState("done");
      setMessage(
        json.confirmed
          ? "Saved. We've emailed you a link to your trip, and reminders are on."
          : "Nearly done — confirm your email (check your inbox) to switch on reminders.",
      );
    } else {
      setState("error");
      setMessage(json?.error ?? "We couldn't save your trip just now. Your plan is still stored on this device.");
    }
  }

  const saved = Boolean(trip.token && trip.savedAt);

  return (
    <div className="border border-rule bg-paper p-7">
      <p className="eyebrow text-stone">Email reminders</p>
      <p className="display mt-3 text-3xl">Save your trip</p>
      <p className="mt-3 text-sm leading-relaxed text-espresso/80">
        We&rsquo;ll email you the day before and an hour before each ticket release, plus a private link to open your plan on
        any device.
      </p>

      {state === "done" || saved ? (
        <p className="mt-5 text-sm text-ok" role="status">
          {message || `Saved to ${trip.email}. Changes? Press save again any time.`}
        </p>
      ) : null}

      {(state !== "done" || !saved) && (
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <label className="block">
            <span className="sr-only">Email</span>
            <input name="email" type="email" required placeholder="Your email" defaultValue={trip.email} className="field" />
          </label>
          <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          <label className="flex items-start gap-3 text-xs leading-relaxed text-espresso/80">
            <input type="checkbox" name="newsletter" className="mt-0.5 accent-[var(--espresso)]" />
            Also send me The November Couple&rsquo;s occasional letters with new trip planners.
          </label>
          <button className="btn btn-primary w-full" disabled={state === "loading" || trip.items.length === 0}>
            {state === "loading" ? "Saving…" : saved ? "Update saved trip" : "Save & remind me"}
          </button>
          <p className="text-[0.7rem] leading-relaxed text-stone">
            Reminder emails only — unsubscribe in one click. See our <a href="/privacy" className="underline">privacy policy</a>.
          </p>
          {state === "error" && (
            <p className="text-xs text-alert" role="alert">
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

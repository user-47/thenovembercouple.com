"use client";

import Script from "next/script";
import { useState } from "react";

const BUDGETS = ["Under $1k", "$1k – $3k", "$3k – $7.5k", "$7.5k – $15k", "$15k+", "Gifted / to discuss"];
const TIMELINES = ["ASAP", "Within 1 month", "1–3 months", "3+ months"];
const DELIVERABLES = ["Reels", "Stories", "Static posts", "UGC", "Hotel / destination stay", "Trip planner feature", "Long-term ambassador"];

export function InquiryForm() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setState("loading");
    const res = await fetch("/api/inquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: f.get("name"),
        email: f.get("email"),
        company: f.get("company"),
        website: f.get("website"),
        budget: f.get("budget") || undefined,
        timeline: f.get("timeline") || undefined,
        deliverables: f.getAll("deliverables"),
        message: f.get("message"),
        hp: f.get("hp"),
        turnstileToken: f.get("cf-turnstile-response"),
      }),
    }).catch(() => null);
    const json = await res?.json().catch(() => null);
    if (res?.ok) setState("done");
    else {
      setState("error");
      setError(json?.error ?? "Something went wrong — please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="py-16 text-center" role="status">
        <p className="display text-4xl">Thank you.</p>
        <p className="mt-4 text-espresso/80">We&rsquo;ve received your note and will reply within a few working days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-8 sm:grid-cols-2">
      {siteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}
      <Field label="Your name" name="name" required />
      <Field label="Email" name="email" type="email" required />
      <Field label="Brand / company" name="company" required />
      <Field label="Website" name="website" placeholder="https://" />
      <label className="block">
        <span className="eyebrow text-[0.62rem] text-stone">Budget</span>
        <select name="budget" className="field" defaultValue="">
          <option value="">Select…</option>
          {BUDGETS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="eyebrow text-[0.62rem] text-stone">Timeline</span>
        <select name="timeline" className="field" defaultValue="">
          <option value="">Select…</option>
          {TIMELINES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <fieldset className="sm:col-span-2">
        <legend className="eyebrow text-[0.62rem] text-stone">Interested in</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {DELIVERABLES.map((d) => (
            <label key={d} className="cursor-pointer">
              <input type="checkbox" name="deliverables" value={d} className="peer sr-only" />
              <span className="inline-block border border-rule px-4 py-2 text-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-bronze">
                {d}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block sm:col-span-2">
        <span className="eyebrow text-[0.62rem] text-stone">Tell us about the collaboration</span>
        <textarea name="message" required minLength={10} rows={5} className="field resize-y" />
      </label>
      <input name="hp" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {siteKey && <div className="cf-turnstile sm:col-span-2" data-sitekey={siteKey} data-theme="light" />}
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <button className="btn btn-primary" disabled={state === "loading"}>
          {state === "loading" ? "Sending…" : "Send inquiry"}
        </button>
        {state === "error" && (
          <p className="text-sm text-alert" role="alert">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="eyebrow text-[0.62rem] text-stone">
        {label}
        {required && " *"}
      </span>
      <input name={name} type={type} required={required} placeholder={placeholder} className="field" />
    </label>
  );
}

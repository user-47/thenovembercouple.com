"use client";

import { useState } from "react";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState("loading");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), website: form.get("website") }),
    }).catch(() => null);
    const json = await res?.json().catch(() => null);
    if (res?.ok) {
      setState("done");
      setMessage("Almost there — check your inbox to confirm.");
    } else {
      setState("error");
      setMessage(json?.error ?? "Something went wrong. Please try again.");
    }
  }

  if (state === "done") return <p className={`mt-6 text-sm ${dark ? "text-bronze-light" : "text-espresso"}`}>{message}</p>;

  return (
    <>
    <form onSubmit={onSubmit} className="mt-6 flex gap-3">
      <label className="sr-only" htmlFor={`nl-email-${dark ? "d" : "l"}`}>
        Email
      </label>
      <input
        id={`nl-email-${dark ? "d" : "l"}`}
        name="email"
        type="email"
        required
        placeholder="Your email"
        className={`field ${dark ? "border-paper/30 text-paper placeholder:text-paper/70 focus:border-paper" : ""}`}
      />
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button className={`btn btn-sm ${dark ? "border-paper bg-paper text-ink hover:bg-bronze-light" : "btn-primary"}`} disabled={state === "loading"}>
        {state === "loading" ? "…" : "Join"}
      </button>
    </form>
    {state === "error" && (
      <p role="alert" className={`mt-3 text-xs ${dark ? "text-bronze-light" : "text-alert"}`}>
        {message}
      </p>
    )}
    </>
  );
}

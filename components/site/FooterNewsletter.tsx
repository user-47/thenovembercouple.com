"use client";

import { usePathname } from "next/navigation";
import { NewsletterForm } from "./NewsletterForm";

/** The homepage has its own sign-up section, so the footer form steps aside there. */
export function FooterNewsletter() {
  const onHome = usePathname() === "/";
  return (
    <>
      <p className="eyebrow text-bronze-light">Letters from the road</p>
      <p className="mt-4 text-sm leading-relaxed text-paper/75">
        Occasional notes from wherever we are — new trip planners, booking dates and the places worth the detour.
      </p>
      {!onHome && <NewsletterForm dark />}
    </>
  );
}

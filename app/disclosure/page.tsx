import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/Prose";

export const metadata: Metadata = { title: "Affiliate disclosure" };

export default function DisclosurePage() {
  return (
    <LegalPage title="Affiliate disclosure" updated="November 14, 2026">
      <p>
        Some links on this site are affiliate links — for example to Klook, GetYourGuide or Viator. If you book through them, we may earn a
        small commission <strong>at no extra cost to you</strong>. It helps us keep the trip planners free.
      </p>
      <p>
        We only recommend things we&rsquo;ve booked, would book, or genuinely think are worth it. Where a ticket is only sold by the official
        venue (like the Ghibli Museum or Pokémon Café), we link straight to the official site — and we always show the official option where
        one exists.
      </p>
      <p>Sponsored content and brand partnerships are always clearly labelled, on this site and on our social channels.</p>
    </LegalPage>
  );
}

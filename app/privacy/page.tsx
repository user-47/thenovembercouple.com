import type { Metadata } from "next";
import { LegalPage } from "@/components/ui/Prose";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Privacy policy" };

// Template — have this reviewed for your jurisdiction (e.g. GDPR / UK GDPR / CCPA) before launch.
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="November 14, 2026">
      <p>
        This policy explains what information The November Couple (&ldquo;we&rdquo;) collects through thenovembercouple.com and how we use
        it. We keep it simple: we collect as little as possible and never sell your data.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Trip planner (no account):</strong> your dates and chosen activities are stored only in your browser until you choose to
          save them.
        </li>
        <li>
          <strong>Saved trips &amp; reminders:</strong> if you save a trip, we store your email address, your trip dates, chosen activities and
          your time zone so we can send booking reminders and a private link to your plan.
        </li>
        <li>
          <strong>Newsletter:</strong> your email address, only if you opt in and confirm.
        </li>
        <li>
          <strong>Brand inquiries:</strong> the details you submit in the partnership form.
        </li>
        <li>
          <strong>Analytics:</strong> privacy-friendly, aggregated page analytics (no advertising cookies) and anonymous counts of clicks on
          booking links.
        </li>
      </ul>
      <h2>How we use it</h2>
      <p>
        To send the reminders and emails you asked for, to reply to inquiries, and to understand which guides are useful. Reminder emails are
        sent only after you confirm your address, and every email has a one-click unsubscribe.
      </p>
      <h2>Who processes it</h2>
      <p>
        We use trusted providers to run the site: Vercel (hosting and analytics), Supabase (database), Resend (email delivery) and, where
        enabled, Cloudflare Turnstile (spam protection). When you follow a booking link you leave our site and the partner&rsquo;s privacy
        policy applies.
      </p>
      <h2>Your choices</h2>
      <p>
        Unsubscribe at any time from any email. To access or delete your data, email{" "}
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> and we&rsquo;ll take care of it.
      </p>
    </LegalPage>
  );
}

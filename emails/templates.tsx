import { Section, Text } from "@react-email/components";
import { Button, H1, Layout, P, colors, serif } from "./Layout";

export function ConfirmEmail({ siteUrl, confirmUrl, kind }: { siteUrl: string; confirmUrl: string; kind: "trip" | "newsletter" }) {
  return (
    <Layout preview="Confirm your email" siteUrl={siteUrl}>
      <H1>One quick click</H1>
      <P>
        {kind === "trip"
          ? "Confirm your email to save your trip and switch on your ticket-release reminders. We'll email you the day before and an hour before each one opens."
          : "Confirm your email and we'll send you our occasional letters — new trip planners, booking dates and the places worth the detour."}
      </P>
      <Button href={confirmUrl}>Confirm my email</Button>
      <P>If you didn&rsquo;t ask for this, you can safely ignore this email.</P>
    </Layout>
  );
}

export function TripSavedEmail({
  siteUrl,
  tripUrl,
  destinationName,
  rows,
  unsubscribeUrl,
}: {
  siteUrl: string;
  tripUrl: string;
  destinationName: string;
  rows: { name: string; when: string }[];
  unsubscribeUrl: string;
}) {
  return (
    <Layout preview={`Your ${destinationName} trip is saved`} siteUrl={siteUrl} unsubscribeUrl={unsubscribeUrl}>
      <H1>Your {destinationName} trip is saved</H1>
      <P>Here&rsquo;s your private link — open it on any device to see and edit your plan.</P>
      <Button href={tripUrl}>Open my trip</Button>
      {rows.length > 0 && (
        <Section>
          <Text style={{ fontFamily: serif, fontSize: 22, margin: "8px 0", color: colors.ink }}>Your booking dates</Text>
          {rows.map((r) => (
            <Text key={r.name} style={{ fontSize: 14, lineHeight: "22px", margin: "6px 0", color: colors.espresso }}>
              <strong>{r.name}</strong> — {r.when}
            </Text>
          ))}
          <P>We&rsquo;ll remind you before each one.</P>
        </Section>
      )}
    </Layout>
  );
}

export function ReminderEmail({
  siteUrl,
  label,
  activityName,
  whenText,
  visitText,
  howTo,
  bookUrl,
  tripUrl,
  unsubscribeUrl,
}: {
  siteUrl: string;
  label: string;
  activityName: string;
  whenText: string;
  visitText: string;
  howTo?: string;
  bookUrl: string;
  tripUrl: string;
  unsubscribeUrl: string;
}) {
  return (
    <Layout preview={`${label}: ${activityName}`} siteUrl={siteUrl} unsubscribeUrl={unsubscribeUrl}>
      <Text style={{ fontSize: 11, letterSpacing: "4px", textTransform: "uppercase", textAlign: "center", color: colors.bronze, margin: "28px 0 0" }}>
        {label}
      </Text>
      <H1>{activityName}</H1>
      <P>
        <strong>{whenText}</strong>
        <br />
        For your visit on {visitText}.
      </P>
      {howTo && <P>{howTo}</P>}
      <Button href={bookUrl}>Go to booking</Button>
      <P>
        Tip: open the page a few minutes early, be signed in, and have your card ready. <a href={tripUrl} style={{ color: colors.espresso }}>See your full trip</a>.
      </P>
    </Layout>
  );
}

export function InquiryNotification(p: {
  siteUrl: string;
  name: string;
  email: string;
  company: string;
  website?: string;
  budget?: string;
  timeline?: string;
  deliverables: string[];
  message: string;
}) {
  const rows: [string, string | undefined][] = [
    ["Name", p.name],
    ["Email", p.email],
    ["Brand", p.company],
    ["Website", p.website],
    ["Budget", p.budget],
    ["Timeline", p.timeline],
    ["Interested in", p.deliverables.join(", ")],
  ];
  return (
    <Layout preview={`New brand inquiry from ${p.company}`} siteUrl={p.siteUrl}>
      <H1>New brand inquiry</H1>
      {rows
        .filter(([, v]) => v)
        .map(([k, v]) => (
          <Text key={k} style={{ fontSize: 14, margin: "4px 0", color: colors.espresso }}>
            <strong>{k}:</strong> {v}
          </Text>
        ))}
      <P>{p.message}</P>
    </Layout>
  );
}

export function InquiryAutoReply({ siteUrl, name }: { siteUrl: string; name: string }) {
  return (
    <Layout preview="Thank you — we've received your note" siteUrl={siteUrl}>
      <H1>Thank you, {name.split(" ")[0]}</H1>
      <P>
        We&rsquo;ve received your note and will be in touch within a few working days. In the meantime, our media kit and recent work
        are on the site.
      </P>
      <Button href={`${siteUrl}/work-with-us`}>View our media kit</Button>
      <P>— The November Couple</P>
    </Layout>
  );
}

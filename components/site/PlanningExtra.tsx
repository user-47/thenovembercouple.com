import Link from "next/link";
import type { Destination } from "@/lib/schema";

const steps = [
  ["Pick your dates", "Tell us when you land and when you leave."],
  ["Get your calendar", "Every ticket release, in your own time zone, with alerts."],
  ["Book in time", "Be ready the minute tickets go on sale."],
];

/** The only homepage mention of the planner: a free extra, not the brand. */
export function PlanningExtra({ d }: { d: Destination }) {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="grid gap-10 border border-rule bg-paper px-6 py-12 sm:px-10 md:py-16 lg:grid-cols-12 lg:gap-16 lg:px-14">
        <div className="lg:col-span-5">
          <p className="eyebrow text-stone">Free trip planner</p>
          <h2 className="display mt-4 text-4xl md:text-5xl">Planning {d.name}? We&rsquo;ll tell you when to book.</h2>
          <p className="mt-5 leading-relaxed text-espresso/85">
            Tickets in {d.name} open on different days, at different times. Pick your travel dates and get a calendar with every booking date,
            in your time zone.
          </p>
          <Link href={`/trips/${d.slug}/planner`} className="btn btn-primary btn-lg mt-8 w-full sm:w-auto">
            Make my {d.name} reminders →
          </Link>
        </div>
        <ol className="divide-y divide-rule border-y border-rule lg:col-span-6 lg:col-start-7 lg:self-center">
          {steps.map(([title, body], i) => (
            <li key={title} className="grid grid-cols-[2.5rem_1fr] gap-4 py-6">
              <span className="figure text-lg text-bronze">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-medium text-ink">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-espresso/80">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

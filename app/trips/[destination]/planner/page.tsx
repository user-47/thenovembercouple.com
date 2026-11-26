import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Planner } from "@/components/planner/Planner";
import { getAllDestinations, getDestination } from "@/lib/destinations";

export function generateStaticParams() {
  return getAllDestinations().map((d) => ({ destination: d.destination.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ destination: string }> }): Promise<Metadata> {
  const b = getDestination((await params).destination);
  if (!b) return {};
  return {
    title: `${b.destination.name} trip planner — know exactly when to book`,
    description: `Build your ${b.destination.name} trip, see the exact day and time every ticket goes on sale, and add reminders to your calendar.`,
  };
}

export default async function PlannerPage({ params }: { params: Promise<{ destination: string }> }) {
  const b = getDestination((await params).destination);
  if (!b) notFound();
  const { destination, itinerary, activities } = b;
  const ourDays = itinerary.days.map((day) => ({
    day: day.day,
    slugs: Array.from(new Set(day.entries.map((e) => e.activity).filter((s): s is string => Boolean(s)))),
  }));

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-14 sm:px-8 sm:pt-20">
        <p className="eyebrow text-stone">{destination.name} trip planner</p>
        <h1 className="display mt-4 max-w-4xl text-5xl sm:text-6xl md:text-7xl">
          Know exactly <em className="bronze-text">when</em> to book.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-espresso/85">
          Add your dates and the things you want to do. We&rsquo;ll work out the day — and the minute — each ticket goes on sale, then
          remind you by calendar or email.
        </p>
        <ol className="mt-10 grid max-w-4xl gap-6 text-sm sm:grid-cols-3">
          {["Set your dates", "Add activities — or copy our trip", "Get your ticket calendar & reminders"].map((s, i) => (
            <li key={s} className="flex gap-4">
              <span className="display text-3xl text-bronze">{i + 1}</span>
              <span className="pt-2 text-espresso/85">{s}</span>
            </li>
          ))}
        </ol>
      </section>
      <Suspense>
        <Planner data={{ destination, activities }} ourDays={ourDays} />
      </Suspense>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Frame } from "@/components/brand/Frame";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "About", description: "Who we are — a family of four sharing travel, home and everyday life." };

const facts = [
  ["Home base", "—"],
  ["Travelling with", "Two little ones, aged 3 & 5"],
  ["Why November", "Our month — so we travel in it"],
  ["Always packed", "A compact stroller & snacks"],
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-24">
      <div className="grid gap-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <Frame alt="The November Couple family portrait" label="TNC" sublabel="Family portrait" seed={3} className="aspect-[4/5]" sizes="(max-width: 1024px) 100vw, 40vw" />
        </Reveal>
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
          <p className="eyebrow text-stone">About us</p>
          <h1 className="display mt-6 text-6xl sm:text-7xl">
            Hello, we&rsquo;re <em className="bronze-text">The November Couple</em>.
          </h1>
          {/* Placeholder copy — replace with your own story. */}
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-espresso/90">
            <p>
              We&rsquo;re a family of four who believe the world is best seen slowly, together, and with a little bit of style. November is our
              month — so each year we take it somewhere new.
            </p>
            <p>
              We share the trips as they really are: the planning, the ticket-release alarms, the midday naps and the moments that make it
              worth it. And we turn each one into a planner so you can do it too.
            </p>
          </div>
          <dl className="mt-10 divide-y divide-rule border-y border-rule">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 py-3 text-sm">
                <dt className="eyebrow pt-0.5 text-[0.6rem] text-stone">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/trips" className="btn btn-primary">
              See our trips
            </Link>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Say hi on Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="mt-28 flex justify-center">
        <Image src="/brand/logo-transparent.png" alt="" width={120} height={120} className="opacity-80" />
      </div>
    </div>
  );
}

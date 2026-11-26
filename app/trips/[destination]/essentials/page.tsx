import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { withAffiliate } from "@/lib/affiliates";
import { getAllDestinations, getDestination } from "@/lib/destinations";

export function generateStaticParams() {
  return getAllDestinations().map((d) => ({ destination: d.destination.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ destination: string }> }): Promise<Metadata> {
  const b = getDestination((await params).destination);
  return b ? { title: `${b.destination.name} travel essentials`, description: `What we pack, buy and set up before a family trip to ${b.destination.name}.` } : {};
}

export default async function EssentialsPage({ params }: { params: Promise<{ destination: string }> }) {
  const b = getDestination((await params).destination);
  if (!b || b.destination.essentials.length === 0) notFound();
  const d = b.destination;
  return (
    <div className="mx-auto max-w-4xl px-5 pt-16 sm:px-8 sm:pt-24">
      <SectionHeading eyebrow={`${d.name} · The travel edit`} title="Before you go" intro="The small things that made the big difference for a family of four." />
      <div className="mt-16 divide-y divide-rule border-y border-rule">
        {d.essentials.map((e, i) => (
          <section key={e.title} className="grid gap-4 py-10 md:grid-cols-12">
            <span className="display text-3xl text-bronze md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
            <div className="md:col-span-11">
              <h2 className="display text-3xl">{e.title}</h2>
              <p className="mt-3 leading-relaxed text-espresso/85">{e.body}</p>
              {e.links.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-3">
                  {e.links.map((l) => (
                    <a
                      key={l.url}
                      href={l.kind === "affiliate" ? withAffiliate(l.url, l.partner) : l.url}
                      target="_blank"
                      rel={l.kind === "affiliate" ? "noopener sponsored" : "noopener"}
                      className="btn btn-ghost btn-sm"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
      <p className="mt-6 text-[0.7rem] text-stone">
        Some links are affiliate links. <Link href="/disclosure" className="underline">Disclosure</Link>
      </p>
      <div className="mt-16 text-center">
        <Link href={`/trips/${d.slug}/planner`} className="btn btn-primary">Open the {d.name} planner</Link>
      </div>
    </div>
  );
}

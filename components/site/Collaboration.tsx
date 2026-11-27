import Link from "next/link";

const partners = [
  "Hotels & hospitality brands",
  "Tourism boards & destinations",
  "Real estate companies & developers",
  "Restaurants & hospitality businesses",
  "Lifestyle & home brands",
];

export function Collaboration() {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="grid gap-12 bg-ink px-6 py-16 text-linen sm:px-12 md:py-24 lg:grid-cols-12 lg:gap-16 lg:px-16">
        <div className="lg:col-span-6">
          <p className="eyebrow text-bronze-light">Partnerships</p>
          <h2 className="display mt-5 text-4xl md:text-5xl">Let&rsquo;s create something worth experiencing.</h2>
          <p className="mt-6 max-w-md leading-relaxed text-linen/75">
            We look for partners our audience would genuinely use, and tell the story through travel, beautiful spaces and real moments.
          </p>
          <Link href="/work-with-us" className="btn btn-lg mt-10 border-linen bg-linen text-ink hover:border-bronze-light hover:bg-bronze-light">
            Work with us →
          </Link>
        </div>
        <ul className="divide-y divide-linen/15 border-y border-linen/15 lg:col-span-5 lg:col-start-8 lg:self-center">
          {partners.map((p) => (
            <li key={p} className="display py-4 text-xl text-linen/90 md:text-2xl">
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

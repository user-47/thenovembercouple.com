import Link from "next/link";
import { Ring } from "@/components/brand/Arc";

export function BrandsBand() {
  return (
    <section className="mx-auto max-w-7xl px-5 sm:px-8">
      <div className="relative overflow-hidden bg-ink px-6 py-16 text-center text-paper sm:px-16 md:py-24">
        <Ring className="pointer-events-none absolute -right-24 -top-24 opacity-30" size={420} />
        <p className="eyebrow relative text-bronze-light">For brands</p>
        <h2 className="display relative mx-auto mt-5 max-w-3xl text-4xl md:text-5xl">Stories people save, plan and book.</h2>
        <p className="relative mx-auto mt-6 max-w-xl leading-relaxed text-paper/75">
          We work with hotels, destinations and brands our followers would actually use.
        </p>
        <Link href="/work-with-us" className="btn btn-lg relative mt-10 w-full border-paper bg-paper text-ink hover:bg-bronze-light sm:w-auto">
          Work with us →
        </Link>
      </div>
    </section>
  );
}

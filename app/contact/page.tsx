import type { Metadata } from "next";
import Link from "next/link";
import { Arc } from "@/components/brand/Arc";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 pt-20 text-center sm:pt-28">
      <p className="eyebrow text-stone">Contact</p>
      <h1 className="display mt-6 text-6xl">Say hello</h1>
      <Arc className="mx-auto mt-8" width={160} />
      <div className="mt-12 grid gap-10 sm:grid-cols-3">
        <div>
          <p className="eyebrow text-[0.62rem] text-stone">Followers</p>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="display link-underline mt-3 inline-block text-2xl">
            DM on Instagram
          </a>
        </div>
        <div>
          <p className="eyebrow text-[0.62rem] text-stone">Brands</p>
          <Link href="/work-with-us#inquire" className="display link-underline mt-3 inline-block text-2xl">
            Partnership form
          </Link>
        </div>
        <div>
          <p className="eyebrow text-[0.62rem] text-stone">Email</p>
          <a href={`mailto:${site.contactEmail}`} className="display link-underline mt-3 inline-block break-all text-2xl">
            {site.contactEmail}
          </a>
        </div>
      </div>
    </div>
  );
}

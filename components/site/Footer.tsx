import Link from "next/link";
import { Emblem } from "@/components/brand/Emblem";
import { Icon } from "@/components/ui/Icon";
import { pillars } from "@/content/pillars";
import { site } from "@/content/site";
import { NewsletterSection } from "./NewsletterSection";

export function Footer() {
  return (
    <>
    <NewsletterSection />
    <footer className="bg-ink text-linen">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-12 md:py-20">
        <div className="flex items-start gap-8 md:col-span-4">
          <Emblem size={112} tone="light" />
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm md:col-span-5">
          <ul className="space-y-3">
            <li className="eyebrow mb-4 text-bronze-light">Explore</li>
            {pillars.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}`} className="link-underline text-linen/75 hover:text-linen">
                  {p.title}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/journal" className="link-underline text-linen/75 hover:text-linen">
                Journal
              </Link>
            </li>
          </ul>
          <ul className="space-y-3">
            <li className="eyebrow mb-4 text-bronze-light">The November Couple</li>
            {[
              ["/about", "About"],
              ["/work-with-us", "Work with us"],
              ["/contact", "Contact"],
              ["/privacy", "Privacy"],
              ["/disclosure", "Affiliate disclosure"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="link-underline text-linen/75 hover:text-linen">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="eyebrow text-bronze-light">Say hello</p>
          <a href={`mailto:${site.contactEmail}`} className="link-underline mt-4 inline-block text-sm text-linen/85 hover:text-linen">
            {site.contactEmail}
          </a>
          <ul className="mt-6 flex gap-3">
            {site.socials.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} (opens in a new tab)`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-linen/25 text-linen/85 transition-colors hover:border-bronze-light hover:text-bronze-light"
                >
                  <Icon name={s.icon} className="h-[18px] w-[18px]" strokeWidth={1.4} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 sm:px-8">
        <span className="h-px flex-1 bg-linen/15" />
        <p className="eyebrow text-center text-[0.62rem] text-bronze-light">{site.tagline}</p>
        <span className="h-px flex-1 bg-linen/15" />
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-8 text-xs text-linen/55 sm:flex-row sm:justify-between sm:px-8">
        <span>© {new Date().getFullYear()} The November Couple</span>
        <span>
          Some links earn us a small commission at no cost to you.{" "}
          <Link href="/disclosure" className="underline underline-offset-2 hover:text-linen">
            Disclosure
          </Link>
        </span>
      </div>
    </footer>
    </>
  );
}

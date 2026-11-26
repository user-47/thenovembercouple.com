import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="mt-32 bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <Image src="/brand/logo-transparent.png" alt={site.name} width={96} height={96} className="opacity-90 brightness-0 invert" />
          <p className="display mt-8 max-w-sm text-3xl text-paper/90">{site.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:col-span-3">
          <ul className="space-y-3 text-sm">
            <li className="eyebrow mb-4 text-bronze-light">Explore</li>
            {site.nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-underline text-paper/80 hover:text-paper">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="link-underline text-paper/80 hover:text-paper">
                Contact
              </Link>
            </li>
          </ul>
          <ul className="space-y-3 text-sm">
            <li className="eyebrow mb-4 text-bronze-light">Follow</li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="link-underline text-paper/80 hover:text-paper">
                Instagram
              </a>
            </li>
            <li>
              <Link href="/privacy" className="link-underline text-paper/80 hover:text-paper">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/disclosure" className="link-underline text-paper/80 hover:text-paper">
                Affiliate disclosure
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="eyebrow text-bronze-light">Letters from the road</p>
          <p className="mt-4 text-sm leading-relaxed text-paper/75">
            Occasional notes from wherever we are — new trip planners, booking dates and the places worth the detour.
          </p>
          <NewsletterForm dark />
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-paper/50 sm:flex-row sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} The November Couple</span>
          <span>Some links earn us a small commission at no cost to you.</span>
        </div>
      </div>
    </footer>
  );
}

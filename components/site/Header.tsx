"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Emblem } from "@/components/brand/Emblem";
import { Icon } from "@/components/ui/Icon";
import { site } from "@/content/site";

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color] duration-500 ${
        scrolled || open ? "border-b border-rule bg-linen/92 backdrop-blur-md" : "border-b border-transparent bg-linen"
      }`}
    >
      <div className={`mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 transition-[height] duration-500 sm:px-8 ${scrolled ? "h-16" : "h-16 lg:h-28"}`}>
        <Link href="/" aria-label={`${site.name} — home`} className="shrink-0">
          <span className={scrolled ? "hidden" : "hidden lg:block"}>
            <Emblem size={92} priority />
          </span>
          <span className={scrolled ? "block" : "block lg:hidden"}>
            <Emblem size={42} variant="compact" priority />
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {site.nav.map((n) => {
            const active = isActive(pathname, n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-2 text-[0.82rem] transition-colors ${active ? "text-ink" : "text-ink/70 hover:text-ink"}`}
              >
                {n.label}
                <span className={`absolute inset-x-0 -bottom-0.5 h-px bg-antique transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0"}`} />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center lg:flex">
          <FollowUs />
        </div>

        <button
          type="button"
          className="eyebrow -mr-2 p-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-rule px-5 pb-8 pt-4 lg:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            {site.nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={isActive(pathname, n.href) ? "page" : undefined} className="display block py-2 text-3xl">
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/work-with-us" className="display block py-2 text-3xl">
                Work with us
              </Link>
            </li>
          </ul>
          <div className="mt-6">
            <FollowUs />
          </div>
        </nav>
      )}
    </header>
  );
}

function FollowUs() {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-ink/80 py-1.5 pl-4 pr-2 text-[0.8rem]">
      <span>Follow us</span>
      {site.socials.map((s) => (
        <a
          key={s.href}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${s.label} (opens in a new tab)`}
          className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-ink hover:text-linen"
        >
          <Icon name={s.icon} className="h-4 w-4" strokeWidth={1.5} />
        </a>
      ))}
    </div>
  );
}

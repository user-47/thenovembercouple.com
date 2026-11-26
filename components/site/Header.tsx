"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

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
        scrolled || open ? "border-b border-rule/70 bg-linen/90 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <nav className="hidden flex-1 items-center gap-8 md:flex" aria-label="Primary">
          {site.nav.slice(0, 2).map((n) => (
            <NavLink key={n.href} href={n.href} active={pathname.startsWith(n.href)}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <Link href="/" className="flex items-center gap-3 md:flex-none" aria-label={`${site.name} — home`}>
          <Image src="/brand/logo-transparent.png" alt="" width={52} height={52} className="h-11 w-11 sm:h-13 sm:w-13" priority />
          <span className="eyebrow hidden text-[0.68rem] sm:inline md:hidden lg:inline">The November Couple</span>
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-8 md:flex">
          {site.nav.slice(2).map((n) => (
            <NavLink key={n.href} href={n.href} active={pathname.startsWith(n.href)}>
              {n.label}
            </NavLink>
          ))}
          <Link href="/trips/japan/planner" className="btn btn-primary btn-sm">
            Plan Japan
          </Link>
        </div>

        <button
          type="button"
          className="eyebrow -mr-2 p-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-rule/70 px-5 pb-8 pt-4 md:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            {site.nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="display block py-2 text-3xl">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/trips/japan/planner" className="btn btn-primary mt-6 w-full">
            Plan your Japan trip
          </Link>
        </nav>
      )}
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={`eyebrow link-underline py-1 ${active ? "text-ink" : "text-espresso/80 hover:text-ink"}`}>
      {children}
    </Link>
  );
}

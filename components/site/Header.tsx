"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

export function Header({ cta }: { cta?: { href: string; name: string } }) {
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
        <nav className="hidden flex-1 items-center gap-6 lg:flex lg:gap-8" aria-label="Primary">
          {site.nav.slice(0, 2).map((n) => (
            <NavLink key={n.href} href={n.href} active={pathname.startsWith(n.href)}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <Link href="/" className="flex items-center lg:flex-none" aria-label={`${site.name} — home`}>
          <Image src="/brand/logo-transparent.png" alt="" width={52} height={52} className="h-11 w-11 sm:h-13 sm:w-13" priority />
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-6 lg:flex lg:gap-8">
          {site.nav.slice(2).map((n) => (
            <NavLink key={n.href} href={n.href} active={pathname.startsWith(n.href)}>
              {n.label}
            </NavLink>
          ))}
          {cta && (
            <Link href={cta.href} className="btn btn-primary btn-sm whitespace-nowrap">
              Plan {cta.name}
            </Link>
          )}
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
        <nav id="mobile-nav" className="border-t border-rule/70 px-5 pb-8 pt-4 lg:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            {site.nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="display block py-2 text-3xl">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          {cta && (
            <Link href={cta.href} className="btn btn-primary btn-lg mt-6 w-full">
              Plan your {cta.name} trip
            </Link>
          )}
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

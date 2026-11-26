import type { Metadata } from "next";
import { Ring } from "@/components/brand/Arc";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import mediaKit from "@/content/media-kit.json";
import { site } from "@/content/site";
import { formatYmd } from "@/lib/dates";

export const metadata: Metadata = {
  title: "Work with us",
  description: "Partner with The November Couple — family travel storytelling for hotels, destinations and lifestyle brands.",
};

type CaseStudy = { brand: string; brief: string; deliverables: string; results: string };

export default function WorkWithUs() {
  const stats = mediaKit.stats as { label: string; value: string | null }[];
  const partners = mediaKit.partners as { name: string; logo?: string }[];
  const cases = mediaKit.caseStudies as CaseStudy[];
  const aud = mediaKit.audience as { topCountries: string[]; ageRange: string | null; gender: string | null };

  return (
    <>
      <section className="relative overflow-hidden">
        <Ring className="pointer-events-none absolute -right-40 top-0 opacity-40" size={620} />
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
          <p className="eyebrow text-stone">Work with us</p>
          <h1 className="display mt-6 max-w-4xl text-6xl sm:text-7xl md:text-8xl">
            Stories people <em className="bronze-text">save</em>, plan &amp; book.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-espresso/85">{mediaKit.statement}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a href="#inquire" className="btn btn-primary">
              Start a conversation
            </a>
            {mediaKit.mediaKitPdf && (
              <a href={mediaKit.mediaKitPdf} className="btn btn-ghost" download>
                Download media kit (PDF)
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-rule bg-paper">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-5 sm:px-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`py-12 text-center ${i % 2 ? "border-l border-rule" : ""} ${i === 2 ? "md:border-l" : ""} ${i > 1 ? "border-t border-rule md:border-t-0" : ""}`}>
              <p className="display text-5xl sm:text-6xl">{s.value ?? "—"}</p>
              <p className="eyebrow mt-3 text-[0.6rem] text-stone">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="pb-6 text-center text-[0.7rem] text-stone">
          {[aud.ageRange && `Audience ${aud.ageRange}`, aud.gender, aud.topCountries.length ? `Top: ${aud.topCountries.join(", ")}` : null]
            .filter(Boolean)
            .join(" · ")}
          {aud.ageRange || aud.topCountries.length ? " · " : ""}Updated {formatYmd(mediaKit.updated, { weekday: false, year: true })}
        </p>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8">
        <SectionHeading eyebrow="What we create" title="Ways to partner" />
        <div className="mt-14 grid gap-px bg-rule sm:grid-cols-2">
          {mediaKit.services.map((s, i) => (
            <Reveal key={s.title} delay={(i % 2) * 0.08} className="bg-linen p-8 sm:p-12">
              <span className="display text-2xl text-bronze">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display mt-4 text-3xl">{s.title}</h3>
              <p className="mt-3 leading-relaxed text-espresso/85">{s.body}</p>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-sm text-stone">Rates on request — every partnership is tailored.</p>
      </section>

      {/* Partners & case studies */}
      {(partners.length > 0 || cases.length > 0) && (
        <section className="mx-auto max-w-7xl px-5 pt-28 sm:px-8">
          <SectionHeading eyebrow="Selected work" title="Brands we've told stories with" />
          {partners.length > 0 && (
            <ul className="mt-12 grid grid-cols-2 border-l border-t border-rule sm:grid-cols-3 md:grid-cols-5">
              {partners.map((p) => (
                <li key={p.name} className="eyebrow flex aspect-[3/2] items-center justify-center border-b border-r border-rule p-6 text-center text-espresso">
                  {p.name}
                </li>
              ))}
            </ul>
          )}
          {cases.length > 0 && (
            <div className="mt-16 grid gap-10 md:grid-cols-2">
              {cases.map((c) => (
                <article key={c.brand} className="border-t border-ink pt-6">
                  <h3 className="display text-3xl">{c.brand}</h3>
                  <dl className="mt-4 space-y-3 text-sm">
                    {(["brief", "deliverables", "results"] as const).map((k) => (
                      <div key={k} className="grid grid-cols-[7rem_1fr] gap-3">
                        <dt className="eyebrow text-[0.6rem] text-stone">{k}</dt>
                        <dd className="leading-relaxed">{c[k]}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Inquiry */}
      <section id="inquire" className="mx-auto max-w-4xl scroll-mt-28 px-5 pt-28 sm:px-8">
        <SectionHeading
          align="center"
          eyebrow="Inquiries"
          title="Let's make something beautiful"
          intro={
            <>
              Tell us a little about your brand and what you have in mind. Prefer email?{" "}
              <a href={`mailto:${site.contactEmail}`} className="underline decoration-bronze underline-offset-4">
                {site.contactEmail}
              </a>
            </>
          }
        />
        <div className="mt-14">
          <InquiryForm />
        </div>
      </section>
    </>
  );
}

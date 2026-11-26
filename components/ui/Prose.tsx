export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-2xl px-5 pt-16 sm:pt-24">
      <p className="eyebrow text-stone">Last updated {updated}</p>
      <h1 className="display mt-4 text-5xl sm:text-6xl">{title}</h1>
      <div className="mt-10 space-y-5 leading-relaxed text-espresso/90 [&_a]:underline [&_a]:decoration-bronze [&_a]:underline-offset-4 [&_h2]:display [&_h2]:mt-12 [&_h2]:text-3xl [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-[square] [&_ul]:space-y-2">
        {children}
      </div>
    </article>
  );
}

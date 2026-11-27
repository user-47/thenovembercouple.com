import { Emblem } from "@/components/brand/Emblem";
import { Frame } from "@/components/brand/Frame";
import { NewsletterForm } from "./NewsletterForm";

export function NewsletterSection() {
  return (
    <section className="mt-24 border-y border-rule bg-paper md:mt-32">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 md:grid-cols-12 md:py-0">
        <Frame
          alt="A calm still life at home"
          label="Still life at home — flowers, books, soft light"
          seed={2}
          className="hidden aspect-[4/3] md:col-span-3 md:block md:aspect-auto md:h-full md:min-h-72"
          sizes="25vw"
        />
        <div className="text-center md:col-span-6 md:py-16">
          <h2 className="display text-4xl md:text-5xl">Stay in the loop</h2>
          <p className="mx-auto mt-4 max-w-md text-ink/75">
            Travel inspiration, new stories and recommendations — straight to your inbox, a few times a year.
          </p>
          <div className="mx-auto max-w-md text-left">
            <NewsletterForm />
          </div>
        </div>
        <div className="hidden justify-center md:col-span-3 md:flex">
          <Emblem size={150} />
        </div>
      </div>
    </section>
  );
}

import { Arc } from "@/components/brand/Arc";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
}) {
  const center = align === "center";
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <div className={`flex items-center gap-4 ${center ? "justify-center" : ""}`}>
          <span className="eyebrow text-stone">{eyebrow}</span>
        </div>
      )}
      <h2 className="display mt-4 text-4xl md:text-5xl">{title}</h2>
      {center && <Arc className="mx-auto mt-6" width={140} />}
      {intro && <p className="mt-6 text-lg leading-relaxed text-espresso/85">{intro}</p>}
    </div>
  );
}

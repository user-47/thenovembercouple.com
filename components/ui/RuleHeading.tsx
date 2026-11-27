/** Centred eyebrow between two hairlines, as used to introduce homepage sections. */
export function RuleHeading({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "light" }) {
  const line = tone === "light" ? "bg-linen/20" : "bg-rule";
  return (
    <div className="flex items-center gap-5">
      <span className={`h-px flex-1 ${line}`} />
      <p className={`eyebrow ${tone === "light" ? "text-bronze-light" : "text-bronze"}`}>{children}</p>
      <span className={`h-px flex-1 ${line}`} />
    </div>
  );
}

import Link from "next/link";
import { Ring } from "@/components/brand/Arc";

export default function NotFound() {
  return (
    <div className="relative mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <Ring className="pointer-events-none absolute opacity-40" size={420} />
      <p className="eyebrow relative text-stone">404</p>
      <h1 className="display relative mt-4 text-5xl">A little off the map</h1>
      <p className="relative mt-4 text-espresso/80">That page doesn&rsquo;t exist — but plenty of good places do.</p>
      <Link href="/trips" className="btn btn-primary relative mt-8">
        Explore our trips
      </Link>
    </div>
  );
}

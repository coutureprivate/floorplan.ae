import Link from "next/link";
import Image from "next/image";

const ABOUT_HERO =
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2400&q=80";

export default function About() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src={ABOUT_HERO}
            alt="Dubai high-rise architecture"
            fill
            priority
            className="object-cover photo-warm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep/95 via-deep/80 to-deep/50" />
        </div>
        <div className="mx-auto max-w-3xl px-6 pt-20 pb-24">
          <div className="eyebrow-light mb-4">About</div>
          <h1 className="h-display-light text-4xl md:text-6xl leading-[1.02]">
            The Floor Plan Atlas
          </h1>
          <p className="mt-6 text-canvas/75 leading-relaxed text-lg max-w-xl">
            Couture's brokerage portal is built on the Floor Plan Atlas v1.1
            pipeline — a three-document taxonomy that extracts unit floor
            plans, floor plate diagrams, and building sections from developer
            broker packages, then reconciles them into one structured model.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 -mt-8">
        <div className="panel p-8 md:p-10">
          <h2 className="h-display text-2xl">What you see here</h2>
          <ul className="mt-5 space-y-3 text-sm text-ink/75">
            <li className="flex gap-3"><span className="text-copper font-serif text-lg leading-none">·</span> <span><strong className="text-deep font-normal">Projects</strong> — top-line gallery of active inventory with status pills.</span></li>
            <li className="flex gap-3"><span className="text-copper font-serif text-lg leading-none">·</span> <span><strong className="text-deep font-normal">Floor plate viewer</strong> — click any position on the plate to see the unit type, view orientation, floor, and live availability.</span></li>
            <li className="flex gap-3"><span className="text-copper font-serif text-lg leading-none">·</span> <span><strong className="text-deep font-normal">Unit pages</strong> — shareable URLs with a clean unit plan, room breakdown, and PDF export.</span></li>
            <li className="flex gap-3"><span className="text-copper font-serif text-lg leading-none">·</span> <span><strong className="text-deep font-normal">Comparison</strong> — true-scale or fit-to-frame, with a diff table and a branded PDF.</span></li>
          </ul>

          <div className="rule my-8" />

          <h2 className="h-display text-2xl">What's mocked</h2>
          <p className="mt-4 text-ink/75 leading-relaxed">
            The dataset is three real Dubai luxury projects (Bugatti
            Residences, Cavalli Couture, Burj Binghatti Jacob &amp; Co.) with
            placeholder unit plans, plate diagrams, and prices. The schema
            mirrors the production Atlas; the scraped inventory from the
            developer groups can be dropped straight in by replacing{" "}
            <code className="text-copper">lib/mockData.ts</code>.
          </p>

          <div className="mt-8 flex gap-3">
            <Link href="/projects" className="btn-primary">Browse projects</Link>
            <Link href="/compare"  className="btn-ghost">Open compare</Link>
          </div>
        </div>
      </div>
    </>
  );
}

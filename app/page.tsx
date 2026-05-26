import Link from "next/link";
import Image from "next/image";
import {
  PROJECTS,
  UNIT_INSTANCES,
  UNIT_TYPES,
} from "@/lib/mockData";

const HERO_IMAGE = 
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2400&q=80";

export default function Dashboard() {
  const totals = {
    projects: PROJECTS.length,
    types: UNIT_TYPES.length,
    instances: UNIT_INSTANCES.length,
    available: UNIT_INSTANCES.filter((u) => u.current_status === "available").length,
  };

  return (
    <>
      {/* ───────── HERO ───────── */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src={HERO_IMAGE}
            alt="Dubai skyline at dusk"
            fill
            priority
            className="object-cover photo-warm"
          />
          {/* Deep gradient so type stays luxe + legible */}
          <div className="absolute inset-0 bg-gradient-to-br from-deep/95 via-deep/85 to-deep/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-deep/95 via-transparent to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-24 pb-32 md:pt-32 md:pb-40">
          <div className="max-w-3xl fade-in">
            <div className="text-canvas/75 mb-5">Brokerage Intelligence · Dubai</div>
            <h1 className="h-display-light text-5xl md:text-7xl leading-[1.02]">
              Floor plate fluency<br />
              <span className="text-copper">for Couture's brokers.</span>
            </h1>
            <p className="mt-7 max-w-xl text-canvas/75 leading-relaxed text-lg">
              Every unit type, every position on every floor, every availability
              signal, surfaced as a clickable plan. Built on the Floor Plan
              Atlas v1.1 pipeline.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/projects" className="btn-primary text-sm px-7 py-3">
                Browse Projects
              </Link>
              <Link href="/compare" className="btn-ghost-light text-sm px-7 py-3">
                Comparison Engine
              </Link>
            </div>
          </div>

          {/* Stat strip — floats above the hero, kissing the next section */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-canvas/15 border border-canvas/15 rounded-sm overflow-hidden max-w-4xl">
            <HeroStat label="Projects"        value={totals.projects} />
            <HeroStat label="Unit Types"      value={totals.types} />
            <HeroStat label="Units in Atlas"  value={totals.instances.toLocaleString()} />
            <HeroStat label="Available Now"   value={totals.available.toLocaleString()} accent />
          </div>
        </div>
      </section>

      {/* ───────── FEATURED INVENTORY ───────── */}
      <section className="mx-auto max-w-7xl px-6 mt-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="eyebrow mb-2">Featured</div>
            <h2 className="h-display text-3xl md:text-4xl">Active inventory</h2>
          </div>
          <Link
            href="/projects"
            className="text-xs uppercase tracking-wider2 text-copper hover:text-deep transition-colors duration-300"
          >
            All projects →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PROJECTS.map((p, i) => {
            const available = UNIT_INSTANCES.filter(
              (u) => u.project_id === p.id && u.current_status === "available"
            ).length;
            return (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="card rise-in flex flex-col"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.cover_image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover photo-warm photo-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep/85 via-deep/15 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="eyebrow-light text-canvas bg-deep/60 backdrop-blur-sm px-2 py-1 rounded-sm">
                      {p.developer}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="h-display-light text-2xl leading-tight">{p.name}</h3>
                    <div className="text-canvas/75 text-xs mt-1">{p.area} · {p.total_floors} floors</div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-ink/75 leading-relaxed line-clamp-2">
                    {p.hero_pitch}
                  </p>
                  <div className="rule my-5" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink/55">Starting</span>
                    <span className="font-serif text-deep text-lg">
                      AED {(p.starting_price_aed / 1_000_000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-ink/55">Available now</span>
                    <span className="text-sm font-serif text-avail-available">{available} units</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ───────── METHOD ───────── */}
      <section className="mx-auto max-w-7xl px-6 mt-28">
        <div className="grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-4">
            <div className="eyebrow mb-3">Method</div>
            <h2 className="h-display text-3xl md:text-4xl leading-tight">
              Why brokers reach for this first.
            </h2>
            <p className="text-ink/70 leading-relaxed mt-5">
              Most floor plans live as marketing PDFs. Ours are extracted,
              reconciled, and rendered as live inventory you can click into.
            </p>
            <Link href="/about" className="btn-primary mt-6">
              Read the method
            </Link>
          </div>

          <div className="md:col-span-8 grid md:grid-cols-3 gap-4">
            <DiscPanel
              eyebrow="Atlas"
              title="Three-document taxonomy"
              body="Unit plans, floor plates, and building sections — reconciled per project for structural QA."
            />
            <DiscPanel
              eyebrow="Method"
              title="Auto-generated unit roster"
              body="Every position × every floor populated on extraction. Availability layered on top."
            />
            <DiscPanel
              eyebrow="Result"
              title="Click-anywhere floor plates"
              body="Pick a position, see the type, the view, and the unit's live status — in one move."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function HeroStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="bg-deep/85 p-5">
      <div className="text-[10px] uppercase tracking-wider2 text-canvas/55">{label}</div>
      <div className={`mt-2 font-serif text-3xl ${accent ? "text-copper" : "text-canvas"}`}>
        {value}
      </div>
    </div>
  );
}

function DiscPanel({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="panel-warm p-6 transition-all duration-500 ease-couture hover:border-copper/40 hover:-translate-y-1">
      <div className="eyebrow">{eyebrow}</div>
      <div className="h-display text-xl mt-3 leading-tight">{title}</div>
      <p className="text-sm text-ink/70 leading-relaxed mt-3">{body}</p>
    </div>
  );
}

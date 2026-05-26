"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { PROJECTS, UNIT_INSTANCES, UNIT_TYPES } from "@/lib/mockData";
import { useCurrency } from "@/components/CurrencyProvider";

const AREAS = Array.from(new Set(PROJECTS.map((p) => p.area)));
const BED_OPTIONS = [1, 2, 3, 4];
const VIEW_OPTIONS = ["sea", "boulevard", "burj", "skyline", "park"] as const;

export default function ProjectsPage() {
  const { format } = useCurrency();
  const [area, setArea] = useState<string | null>(null);
  const [bed, setBed] = useState<number | null>(null);
  const [view, setView] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return PROJECTS.filter((p) => {
      if (area && p.area !== area) return false;
      if (bed && !p.bedrooms_offered.includes(bed)) return false;
      if (view) {
        const types = UNIT_TYPES.filter((u) => u.project_id === p.id);
        if (!types.some((u) => u.view_orientation === view)) return false;
      }
      return true;
    });
  }, [area, bed, view]);

  return (
    <>
      {/* Page header — dark band sets the editorial tone */}
      <section className="surface-deep">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="eyebrow-light mb-3">Inventory</div>
          <h1 className="h-display-light text-4xl md:text-6xl">All projects</h1>
          <p className="mt-5 max-w-2xl text-canvas/70 leading-relaxed">
            Filter by area, bedrooms, or view orientation. Each project opens
            to a floor plate viewer with live availability.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 -mt-8">
        <div className="panel p-5 flex flex-wrap items-center gap-3">
          <FilterGroup
            label="Area"
            options={AREAS}
            value={area}
            onChange={setArea}
          />
          <span className="hidden md:inline text-deep/20">|</span>
          <FilterGroup
            label="Bedrooms"
            options={BED_OPTIONS.map(String)}
            value={bed != null ? String(bed) : null}
            onChange={(v) => setBed(v ? Number(v) : null)}
            renderOption={(o) => `${o} BR`}
          />
          <span className="hidden md:inline text-deep/20">|</span>
          <FilterGroup
            label="View"
            options={[...VIEW_OPTIONS]}
            value={view}
            onChange={setView}
            renderOption={(o) => o.charAt(0).toUpperCase() + o.slice(1)}
          />
          {(area || bed || view) && (
            <button
              onClick={() => { setArea(null); setBed(null); setView(null); }}
              className="ml-auto text-[11px] uppercase tracking-wider2 text-copper hover:text-deep transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-4 text-xs text-ink/55">
          {filtered.length} project{filtered.length === 1 ? "" : "s"}
        </div>

        <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p, i) => {
            const insts = UNIT_INSTANCES.filter((u) => u.project_id === p.id);
            const available = insts.filter((u) => u.current_status === "available").length;
            const reserved  = insts.filter((u) => u.current_status === "reserved").length;
            const sold      = insts.filter((u) => u.current_status === "sold").length;

            return (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="card rise-in flex flex-col"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div className="relative aspect-[5/4] overflow-hidden">
                  <Image
                    src={p.cover_image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover photo-warm photo-zoom"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/20 to-transparent" />
                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <span className="eyebrow-light text-canvas bg-deep/60 backdrop-blur-sm px-2 py-1 rounded-sm">
                      {p.developer}
                    </span>
                    <span className="text-canvas font-serif text-sm bg-copper/85 backdrop-blur-sm px-3 py-1 rounded-sm">
                      {format(p.starting_price_aed)}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="h-display-light text-2xl leading-tight">{p.name}</h3>
                    <div className="text-canvas/75 text-xs mt-1">{p.area} · HO {p.handover}</div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-ink/75 leading-relaxed line-clamp-2">
                    {p.cover_blurb}
                  </p>

                  <div className="rule my-5" />

                  <div className="grid grid-cols-3 gap-2">
                    <Pill label="Available" count={available} color="bg-avail-available/15 text-avail-available" />
                    <Pill label="Reserved"  count={reserved}  color="bg-avail-reserved/15  text-avail-reserved"  />
                    <Pill label="Sold"      count={sold}      color="bg-avail-sold/15      text-avail-sold"      />
                  </div>

                  <div className="mt-5 flex items-center justify-between text-[11px] uppercase tracking-wider2 text-ink/50">
                    <span>{p.total_floors} floors</span>
                    <span className="text-copper">Open plates →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
  renderOption = (o: string) => o,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
  renderOption?: (o: string) => string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="eyebrow text-ink/50">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              onClick={() => onChange(active ? null : o)}
              className={clsx("chip", active && "chip-active")}
            >
              {renderOption(o)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Pill({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div className={clsx("rounded-md py-2 px-3 text-center", color)}>
      <div className="font-serif text-base leading-none">{count}</div>
      <div className="text-[9px] uppercase tracking-wider2 mt-1 opacity-75">
        {label}
      </div>
    </div>
  );
}

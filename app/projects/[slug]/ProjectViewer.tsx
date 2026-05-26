"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import type {
  Project,
  FloorPlate,
  UnitType,
  UnitInstance,
  UnitStatus,
} from "@/lib/types";
import { FloorPlateSVG } from "@/components/FloorPlateSVG";
import { AvailabilityLegend } from "@/components/AvailabilityLegend";
import { useCurrency } from "@/components/CurrencyProvider";

export function ProjectViewer({
  project,
  plates,
  types,
  instances,
}: {
  project: Project;
  plates: FloorPlate[];
  types: UnitType[];
  instances: UnitInstance[];
}) {
  const [plateId, setPlateId] = useState<number>(plates[0].id);
  const plate = plates.find((p) => p.id === plateId)!;
  const [floor, setFloor] = useState<number>(plate.floor_range[0]);
  const [filter, setFilter] = useState<UnitStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const floorInstances = useMemo(
    () => instances.filter((i) => i.floor_plate_id === plateId && i.floor_number === floor),
    [instances, plateId, floor]
  );

  // When switching plates, snap floor back into the new range.
  function switchPlate(id: number) {
    const p = plates.find((x) => x.id === id);
    if (!p) return;
    setPlateId(id);
    setFloor(p.floor_range[0]);
    setSelectedId(null);
  }

  const selected = floorInstances.find((i) => i.id === selectedId) ?? null;
  const selectedType = selected
    ? types.find((t) => t.id === selected.unit_type_id) ?? null
    : null;

  return (
    <section className="mt-16">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="eyebrow">Floor plate viewer</div>
          <h2 className="h-display text-3xl mt-2">{plate.plate_designation}</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {plates.map((p) => (
            <button
              key={p.id}
              onClick={() => switchPlate(p.id)}
              className={clsx("chip", p.id === plateId && "chip-active")}
            >
              {p.plate_designation}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Plate canvas */}
        <div className="lg:col-span-8 panel-warm p-6">
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <AvailabilityLegend value={filter} onChange={setFilter} />
            <FloorPicker
              range={plate.floor_range}
              value={floor}
              onChange={(f) => { setFloor(f); setSelectedId(null); }}
            />
          </div>

          <FloorPlateSVG
            plate={plate}
            instances={floorInstances}
            selectedUnitId={selectedId}
            onSelect={setSelectedId}
            filter={filter}
          />

          <div className="mt-4 text-center text-xs text-ink/55">
            {plate.tower_or_building} · Floor {floor} · {plate.units_per_floor} units per floor
          </div>
        </div>

        {/* Side panel */}
        <aside className="lg:col-span-4">
          {selected && selectedType ? (
            <SelectedUnitPanel
              instance={selected}
              unitType={selectedType}
              projectSlug={project.slug}
            />
          ) : (
            <FloorSummaryPanel
              floor={floor}
              instances={floorInstances}
              types={types}
            />
          )}
        </aside>
      </div>

      {/* Unit type roster at the bottom */}
      <div className="mt-16">
        <div className="eyebrow mb-3">Unit type roster</div>
        <h3 className="h-display text-2xl mb-6">All types in this project</h3>
        <UnitTypeRoster types={types} projectSlug={project.slug} />
      </div>
    </section>
  );
}

function FloorPicker({
  range,
  value,
  onChange,
}: {
  range: [number, number];
  value: number;
  onChange: (f: number) => void;
}) {
  const [lo, hi] = range;
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(lo, value - 1))}
        className="h-8 w-8 grid place-items-center rounded-full border border-deep/15 text-ink/70 hover:border-copper hover:text-copper transition-colors"
        aria-label="Previous floor"
      >
        ‹
      </button>

      <div className="flex items-center gap-2">
        <span className="eyebrow text-ink/50">Floor</span>
        <input
          type="number"
          min={lo}
          max={hi}
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value), lo, hi))}
          className="w-16 font-serif text-deep text-xl text-center bg-transparent border-b border-deep/20 focus:border-copper outline-none"
        />
        <span className="text-xs text-ink/40">/ {hi}</span>
      </div>

      <button
        onClick={() => onChange(Math.min(hi, value + 1))}
        className="h-8 w-8 grid place-items-center rounded-full border border-deep/15 text-ink/70 hover:border-copper hover:text-copper transition-colors"
        aria-label="Next floor"
      >
        ›
      </button>
    </div>
  );
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function SelectedUnitPanel({
  instance,
  unitType,
  projectSlug,
}: {
  instance: UnitInstance;
  unitType: UnitType;
  projectSlug: string;
}) {
  const { format } = useCurrency();
  const statusColor =
    instance.current_status === "available" ? "text-avail-available"
    : instance.current_status === "reserved"  ? "text-avail-reserved"
    : "text-avail-sold";

  return (
    <div className="panel p-6 sticky top-24">
      <div className="flex items-start justify-between">
        <div>
          <div className="eyebrow">Unit {instance.unit_number}</div>
          <div className="h-display text-2xl mt-2">{unitType.type_designation}</div>
          <div className="text-xs text-ink/55 mt-1">
            Floor {instance.floor_number} · Position {instance.position_number}
          </div>
        </div>
        <span className={clsx("eyebrow", statusColor)}>{instance.current_status}</span>
      </div>

      <div className="rule my-5" />

      <dl className="grid grid-cols-2 gap-y-4 text-sm">
        <dt className="text-ink/55">Bedrooms</dt>
        <dd className="text-right font-serif text-deep">{unitType.bedrooms}</dd>

        <dt className="text-ink/55">Bathrooms</dt>
        <dd className="text-right font-serif text-deep">{unitType.bathrooms}</dd>

        <dt className="text-ink/55">Total</dt>
        <dd className="text-right font-serif text-deep">{unitType.total_sqft.toLocaleString()} sqft</dd>

        <dt className="text-ink/55">Inner</dt>
        <dd className="text-right">{unitType.inner_sqft.toLocaleString()} sqft</dd>

        <dt className="text-ink/55">Balcony</dt>
        <dd className="text-right">{unitType.balcony_sqft.toLocaleString()} sqft</dd>

        <dt className="text-ink/55">View</dt>
        <dd className="text-right capitalize">{instance.view_orientation}</dd>

        <dt className="text-ink/55">Asking</dt>
        <dd className="text-right font-serif text-copper">
          {format(instance.current_asking_price_aed)}
        </dd>
      </dl>

      <div className="rule my-5" />

      <div className="flex flex-col gap-2">
        <Link href={`/units/${encodeURIComponent(instance.id)}`} className="btn-primary w-full justify-center">
          Open unit
        </Link>
        <Link href={`/compare?a=${encodeURIComponent(instance.id)}`} className="btn-ghost w-full justify-center">
          Add to compare
        </Link>
      </div>
    </div>
  );
}

function FloorSummaryPanel({
  floor,
  instances,
  types,
}: {
  floor: number;
  instances: UnitInstance[];
  types: UnitType[];
}) {
  const { format } = useCurrency();
  return (
    <div className="panel p-6 sticky top-24">
      <div className="eyebrow">Floor {floor}</div>
      <div className="h-display text-2xl mt-2">{instances.length} units</div>
      <p className="text-sm text-ink/65 mt-2">
        Click any position on the plate to see unit details. Color-coded by
        current status — available, reserved, or sold.
      </p>

      <div className="rule my-5" />

      <ul className="space-y-3 text-sm">
        {instances.map((i) => {
          const t = types.find((x) => x.id === i.unit_type_id);
          if (!t) return null;
          const color =
            i.current_status === "available" ? "bg-avail-available" :
            i.current_status === "reserved"  ? "bg-avail-reserved" :
            "bg-avail-sold";
          return (
            <li key={i.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className={clsx("h-2.5 w-2.5 rounded-full shrink-0", color)} />
                <div className="min-w-0">
                  <div className="font-serif text-deep truncate">{t.type_designation}</div>
                  <div className="text-[11px] text-ink/55 truncate">
                    Pos {i.position_number} · {i.view_orientation}
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-ink/55">{t.total_sqft.toLocaleString()} sqft</div>
                <div className="font-serif text-copper text-xs">{format(i.current_asking_price_aed)}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function instanceIdFor(slug: string, t: UnitType): string {
  // Mirror mockData.buildUnitInstances() ID convention.
  const floor = t.applicable_floor_range[0];
  const pat = t.unit_number_pattern.split(",")[0].trim();
  const isSpecial = pat.startsWith("PH") || pat.startsWith("SV");
  const unitNum = isSpecial ? `${pat}-${floor}` : `${floor}${pat}`;
  return `${slug}-${unitNum}`;
}

function UnitTypeRoster({ types, projectSlug }: { types: UnitType[]; projectSlug: string }) {
  const { format } = useCurrency();
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {types.map((t, i) => (
        <Link
          key={t.id}
          href={`/units/${encodeURIComponent(instanceIdFor(projectSlug, t))}`}
          className="card p-5 rise-in"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="eyebrow capitalize">{t.floor_band}</div>
          <div className="h-display text-lg mt-2">{t.type_designation}</div>
          <div className="text-[11px] text-ink/55 mt-1">
            {t.bedrooms} BR · {t.total_sqft.toLocaleString()} sqft · {t.view_orientation}
          </div>
          <div className="rule my-4" />
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink/55">From</span>
            <span className="font-serif text-deep">{format(t.base_price_aed)}</span>
          </div>
          <div className="text-[10px] text-ink/45 mt-1">
            Floors {t.applicable_floor_range[0]}–{t.applicable_floor_range[1]}
          </div>
        </Link>
      ))}
    </div>
  );
}

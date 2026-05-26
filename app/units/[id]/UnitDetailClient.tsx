"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { useState } from "react";
import type {
  UnitInstance,
  UnitType,
  FloorPlate,
  Project,
} from "@/lib/types";
import { UnitPlanSVG } from "@/components/UnitPlanSVG";
import { FloorPlateSVG } from "@/components/FloorPlateSVG";
import { useCurrency } from "@/components/CurrencyProvider";

export function UnitDetailClient({
  instance,
  unitType,
  plate,
  project,
  floorInstances,
}: {
  instance: UnitInstance;
  unitType: UnitType;
  plate: FloorPlate;
  project: Project;
  floorInstances: UnitInstance[];
}) {
  const { format } = useCurrency();
  const [copied, setCopied] = useState(false);

  const statusColor =
    instance.current_status === "available" ? "text-avail-available"
    : instance.current_status === "reserved" ? "text-avail-reserved"
    : "text-avail-sold";

  function copyLink() {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      {/* ───────── PROJECT CONTEXT STRIP ───────── */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src={project.hero_image}
            alt={project.name}
            fill
            priority
            className="object-cover photo-warm"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep/95 via-deep/80 to-deep/40" />
        </div>
        <div className="mx-auto max-w-7xl px-6 pt-12 pb-20 md:pt-16 md:pb-24">
          <Link
            href={`/projects/${project.slug}`}
            className="text-[11px] uppercase tracking-wider2 text-canvas/65 hover:text-copper transition-colors"
          >
            ← {project.name}
          </Link>

          <div className="mt-6 grid md:grid-cols-12 gap-8 items-end fade-in">
            <div className="md:col-span-7">
              <div className="eyebrow-light">{project.name} · {plate.tower_or_building}</div>
              <h1 className="h-display-light text-4xl md:text-6xl mt-3 leading-[1.02]">
                Unit {instance.unit_number}
              </h1>
              <div className="text-canvas/75 mt-3">
                {unitType.type_designation} · {unitType.bedrooms} BR ·{" "}
                {unitType.total_sqft.toLocaleString()} sqft · {instance.view_orientation} view
              </div>
            </div>
            <div className="md:col-span-5 md:text-right">
              <span className={clsx("eyebrow-light inline-block px-2 py-1 bg-deep/60 backdrop-blur-sm rounded-sm", statusColor)}>
                {instance.current_status}
              </span>
              <div className="font-serif text-4xl text-copper mt-3">
                {format(instance.current_asking_price_aed)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 -mt-12">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Unit plan */}
          <div className="lg:col-span-7 panel p-6 md:p-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="eyebrow">Unit plan</div>
                <div className="h-display text-xl mt-1">{unitType.type_designation}</div>
              </div>
              <div className="text-[11px] text-ink/55 uppercase tracking-wider2 text-right">
                Inner {unitType.inner_sqft.toLocaleString()} sqft<br />
                Balcony {unitType.balcony_sqft.toLocaleString()} sqft
              </div>
            </div>
            <UnitPlanSVG unitType={unitType} height={460} />
          </div>

          {/* Side panel */}
          <aside className="lg:col-span-5 space-y-5">
            <div className="panel-warm p-6">
              <div className="eyebrow">Position on floor</div>
              <div className="mt-3 -mx-2">
                <FloorPlateSVG
                  plate={plate}
                  instances={floorInstances}
                  selectedUnitId={instance.id}
                  filter="all"
                />
              </div>
              <div className="text-xs text-ink/55 mt-2 text-center">
                Position {instance.position_number} on floor {instance.floor_number}
              </div>
            </div>

            <div className="panel p-6">
              <div className="eyebrow">Room breakdown</div>
              <ul className="mt-3 space-y-2 text-sm">
                {unitType.rooms.map((r) => (
                  <li key={r.label} className="flex items-center justify-between border-b border-deep/5 pb-2 last:border-b-0">
                    <span className="text-ink/75">{r.label}</span>
                    <span className="font-serif text-deep">{r.size_sqft.toLocaleString()} sqft</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface-deep p-6">
              <div className="eyebrow-light">Actions</div>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href={`/compare?a=${encodeURIComponent(instance.id)}`}
                  className="btn-primary w-full justify-center"
                >
                  Add to compare
                </Link>
                <a
                  href={`/api/pdf/unit/${encodeURIComponent(instance.id)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-light w-full justify-center"
                >
                  Export branded PDF
                </a>
                <button onClick={copyLink} className="btn-ghost-light w-full justify-center">
                  {copied ? "Copied" : "Copy shareable link"}
                </button>
              </div>
            </div>

            {project.accent_image && (
              <div className="relative aspect-[4/3] overflow-hidden border border-deep/10">
                <Image
                  src={project.accent_image}
                  alt={`${project.name} interior`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover photo-warm"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 text-canvas">
                  <div className="eyebrow-light">Interior reference</div>
                  <div className="text-xs text-canvas/75 mt-1">Indicative finish · {project.name}</div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

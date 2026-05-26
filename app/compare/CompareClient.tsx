"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import {
  getUnitInstance,
  getUnitType,
  PROJECTS,
} from "@/lib/mockData";
import type { UnitInstance, UnitType, Project } from "@/lib/types";
import { UnitPlanSVG } from "@/components/UnitPlanSVG";
import { useCurrency } from "@/components/CurrencyProvider";

type IndexEntry = {
  id: string;
  label: string;
  project_name: string;
  unit_number: string;
  type_designation: string;
  status: string;
  total_sqft: number;
  price_aed: number;
};

type Side = {
  instance: UnitInstance;
  unitType: UnitType;
  project: Project;
} | null;

function hydrate(id: string | null): Side {
  if (!id) return null;
  const instance = getUnitInstance(id);
  if (!instance) return null;
  const unitType = getUnitType(instance.unit_type_id);
  const project = PROJECTS.find((p) => p.id === instance.project_id);
  if (!unitType || !project) return null;
  return { instance, unitType, project };
}

export function CompareClient({ index }: { index: IndexEntry[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const aId = searchParams.get("a");
  const bId = searchParams.get("b");

  const A = hydrate(aId);
  const B = hydrate(bId);

  const [mode, setMode] = useState<"fit" | "true">("fit");
  const [copied, setCopied] = useState(false);

  function setSide(side: "a" | "b", id: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (id) params.set(side, id);
    else params.delete(side);
    router.replace(`/compare?${params.toString()}`);
  }

  function copyLink() {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <section className="surface-deep">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div className="fade-in">
              <div className="eyebrow-light">Comparison Engine</div>
              <h1 className="h-display-light text-4xl md:text-6xl mt-3">Side by side</h1>
              <p className="text-canvas/70 mt-4 max-w-xl leading-relaxed">
                True-scale or fit-to-frame. The plans render to the same sqft
                footprint when true-scale is on — making size differences
                visible rather than implied.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <ModeToggle mode={mode} onChange={setMode} />
              <button onClick={copyLink} className="btn-ghost-light">
                {copied ? "Copied" : "Share link"}
              </button>
              {A && B && (
                <a
                  href={`/api/pdf/compare?a=${encodeURIComponent(A.instance.id)}&b=${encodeURIComponent(B.instance.id)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Export PDF
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 -mt-8">
        <div className="grid md:grid-cols-2 gap-6">
          <Slot side="a" data={A} index={index} onPick={(id) => setSide("a", id)} onClear={() => setSide("a", null)} mode={mode} other={B} />
          <Slot side="b" data={B} index={index} onPick={(id) => setSide("b", id)} onClear={() => setSide("b", null)} mode={mode} other={A} />
        </div>

        {A && B && <DiffTable a={A} b={B} />}
      </div>
    </>
  );
}

function ModeToggle({ mode, onChange }: { mode: "fit" | "true"; onChange: (m: "fit" | "true") => void }) {
  return (
    <div role="radiogroup" className="inline-flex items-center rounded-full border border-canvas/25 p-0.5 bg-deep/40 backdrop-blur-sm">
      {(["fit", "true"] as const).map((m) => {
        const active = m === mode;
        return (
          <button
            key={m}
            onClick={() => onChange(m)}
            className={clsx(
              "px-4 py-1.5 text-[11px] uppercase tracking-wider2 font-sans rounded-full",
              "transition-all duration-300 ease-couture",
              active ? "bg-copper text-canvas" : "text-canvas/70 hover:text-copper"
            )}
          >
            {m === "fit" ? "Fit-to-frame" : "True-scale"}
          </button>
        );
      })}
    </div>
  );
}

function Slot({
  side, data, index, onPick, onClear, mode, other,
}: {
  side: "a" | "b";
  data: Side;
  index: IndexEntry[];
  onPick: (id: string) => void;
  onClear: () => void;
  mode: "fit" | "true";
  other: Side;
}) {
  if (!data) return <EmptySlot side={side} index={index} onPick={onPick} />;

  // True-scale: the SVG dimensions are pinned to a relative footprint.
  // Both sides share the max sqft so the bigger unit physically reads bigger.
  const maxSqft = Math.max(
    data.unitType.total_sqft,
    other?.unitType.total_sqft ?? data.unitType.total_sqft
  );
  const scale = mode === "true"
    ? Math.sqrt(data.unitType.total_sqft / maxSqft)
    : 1;

  return (
    <div className="panel p-6">
      <SlotHeader side={side} onClear={onClear} />
      <div className="mt-3">
        <div className="eyebrow">{data.project.name}</div>
        <div className="h-display text-2xl mt-1">{data.unitType.type_designation}</div>
        <div className="text-xs text-ink/55 mt-1">
          Unit {data.instance.unit_number} · Floor {data.instance.floor_number} · {data.instance.view_orientation}
        </div>
      </div>

      <div
        className="mt-5 mx-auto transition-transform duration-500 ease-couture"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          width: "100%",
          maxWidth: 480,
        }}
      >
        <UnitPlanSVG unitType={data.unitType} height={340} />
      </div>

      <SlotStats data={data} />
    </div>
  );
}

function SlotHeader({ side, onClear }: { side: "a" | "b"; onClear: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="eyebrow text-copper">Slot {side.toUpperCase()}</span>
      <button onClick={onClear} className="text-[11px] uppercase tracking-wider2 text-ink/50 hover:text-copper transition-colors">
        Change
      </button>
    </div>
  );
}

function SlotStats({ data }: { data: NonNullable<Side> }) {
  const { format } = useCurrency();
  const t = data.unitType;
  return (
    <div className="mt-6 grid grid-cols-3 gap-2 text-center">
      <Stat label="Total" v={`${t.total_sqft.toLocaleString()} sqft`} />
      <Stat label="Inner" v={`${t.inner_sqft.toLocaleString()} sqft`} />
      <Stat label="Balcony" v={`${t.balcony_sqft.toLocaleString()} sqft`} />
      <Stat label="Bedrooms" v={t.bedrooms} />
      <Stat label="Bathrooms" v={t.bathrooms} />
      <Stat label="View" v={t.view_orientation} />
      <Stat label="Asking" v={format(data.instance.current_asking_price_aed)} accent />
      <Stat label="Floor" v={data.instance.floor_number} />
      <Stat label="Status" v={data.instance.current_status} />
    </div>
  );
}

function Stat({
  label,
  v,
  accent,
}: {
  label: string;
  v: string | number;
  accent?: boolean;
}) {
  return (
    <div className="p-2 border border-deep/10 rounded-sm">
      <div className={clsx("font-serif text-sm", accent ? "text-copper" : "text-deep")}>
        {v}
      </div>
      <div className="text-[9px] uppercase tracking-wider2 text-ink/55 mt-0.5">{label}</div>
    </div>
  );
}

function EmptySlot({
  side,
  index,
  onPick,
}: {
  side: "a" | "b";
  index: IndexEntry[];
  onPick: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return index.slice(0, 30);
    return index.filter((e) =>
      e.label.toLowerCase().includes(needle) ||
      e.unit_number.toLowerCase().includes(needle)
    ).slice(0, 50);
  }, [index, q]);

  return (
    <div className="panel p-6 min-h-[28rem] flex flex-col">
      <div className="eyebrow text-copper">Slot {side.toUpperCase()}</div>
      <h3 className="h-display text-2xl mt-1">Pick a unit</h3>
      <input
        autoFocus={side === "a"}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by project, unit number, or type…"
        className="mt-4 w-full bg-transparent border-b border-deep/15 focus:border-copper outline-none py-2 text-sm"
      />
      <ul className="mt-4 flex-1 overflow-auto divide-y divide-deep/10">
        {filtered.map((e) => (
          <li key={e.id}>
            <button
              onClick={() => onPick(e.id)}
              className="w-full text-left py-3 hover:bg-deep/[0.03] px-2 -mx-2 transition-colors duration-200"
            >
              <div className="text-sm font-serif text-deep">{e.project_name}</div>
              <div className="text-[11px] text-ink/55 mt-0.5">
                Unit {e.unit_number} · {e.type_designation} · {e.total_sqft.toLocaleString()} sqft · {e.status}
              </div>
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-sm text-ink/55 py-6 text-center">No matches.</li>
        )}
      </ul>
    </div>
  );
}

function DiffTable({ a, b }: { a: NonNullable<Side>; b: NonNullable<Side> }) {
  const { format } = useCurrency();

  const rows: Array<{ label: string; a: string | number; b: string | number; diff?: string }> = [
    { label: "Project",    a: a.project.name,       b: b.project.name },
    { label: "Area",       a: a.project.area,       b: b.project.area },
    { label: "Type",       a: a.unitType.type_designation, b: b.unitType.type_designation },
    { label: "Bedrooms",   a: a.unitType.bedrooms,  b: b.unitType.bedrooms, diff: signedDiff(a.unitType.bedrooms, b.unitType.bedrooms) },
    { label: "Bathrooms",  a: a.unitType.bathrooms, b: b.unitType.bathrooms, diff: signedDiff(a.unitType.bathrooms, b.unitType.bathrooms) },
    { label: "Total sqft", a: a.unitType.total_sqft, b: b.unitType.total_sqft, diff: signedDiff(a.unitType.total_sqft, b.unitType.total_sqft, " sqft") },
    { label: "Inner sqft", a: a.unitType.inner_sqft, b: b.unitType.inner_sqft, diff: signedDiff(a.unitType.inner_sqft, b.unitType.inner_sqft, " sqft") },
    { label: "Balcony sqft", a: a.unitType.balcony_sqft, b: b.unitType.balcony_sqft, diff: signedDiff(a.unitType.balcony_sqft, b.unitType.balcony_sqft, " sqft") },
    { label: "View",       a: a.instance.view_orientation, b: b.instance.view_orientation },
    { label: "Floor",      a: a.instance.floor_number, b: b.instance.floor_number, diff: signedDiff(a.instance.floor_number, b.instance.floor_number) },
    { label: "Status",     a: a.instance.current_status, b: b.instance.current_status },
    { label: "Asking",     a: format(a.instance.current_asking_price_aed), b: format(b.instance.current_asking_price_aed) },
    { label: "AED/sqft",   a: Math.round(a.instance.current_asking_price_aed / a.unitType.total_sqft).toLocaleString(),
                            b: Math.round(b.instance.current_asking_price_aed / b.unitType.total_sqft).toLocaleString(),
                            diff: signedDiff(
                              Math.round(b.instance.current_asking_price_aed / b.unitType.total_sqft),
                              Math.round(a.instance.current_asking_price_aed / a.unitType.total_sqft)
                            )},
  ];

  return (
    <div className="mt-12">
      <div className="eyebrow mb-3">Diff</div>
      <h3 className="h-display text-2xl mb-4">Side-by-side spec</h3>
      <div className="panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-deep/[0.03]">
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider2 text-ink/55 font-normal">Field</th>
              <th className="text-right px-5 py-3 text-[10px] uppercase tracking-wider2 text-ink/55 font-normal">Slot A</th>
              <th className="text-right px-5 py-3 text-[10px] uppercase tracking-wider2 text-ink/55 font-normal">Slot B</th>
              <th className="text-right px-5 py-3 text-[10px] uppercase tracking-wider2 text-ink/55 font-normal">Δ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.label} className={i % 2 ? "bg-deep/[0.015]" : ""}>
                <td className="px-5 py-3 text-ink/65">{r.label}</td>
                <td className="px-5 py-3 text-right font-serif text-deep">{r.a}</td>
                <td className="px-5 py-3 text-right font-serif text-deep">{r.b}</td>
                <td className="px-5 py-3 text-right text-copper">{r.diff ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function signedDiff(a: number, b: number, suffix = "") {
  const d = b - a;
  if (d === 0) return "—";
  const sign = d > 0 ? "+" : "−";
  return `${sign}${Math.abs(d).toLocaleString()}${suffix}`;
}

"use client";

import clsx from "clsx";
import type { UnitStatus } from "@/lib/types";

const ENTRIES: Array<{ status: UnitStatus | "all"; label: string; swatch: string }> = [
  { status: "all",       label: "All",       swatch: "bg-deep/20" },
  { status: "available", label: "Available", swatch: "bg-avail-available" },
  { status: "reserved",  label: "Reserved",  swatch: "bg-avail-reserved" },
  { status: "sold",      label: "Sold",      swatch: "bg-avail-sold" },
];

export function AvailabilityLegend({
  value,
  onChange,
}: {
  value: UnitStatus | "all";
  onChange: (v: UnitStatus | "all") => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {ENTRIES.map((e) => (
        <button
          key={e.status}
          onClick={() => onChange(e.status)}
          className={clsx(
            "chip flex items-center gap-2",
            value === e.status && "chip-active"
          )}
        >
          <span className={clsx("h-2.5 w-2.5 rounded-full", e.swatch)} />
          {e.label}
        </button>
      ))}
    </div>
  );
}

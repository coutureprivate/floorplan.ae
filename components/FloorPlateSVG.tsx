"use client";

import clsx from "clsx";
import type { FloorPlate, UnitInstance, UnitStatus } from "@/lib/types";

const STATUS_FILL: Record<UnitStatus, string> = {
  available: "#5C7A4E",
  reserved:  "#B5893F",
  sold:      "#8C3A3A",
};

const STATUS_FILL_DIM: Record<UnitStatus, string> = {
  available: "rgba(92,122,78,0.15)",
  reserved:  "rgba(181,137,63,0.15)",
  sold:      "rgba(140,58,58,0.18)",
};

export function FloorPlateSVG({
  plate,
  instances,
  selectedUnitId,
  onSelect,
  filter,
}: {
  plate: FloorPlate;
  instances: UnitInstance[];
  selectedUnitId?: string | null;
  onSelect?: (id: string) => void;
  filter: UnitStatus | "all";
}) {
  const [vx, vy, vw, vh] = plate.layout.viewbox;

  return (
    <svg
      viewBox={`${vx} ${vy} ${vw} ${vh}`}
      role="img"
      aria-label={`Floor plate ${plate.plate_designation}`}
      className="w-full h-auto select-none"
    >
      {/* Soft background canvas to ground the plan */}
      <rect x={vx} y={vy} width={vw} height={vh} fill="#EDE9DE" />

      {/* Building outline */}
      <path d={plate.layout.outline} fill="none" stroke="#252504" strokeWidth={0.6} />

      {/* Common areas — neutral fills, behind positions */}
      {plate.layout.common_areas.map((ca, i) => (
        <g key={`ca-${i}`}>
          <path
            d={ca.polygon}
            fill="#E8E6DF"
            stroke="#252504"
            strokeWidth={0.25}
            strokeDasharray="0.6 0.6"
            opacity={0.9}
          />
          <text
            x={ca.label_xy[0]}
            y={ca.label_xy[1]}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={1.6}
            fill="#252504"
            opacity={0.55}
            style={{ pointerEvents: "none", textTransform: "uppercase", letterSpacing: "0.1em" }}
          >
            {ca.type}
          </text>
        </g>
      ))}

      {/* Unit positions — clickable */}
      {plate.layout.positions.map((pos) => {
        const instance = instances.find((i) => i.position_number === pos.position_number);
        if (!instance) return null;

        const matchesFilter = filter === "all" || instance.current_status === filter;
        const selected = instance.id === selectedUnitId;

        const fill = matchesFilter
          ? STATUS_FILL[instance.current_status]
          : STATUS_FILL_DIM[instance.current_status];
        const fillOpacity = matchesFilter ? (selected ? 0.85 : 0.55) : 0.45;
        const stroke = selected ? "#252504" : matchesFilter ? "#252504" : "#252504";
        const strokeOpacity = selected ? 1 : matchesFilter ? 0.6 : 0.15;
        const strokeWidth = selected ? 0.9 : matchesFilter ? 0.35 : 0.2;

        return (
          <g key={pos.position_number} className="fp-position" onClick={() => onSelect?.(instance.id)}>
            <path
              d={pos.polygon}
              fill={fill}
              fillOpacity={fillOpacity}
              stroke={stroke}
              strokeOpacity={strokeOpacity}
              strokeWidth={strokeWidth}
              className={clsx(selected && "fp-position--selected")}
            />
            <text
              x={pos.label_xy[0]}
              y={pos.label_xy[1] - 1.2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={3}
              fontFamily="var(--font-serif-display), Georgia, serif"
              fill="#F4F4F4"
              style={{ pointerEvents: "none" }}
              opacity={matchesFilter ? 1 : 0.6}
            >
              {pos.position_number}
            </text>
            <text
              x={pos.label_xy[0]}
              y={pos.label_xy[1] + 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={1.6}
              fill="#F4F4F4"
              opacity={matchesFilter ? 0.85 : 0.45}
              style={{ pointerEvents: "none", textTransform: "uppercase", letterSpacing: "0.12em" }}
            >
              {instance.view_orientation}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

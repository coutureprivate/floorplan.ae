"use client";

import type { UnitType } from "@/lib/types";

export function UnitPlanSVG({
  unitType,
  height = 360,
}: {
  unitType: UnitType;
  height?: number;
}) {
  return (
    <svg
      viewBox="-4 -4 108 108"
      role="img"
      aria-label={`Plan of ${unitType.type_designation}`}
      style={{ height, width: "100%" }}
      className="select-none"
    >
      <rect x={-4} y={-4} width={108} height={108} fill="#EDE9DE" />

      {/* Outline */}
      <path d={unitType.plan.outline} fill="#E2DDD0" stroke="#252504" strokeWidth={0.6} />

      {/* Room polygons */}
      {unitType.plan.rooms.map((r, i) => (
        <g key={i}>
          <path
            d={r.polygon}
            fill="#F4F1E8"
            stroke="#252504"
            strokeWidth={0.3}
            opacity={0.95}
          />
          <text
            x={extractCentroid(r.polygon)[0]}
            y={extractCentroid(r.polygon)[1] - 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={2.2}
            fontFamily="var(--font-serif-display), Georgia, serif"
            fill="#252504"
          >
            {r.label}
          </text>
          <text
            x={extractCentroid(r.polygon)[0]}
            y={extractCentroid(r.polygon)[1] + 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={1.6}
            fill="#252504"
            opacity={0.55}
            style={{ textTransform: "uppercase", letterSpacing: "0.12em" }}
          >
            {r.sqft ? `${r.sqft} sqft` : ""}
          </text>
        </g>
      ))}

      {/* N arrow + scale eyebrow */}
      <g transform="translate(96, 4)">
        <circle r="3" fill="none" stroke="#252504" strokeWidth={0.4} />
        <text x={0} y={0.5} textAnchor="middle" dominantBaseline="middle" fontSize={2.4} fontFamily="var(--font-serif-display), Georgia, serif" fill="#252504">N</text>
      </g>
    </svg>
  );
}

// Quick centroid extractor from "M x y L x y L x y ..." paths.
// Approximates with bbox center — good enough for room labels.
function extractCentroid(d: string): [number, number] {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  if (nums.length < 4) return [50, 50];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i < nums.length; i += 2) {
    const x = nums[i], y = nums[i + 1];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return [(minX + maxX) / 2, (minY + maxY) / 2];
}

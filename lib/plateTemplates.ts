// Procedurally generated SVG floor plate templates.
// Each plate uses a 100x100 viewbox. Position polygons are clickable.

import type { FloorPlate, FloorPlatePosition, ViewOrientation } from "./types";

type PositionSeed = {
  position_number: string;
  unit_type_id: number;
  view_orientation: ViewOrientation;
  polygon: string;
  label_xy: [number, number];
};

const rect = (x: number, y: number, w: number, h: number) =>
  `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;

// ---------- Plate 1: WIDE PERIMETER (Bugatti) — 6 units per floor ----------
// Building 10,15 → 90,85.  Core 40,42 → 60,58.
export function bugattiPlateLayout(
  unitTypeIds: { [pos: string]: number }
): FloorPlate["layout"] {
  const positions: FloorPlatePosition[] = [
    {
      position_number: "01",
      unit_type_id: unitTypeIds["01"],
      view_orientation: "sea",
      polygon: rect(10, 15, 28, 27),
      label_xy: [24, 30],
    },
    {
      position_number: "02",
      unit_type_id: unitTypeIds["02"],
      view_orientation: "sea",
      polygon: rect(38, 15, 24, 27),
      label_xy: [50, 30],
    },
    {
      position_number: "03",
      unit_type_id: unitTypeIds["03"],
      view_orientation: "sea",
      polygon: rect(62, 15, 28, 27),
      label_xy: [76, 30],
    },
    {
      position_number: "04",
      unit_type_id: unitTypeIds["04"],
      view_orientation: "boulevard",
      polygon: rect(10, 58, 28, 27),
      label_xy: [24, 73],
    },
    {
      position_number: "05",
      unit_type_id: unitTypeIds["05"],
      view_orientation: "boulevard",
      polygon: rect(38, 58, 24, 27),
      label_xy: [50, 73],
    },
    {
      position_number: "06",
      unit_type_id: unitTypeIds["06"],
      view_orientation: "boulevard",
      polygon: rect(62, 58, 28, 27),
      label_xy: [76, 73],
    },
  ];

  return {
    viewbox: [0, 0, 100, 100],
    outline: rect(10, 15, 80, 70),
    core: rect(40, 42, 20, 16),
    common_areas: [
      { type: "elevators", polygon: rect(40, 42, 20, 16), label_xy: [50, 50] },
      { type: "stairs",    polygon: rect(38, 42, 2, 16),  label_xy: [39, 50] },
      { type: "service",   polygon: rect(60, 42, 2, 16),  label_xy: [61, 50] },
      { type: "corridor",  polygon: rect(10, 42, 28, 16), label_xy: [24, 50] },
      { type: "corridor",  polygon: rect(62, 42, 28, 16), label_xy: [76, 50] },
    ],
    positions,
  };
}

// ---------- Plate 2: CORNER QUADRANTS (Cavalli) — 4 large units ----------
// Building 10,10 → 90,90. Core 38,38 → 62,62. Units are L-shapes around the core.
export function cavalliPlateLayout(
  unitTypeIds: { [pos: string]: number }
): FloorPlate["layout"] {
  const positions: FloorPlatePosition[] = [
    {
      position_number: "01",
      unit_type_id: unitTypeIds["01"],
      view_orientation: "burj",
      polygon:
        "M 10 10 L 50 10 L 50 38 L 38 38 L 38 50 L 10 50 Z",
      label_xy: [27, 28],
    },
    {
      position_number: "02",
      unit_type_id: unitTypeIds["02"],
      view_orientation: "skyline",
      polygon:
        "M 50 10 L 90 10 L 90 50 L 62 50 L 62 38 L 50 38 Z",
      label_xy: [73, 28],
    },
    {
      position_number: "03",
      unit_type_id: unitTypeIds["03"],
      view_orientation: "park",
      polygon:
        "M 62 50 L 90 50 L 90 90 L 50 90 L 50 62 L 62 62 Z",
      label_xy: [73, 73],
    },
    {
      position_number: "04",
      unit_type_id: unitTypeIds["04"],
      view_orientation: "boulevard",
      polygon:
        "M 10 50 L 38 50 L 38 62 L 50 62 L 50 90 L 10 90 Z",
      label_xy: [27, 73],
    },
  ];

  return {
    viewbox: [0, 0, 100, 100],
    outline: rect(10, 10, 80, 80),
    core: rect(38, 38, 24, 24),
    common_areas: [
      { type: "elevators", polygon: rect(42, 42, 16, 16), label_xy: [50, 50] },
      { type: "lobby",     polygon: rect(38, 38, 24, 4),  label_xy: [50, 40] },
      { type: "stairs",    polygon: rect(38, 58, 24, 4),  label_xy: [50, 60] },
    ],
    positions,
  };
}

// ---------- Plate 3: SLIM TOWER (Burj Binghatti typical) — 2 units per floor ----
// Building 25,10 → 75,90.  Core (horizontal band) 25,46 → 75,54.
export function burjPlateLayout(
  unitTypeIds: { [pos: string]: number }
): FloorPlate["layout"] {
  const positions: FloorPlatePosition[] = [
    {
      position_number: "01",
      unit_type_id: unitTypeIds["01"],
      view_orientation: "burj",
      polygon: rect(25, 10, 50, 36),
      label_xy: [50, 28],
    },
    {
      position_number: "02",
      unit_type_id: unitTypeIds["02"],
      view_orientation: "sea",
      polygon: rect(25, 54, 50, 36),
      label_xy: [50, 72],
    },
  ];

  return {
    viewbox: [0, 0, 100, 100],
    outline: rect(25, 10, 50, 80),
    core: rect(25, 46, 50, 8),
    common_areas: [
      { type: "elevators", polygon: rect(40, 46, 20, 8), label_xy: [50, 50] },
      { type: "stairs",    polygon: rect(25, 46, 15, 8), label_xy: [33, 50] },
      { type: "service",   polygon: rect(60, 46, 15, 8), label_xy: [67, 50] },
    ],
    positions,
  };
}

// ---------- Plate 4: PENTHOUSE FLOOR (Burj Binghatti) — 1 unit per floor ----
export function burjPenthouseLayout(
  unitTypeIds: { [pos: string]: number }
): FloorPlate["layout"] {
  const positions: FloorPlatePosition[] = [
    {
      position_number: "PH-01",
      unit_type_id: unitTypeIds["PH-01"],
      view_orientation: "burj",
      polygon:
        "M 15 10 L 85 10 L 85 90 L 15 90 Z",
      label_xy: [50, 50],
    },
  ];

  return {
    viewbox: [0, 0, 100, 100],
    outline: rect(15, 10, 70, 80),
    core: rect(45, 46, 10, 8),
    common_areas: [
      { type: "elevators", polygon: rect(45, 46, 10, 8), label_xy: [50, 50] },
    ],
    positions,
  };
}

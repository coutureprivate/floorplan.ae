// Mock dataset mirroring the v1.1 Floor Plan Atlas schema.
// 3 real Dubai luxury projects; replace with scraped data later.

import type {
  Project,
  UnitType,
  FloorPlate,
  UnitInstance,
  UnitStatus,
} from "./types";
import { makePlan } from "./planTemplates";
import {
  bugattiPlateLayout,
  cavalliPlateLayout,
  burjPlateLayout,
  burjPenthouseLayout,
} from "./plateTemplates";

// ---------- Deterministic PRNG so statuses don't reshuffle on every render -----
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

// ---------- Projects ---------------------------------------------------------
export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: "bugatti-residences",
    name: "Bugatti Residences",
    developer: "Binghatti",
    area: "Business Bay",
    city: "Dubai",
    total_floors: 46,
    floor_breakdown: [
      { range: [1, 5],   use: "amenity",     label: "Atelier + arrival" },
      { range: [6, 43],  use: "residential", label: "Riviera Mansions" },
      { range: [44, 46], use: "penthouse",   label: "Sky Mansion Collection" },
    ],
    handover: "Q4 2026",
    signature_palette: ["#252504", "#8E5734"],
    hero_pitch:
      "Hyper-Car heritage translated into vertical residence. Curated by Bugatti, crafted by Binghatti.",
    description:
      "182 Riviera Mansions and 11 Sky Mansion Penthouses overlooking the Business Bay water canal. Private car lift to every residence above floor 30. First Bugatti-branded residential project worldwide.",
    bedrooms_offered: [1, 2, 3, 4],
    size_range_sqft: [820, 8200],
    starting_price_aed: 8_900_000,
    cover_blurb: "Bugatti-branded · Private car lift · Business Bay canal",
    cover_image:
      "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1600&q=80",
    hero_image:
      "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2400&q=80",
    accent_image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    slug: "cavalli-couture",
    name: "Cavalli Couture",
    developer: "DAMAC",
    area: "Al Safa",
    city: "Dubai",
    total_floors: 70,
    floor_breakdown: [
      { range: [1, 7],   use: "amenity",     label: "Botanical podium" },
      { range: [8, 60],  use: "residential", label: "Couture Residences" },
      { range: [61, 70], use: "penthouse",   label: "Cavalli Sky Villas" },
    ],
    handover: "Q1 2027",
    signature_palette: ["#252504", "#8E5734"],
    hero_pitch:
      "Roberto Cavalli's flora-and-fauna grammar woven into a 70-storey tower above Safa Park.",
    description:
      "Four corner residences per typical floor — each with its own elevation and unobstructed view of either Burj Khalifa, the Dubai skyline, Safa Park, or Sheikh Zayed Road. Cavalli-curated interiors, jungle-inspired podium, infinity sky pool.",
    bedrooms_offered: [2, 3, 4, 5],
    size_range_sqft: [1620, 9400],
    starting_price_aed: 5_750_000,
    cover_blurb: "Cavalli-curated · Safa Park · Four corners per floor",
    cover_image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
    hero_image:
      "https://images.unsplash.com/photo-1582672060674-bc2bd808a8ce?auto=format&fit=crop&w=2400&q=80",
    accent_image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    slug: "burj-binghatti-jacob-and-co",
    name: "Burj Binghatti Jacob & Co Residences",
    developer: "Binghatti × Jacob & Co.",
    area: "Business Bay",
    city: "Dubai",
    total_floors: 104,
    floor_breakdown: [
      { range: [1, 9],     use: "amenity",     label: "Hypertower podium" },
      { range: [10, 80],   use: "residential", label: "Sky Suites" },
      { range: [81, 100],  use: "penthouse",   label: "Sapphire / Emerald / Ruby Suites" },
      { range: [101, 104], use: "penthouse",   label: "Astronomia Sky Penthouse" },
    ],
    handover: "Q4 2027",
    signature_palette: ["#252504", "#8E5734"],
    hero_pitch:
      "The world's tallest residential tower, watch-mechanism precision by Jacob & Co.",
    description:
      "Slim hypertower with two Sky Suites per typical floor and an Astronomia Sky Penthouse on the crown — modelled on Jacob & Co.'s celestial complications. Concierge, helipad, private chef. Limited release.",
    bedrooms_offered: [3, 4, 5, 7],
    size_range_sqft: [2750, 18500],
    starting_price_aed: 22_000_000,
    cover_blurb: "World's tallest residential · Jacob & Co. · Hypertower",
    cover_image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    hero_image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2400&q=80",
    accent_image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  },
];

// ---------- Unit types -------------------------------------------------------
function buildUnitTypes(): UnitType[] {
  const out: UnitType[] = [];
  let id = 0;

  // Bugatti — 6 typical types + 2 penthouse types (IDs 1..8)
  const bugattiSeed: Array<Partial<UnitType> & {
    designation: string;
    bedrooms: number;
    total: number;
    unit_number_pattern: string;
    floor_range: [number, number];
    view: UnitType["view_orientation"];
    band: UnitType["floor_band"];
    base: number;
    premium: number;
    property: UnitType["property_type"];
  }> = [
    { designation: "Type A — Riviera",   bedrooms: 1, total: 920,  unit_number_pattern: "01", floor_range: [6, 43], view: "sea",        band: "typical", base:  9_200_000, premium: 75_000,  property: "apartment" },
    { designation: "Type B — Riviera",   bedrooms: 2, total: 1480, unit_number_pattern: "02", floor_range: [6, 43], view: "sea",        band: "typical", base: 14_400_000, premium: 110_000, property: "apartment" },
    { designation: "Type C — Riviera",   bedrooms: 1, total: 880,  unit_number_pattern: "03", floor_range: [6, 43], view: "sea",        band: "typical", base:  9_050_000, premium: 72_000,  property: "apartment" },
    { designation: "Type D — Boulevard", bedrooms: 2, total: 1510, unit_number_pattern: "04", floor_range: [6, 43], view: "boulevard",  band: "typical", base: 13_900_000, premium: 100_000, property: "apartment" },
    { designation: "Type E — Boulevard", bedrooms: 3, total: 2180, unit_number_pattern: "05", floor_range: [6, 43], view: "boulevard",  band: "typical", base: 24_800_000, premium: 175_000, property: "apartment" },
    { designation: "Type F — Boulevard", bedrooms: 2, total: 1490, unit_number_pattern: "06", floor_range: [6, 43], view: "boulevard",  band: "typical", base: 13_950_000, premium: 102_000, property: "apartment" },
    { designation: "PH-Riviera",          bedrooms: 4, total: 5200, unit_number_pattern: "PH-01", floor_range: [44, 46], view: "sea",       band: "penthouse", base: 52_000_000, premium: 4_000_000, property: "penthouse" },
    { designation: "PH-Boulevard",        bedrooms: 4, total: 5450, unit_number_pattern: "PH-02", floor_range: [44, 46], view: "boulevard", band: "penthouse", base: 49_500_000, premium: 3_800_000, property: "penthouse" },
  ];

  for (const s of bugattiSeed) {
    id += 1;
    const { plan, rooms } = makePlan(s.bedrooms, s.total);
    const innerSqft = rooms.reduce((a, r) => a + (r.label === "Balcony" || r.label === "Wraparound Terrace" ? 0 : r.size_sqft), 0);
    const balconySqft = (rooms.find(r => r.label === "Balcony" || r.label === "Wraparound Terrace")?.size_sqft) ?? 0;
    out.push({
      id,
      project_id: 1,
      type_designation: s.designation,
      property_type: s.property,
      bedrooms: s.bedrooms,
      bathrooms: s.bedrooms === 1 ? 1 : s.bedrooms === 2 ? 2 : s.bedrooms === 3 ? 3 : 5,
      total_sqft: s.total,
      inner_sqft: innerSqft,
      balcony_sqft: balconySqft,
      rooms,
      unit_number_pattern: s.unit_number_pattern,
      applicable_floor_range: s.floor_range,
      applicable_tower: null,
      view_orientation: s.view,
      floor_band: s.band,
      base_price_aed: s.base,
      premium_per_floor_aed: s.premium,
      plan,
    });
  }

  // Cavalli — 4 typical + 2 penthouse (IDs 9..14)
  const cavalliSeed = [
    { designation: "Type A — Burj View",       bedrooms: 2, total: 1750, unit_number_pattern: "01", floor_range: [8, 60] as [number, number], view: "burj"       as const, band: "typical" as const, base:  6_100_000, premium:  60_000, property: "apartment" as const },
    { designation: "Type B — Skyline",         bedrooms: 3, total: 2450, unit_number_pattern: "02", floor_range: [8, 60] as [number, number], view: "skyline"    as const, band: "typical" as const, base:  9_800_000, premium:  85_000, property: "apartment" as const },
    { designation: "Type C — Park",            bedrooms: 3, total: 2380, unit_number_pattern: "03", floor_range: [8, 60] as [number, number], view: "park"       as const, band: "typical" as const, base:  9_400_000, premium:  82_000, property: "apartment" as const },
    { designation: "Type D — Boulevard",       bedrooms: 2, total: 1720, unit_number_pattern: "04", floor_range: [8, 60] as [number, number], view: "boulevard"  as const, band: "typical" as const, base:  6_050_000, premium:  58_000, property: "apartment" as const },
    { designation: "Sky Villa — Burj/Skyline", bedrooms: 4, total: 6400, unit_number_pattern: "SV-01", floor_range: [61, 70] as [number, number], view: "burj"   as const, band: "penthouse" as const, base: 32_500_000, premium: 2_400_000, property: "sky-villa" as const },
    { designation: "Sky Villa — Park/Blvd",    bedrooms: 4, total: 6250, unit_number_pattern: "SV-02", floor_range: [61, 70] as [number, number], view: "park"   as const, band: "penthouse" as const, base: 30_800_000, premium: 2_300_000, property: "sky-villa" as const },
  ];

  for (const s of cavalliSeed) {
    id += 1;
    const { plan, rooms } = makePlan(s.bedrooms, s.total);
    const innerSqft = rooms.reduce((a, r) => a + (r.label === "Balcony" || r.label === "Wraparound Terrace" ? 0 : r.size_sqft), 0);
    const balconySqft = (rooms.find(r => r.label === "Balcony" || r.label === "Wraparound Terrace")?.size_sqft) ?? 0;
    out.push({
      id,
      project_id: 2,
      type_designation: s.designation,
      property_type: s.property,
      bedrooms: s.bedrooms,
      bathrooms: s.bedrooms + 1,
      total_sqft: s.total,
      inner_sqft: innerSqft,
      balcony_sqft: balconySqft,
      rooms,
      unit_number_pattern: s.unit_number_pattern,
      applicable_floor_range: s.floor_range,
      applicable_tower: null,
      view_orientation: s.view,
      floor_band: s.band,
      base_price_aed: s.base,
      premium_per_floor_aed: s.premium,
      plan,
    });
  }

  // Burj Binghatti — 2 typical + 1 penthouse (IDs 15..17)
  const burjSeed = [
    { designation: "Sky Suite — Burj View", bedrooms: 3, total: 2820, unit_number_pattern: "01",    floor_range: [10, 80] as [number, number],  view: "burj"     as const, band: "typical"   as const, base: 23_500_000, premium: 220_000,   property: "apartment" as const },
    { designation: "Sky Suite — Sea View",  bedrooms: 3, total: 2780, unit_number_pattern: "02",    floor_range: [10, 80] as [number, number],  view: "sea"      as const, band: "typical"   as const, base: 23_200_000, premium: 215_000,   property: "apartment" as const },
    { designation: "Astronomia Sky Penthouse", bedrooms: 7, total: 17800, unit_number_pattern: "PH-01", floor_range: [101, 104] as [number, number], view: "skyline" as const, band: "penthouse" as const, base: 250_000_000, premium: 25_000_000, property: "penthouse" as const },
  ];

  for (const s of burjSeed) {
    id += 1;
    const { plan, rooms } = makePlan(s.bedrooms, s.total);
    const innerSqft = rooms.reduce((a, r) => a + (r.label === "Balcony" || r.label === "Wraparound Terrace" ? 0 : r.size_sqft), 0);
    const balconySqft = (rooms.find(r => r.label === "Balcony" || r.label === "Wraparound Terrace")?.size_sqft) ?? 0;
    out.push({
      id,
      project_id: 3,
      type_designation: s.designation,
      property_type: s.property,
      bedrooms: s.bedrooms,
      bathrooms: s.bedrooms,
      total_sqft: s.total,
      inner_sqft: innerSqft,
      balcony_sqft: balconySqft,
      rooms,
      unit_number_pattern: s.unit_number_pattern,
      applicable_floor_range: s.floor_range,
      applicable_tower: null,
      view_orientation: s.view,
      floor_band: s.band,
      base_price_aed: s.base,
      premium_per_floor_aed: s.premium,
      plan,
    });
  }

  return out;
}

export const UNIT_TYPES: UnitType[] = buildUnitTypes();

// ---------- Floor plates ----------------------------------------------------
export const FLOOR_PLATES: FloorPlate[] = [
  {
    id: 1,
    project_id: 1,
    tower_or_building: "Bugatti Residences",
    plate_designation: "Typical Riviera Floor",
    floor_range: [6, 43],
    units_per_floor: 6,
    layout: bugattiPlateLayout({
      "01": 1, "02": 2, "03": 3, "04": 4, "05": 5, "06": 6,
    }),
  },
  {
    id: 2,
    project_id: 1,
    tower_or_building: "Bugatti Residences",
    plate_designation: "Sky Mansion Floor",
    floor_range: [44, 46],
    units_per_floor: 2,
    layout: {
      viewbox: [0, 0, 100, 100],
      outline: "M 10 15 L 90 15 L 90 85 L 10 85 Z",
      core: "M 45 47 L 55 47 L 55 53 L 45 53 Z",
      common_areas: [
        { type: "elevators", polygon: "M 45 47 L 55 47 L 55 53 L 45 53 Z", label_xy: [50, 50] },
      ],
      positions: [
        { position_number: "PH-01", unit_type_id: 7, view_orientation: "sea",       polygon: "M 10 15 L 90 15 L 90 47 L 55 47 L 55 50 L 45 50 L 45 47 L 10 47 Z", label_xy: [50, 30] },
        { position_number: "PH-02", unit_type_id: 8, view_orientation: "boulevard", polygon: "M 10 53 L 45 53 L 45 50 L 55 50 L 55 53 L 90 53 L 90 85 L 10 85 Z", label_xy: [50, 70] },
      ],
    },
  },
  {
    id: 3,
    project_id: 2,
    tower_or_building: "Cavalli Couture",
    plate_designation: "Typical Couture Floor",
    floor_range: [8, 60],
    units_per_floor: 4,
    layout: cavalliPlateLayout({ "01": 9, "02": 10, "03": 11, "04": 12 }),
  },
  {
    id: 4,
    project_id: 2,
    tower_or_building: "Cavalli Couture",
    plate_designation: "Sky Villa Floor",
    floor_range: [61, 70],
    units_per_floor: 2,
    layout: {
      viewbox: [0, 0, 100, 100],
      outline: "M 10 10 L 90 10 L 90 90 L 10 90 Z",
      core: "M 45 47 L 55 47 L 55 53 L 45 53 Z",
      common_areas: [
        { type: "elevators", polygon: "M 45 47 L 55 47 L 55 53 L 45 53 Z", label_xy: [50, 50] },
      ],
      positions: [
        { position_number: "SV-01", unit_type_id: 13, view_orientation: "burj", polygon: "M 10 10 L 90 10 L 90 47 L 55 47 L 55 50 L 45 50 L 45 47 L 10 47 Z", label_xy: [50, 28] },
        { position_number: "SV-02", unit_type_id: 14, view_orientation: "park", polygon: "M 10 53 L 45 53 L 45 50 L 55 50 L 55 53 L 90 53 L 90 90 L 10 90 Z", label_xy: [50, 72] },
      ],
    },
  },
  {
    id: 5,
    project_id: 3,
    tower_or_building: "Burj Binghatti",
    plate_designation: "Typical Sky Suite Floor",
    floor_range: [10, 80],
    units_per_floor: 2,
    layout: burjPlateLayout({ "01": 15, "02": 16 }),
  },
  {
    id: 6,
    project_id: 3,
    tower_or_building: "Burj Binghatti",
    plate_designation: "Astronomia Sky Penthouse",
    floor_range: [101, 104],
    units_per_floor: 1,
    layout: burjPenthouseLayout({ "PH-01": 17 }),
  },
];

// ---------- Unit instances (auto-generated from plates × floor range) -------
function buildUnitInstances(): UnitInstance[] {
  const out: UnitInstance[] = [];
  const project = (id: number) => PROJECTS.find((p) => p.id === id)!;
  const type    = (id: number) => UNIT_TYPES.find((t) => t.id === id)!;

  for (const plate of FLOOR_PLATES) {
    const proj = project(plate.project_id);
    const [lo, hi] = plate.floor_range;
    const rnd = seeded(plate.id * 9301 + 49297);

    for (let floor = lo; floor <= hi; floor++) {
      for (const pos of plate.layout.positions) {
        const ut = type(pos.unit_type_id);
        const floorAbove = Math.max(0, floor - lo);
        const price = ut.base_price_aed + ut.premium_per_floor_aed * floorAbove;

        // Status distribution: penthouses skew available; typical skews sold
        const r = rnd();
        let status: UnitStatus;
        if (ut.floor_band === "penthouse") {
          status = r < 0.70 ? "available" : r < 0.90 ? "reserved" : "sold";
        } else if (floor > (lo + hi) / 2) {
          status = r < 0.30 ? "sold" : r < 0.55 ? "reserved" : "available";
        } else {
          status = r < 0.65 ? "sold" : r < 0.85 ? "reserved" : "available";
        }

        const unitNumber = pos.position_number.startsWith("PH") || pos.position_number.startsWith("SV")
          ? `${pos.position_number}-${floor}`
          : `${floor}${pos.position_number}`;

        out.push({
          id: `${proj.slug}-${unitNumber}`,
          project_id: proj.id,
          unit_type_id: ut.id,
          floor_plate_id: plate.id,
          unit_number: unitNumber,
          floor_number: floor,
          tower: plate.tower_or_building,
          position_number: pos.position_number,
          view_orientation: pos.view_orientation,
          current_status: status,
          current_asking_price_aed: price,
        });
      }
    }
  }

  return out;
}

export const UNIT_INSTANCES: UnitInstance[] = buildUnitInstances();

// ---------- Convenience lookups --------------------------------------------
export const getProjectBySlug = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug);

export const getUnitType = (id: number) =>
  UNIT_TYPES.find((u) => u.id === id);

export const getFloorPlate = (id: number) =>
  FLOOR_PLATES.find((p) => p.id === id);

export const getUnitInstance = (id: string) =>
  UNIT_INSTANCES.find((u) => u.id === id);

export const getProjectUnitTypes = (projectId: number) =>
  UNIT_TYPES.filter((u) => u.project_id === projectId);

export const getProjectFloorPlates = (projectId: number) =>
  FLOOR_PLATES.filter((p) => p.project_id === projectId);

export const getInstancesByPlateAndFloor = (plateId: number, floor: number) =>
  UNIT_INSTANCES.filter(
    (i) => i.floor_plate_id === plateId && i.floor_number === floor
  );

// Mirrors the v1.1 Floor Plan Atlas data model (see floorplan_atlas_v1_1_addendum.md)

export type PropertyType = "apartment" | "duplex" | "penthouse" | "sky-villa";
export type ViewOrientation =
  | "sea"
  | "boulevard"
  | "skyline"
  | "burj"
  | "park"
  | "marina"
  | "corner";
export type FloorBand = "podium" | "typical" | "premium" | "penthouse";
export type UnitStatus = "available" | "reserved" | "sold";

export interface Project {
  id: number;
  slug: string;
  name: string;
  developer: string;
  area: string;            // community / district
  city: string;
  total_floors: number;
  floor_breakdown: Array<{
    range: [number, number];
    use: "retail" | "amenity" | "residential" | "premium" | "penthouse";
    label?: string;
  }>;
  handover: string;        // ISO yyyy-mm or "Q3 2027" etc.
  signature_palette: [string, string]; // bg accent + fg accent for project chrome
  hero_pitch: string;      // one sentence
  description: string;
  bedrooms_offered: number[];
  size_range_sqft: [number, number];
  starting_price_aed: number;
  cover_blurb: string;     // for the gallery card
  cover_image: string;     // gallery / dashboard card hero
  hero_image: string;      // project detail banner
  accent_image?: string;   // amenity / interior accent
}

export interface RoomBreakdown {
  label: string;
  size_sqft: number;
}

export interface UnitType {
  id: number;
  project_id: number;
  type_designation: string;     // e.g., "Type A", "PH-01"
  property_type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  total_sqft: number;
  inner_sqft: number;
  balcony_sqft: number;
  rooms: RoomBreakdown[];
  unit_number_pattern: string;  // e.g., "01,08" or "01" or "PH-01"
  applicable_floor_range: [number, number];
  applicable_tower: string | null;
  view_orientation: ViewOrientation;
  floor_band: FloorBand;
  base_price_aed: number;       // starting price per unit of this type
  premium_per_floor_aed: number;// floor uplift multiplier
  // SVG layout for the unit plan itself, in 0..100 coords
  plan: {
    outline: string;            // SVG path d=""
    rooms: Array<{
      label: string;
      polygon: string;          // SVG path d=""
      sqft: number;
    }>;
  };
}

export interface FloorPlatePosition {
  position_number: string;      // "01", "PH-01"
  unit_type_id: number;
  view_orientation: ViewOrientation;
  polygon: string;              // SVG path d="", in 0..100 viewport coords
  label_xy: [number, number];   // label placement
}

export interface FloorPlate {
  id: number;
  project_id: number;
  tower_or_building: string | null;
  plate_designation: string;    // "Typical Floor", "Premium Floor", "Penthouse"
  floor_range: [number, number];
  units_per_floor: number;
  layout: {
    viewbox: [number, number, number, number]; // x,y,w,h
    outline: string;            // building footprint
    core: string;               // lobby/lifts/stairs polygon
    common_areas: Array<{
      type: "lobby" | "elevators" | "stairs" | "corridor" | "service";
      polygon: string;
      label_xy: [number, number];
    }>;
    positions: FloorPlatePosition[];
  };
}

export interface UnitInstance {
  id: string;                   // "<projectSlug>-<floor><position>"
  project_id: number;
  unit_type_id: number;
  floor_plate_id: number;
  unit_number: string;          // e.g., "2501"
  floor_number: number;
  tower: string | null;
  position_number: string;
  view_orientation: ViewOrientation;
  current_status: UnitStatus;
  current_asking_price_aed: number;
}

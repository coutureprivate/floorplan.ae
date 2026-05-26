// Stock unit-plan SVG templates by bedroom count.
// Each plan uses a 0..100 x 0..100 viewbox. The viewer renders these at
// either true-scale (driven by total_sqft) or fit-to-frame.

import type { RoomBreakdown, UnitType } from "./types";

type PlanShape = UnitType["plan"];

const rect = (x: number, y: number, w: number, h: number) =>
  `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;

export function makePlan(
  bedrooms: number,
  totalSqft: number,
  balconyRatio = 0.12
): { plan: PlanShape; rooms: RoomBreakdown[] } {
  const balconySqft = Math.round(totalSqft * balconyRatio);
  const innerSqft = totalSqft - balconySqft;

  if (bedrooms <= 1) {
    const living = Math.round(innerSqft * 0.45);
    const kitchen = Math.round(innerSqft * 0.15);
    const bedroom = Math.round(innerSqft * 0.27);
    const bath = innerSqft - living - kitchen - bedroom;
    const rooms: RoomBreakdown[] = [
      { label: "Living / Dining", size_sqft: living },
      { label: "Kitchen",         size_sqft: kitchen },
      { label: "Bedroom",         size_sqft: bedroom },
      { label: "Bathroom",        size_sqft: bath },
      { label: "Balcony",         size_sqft: balconySqft },
    ];
    return {
      rooms,
      plan: {
        outline: rect(0, 0, 100, 100),
        rooms: [
          { label: "Living / Dining", polygon: rect(0, 0, 60, 55),   sqft: living },
          { label: "Kitchen",         polygon: rect(60, 0, 40, 30),  sqft: kitchen },
          { label: "Bath",            polygon: rect(60, 30, 40, 25), sqft: bath },
          { label: "Bedroom",         polygon: rect(0, 55, 70, 33),  sqft: bedroom },
          { label: "Ensuite",         polygon: rect(70, 55, 30, 33), sqft: Math.round(bath * 0.6) },
          { label: "Balcony",         polygon: rect(0, 88, 100, 12), sqft: balconySqft },
        ],
      },
    };
  }

  if (bedrooms === 2) {
    const living = Math.round(innerSqft * 0.32);
    const kitchen = Math.round(innerSqft * 0.12);
    const master = Math.round(innerSqft * 0.22);
    const bed2 = Math.round(innerSqft * 0.18);
    const bath = innerSqft - living - kitchen - master - bed2;
    const rooms: RoomBreakdown[] = [
      { label: "Living / Dining", size_sqft: living },
      { label: "Kitchen",         size_sqft: kitchen },
      { label: "Master Bedroom",  size_sqft: master },
      { label: "Bedroom 2",       size_sqft: bed2 },
      { label: "Bathrooms",       size_sqft: bath },
      { label: "Balcony",         size_sqft: balconySqft },
    ];
    return {
      rooms,
      plan: {
        outline: rect(0, 0, 100, 100),
        rooms: [
          { label: "Living / Dining", polygon: rect(0, 0, 55, 48),    sqft: living },
          { label: "Kitchen",         polygon: rect(55, 0, 45, 26),   sqft: kitchen },
          { label: "Powder",          polygon: rect(55, 26, 22, 22),  sqft: Math.round(bath * 0.2) },
          { label: "Foyer",           polygon: rect(77, 26, 23, 22),  sqft: 0 },
          { label: "Master Bedroom",  polygon: rect(0, 48, 50, 40),   sqft: master },
          { label: "Ensuite",         polygon: rect(0, 78, 50, 10),   sqft: Math.round(bath * 0.4) },
          { label: "Bedroom 2",       polygon: rect(50, 48, 50, 28),  sqft: bed2 },
          { label: "Bath 2",          polygon: rect(50, 76, 50, 12),  sqft: Math.round(bath * 0.4) },
          { label: "Balcony",         polygon: rect(0, 88, 100, 12),  sqft: balconySqft },
        ],
      },
    };
  }

  if (bedrooms === 3) {
    const living = Math.round(innerSqft * 0.28);
    const kitchen = Math.round(innerSqft * 0.10);
    const master = Math.round(innerSqft * 0.20);
    const bed2 = Math.round(innerSqft * 0.14);
    const bed3 = Math.round(innerSqft * 0.13);
    const bath = innerSqft - living - kitchen - master - bed2 - bed3;
    const rooms: RoomBreakdown[] = [
      { label: "Living / Dining", size_sqft: living },
      { label: "Kitchen",         size_sqft: kitchen },
      { label: "Master Bedroom",  size_sqft: master },
      { label: "Bedroom 2",       size_sqft: bed2 },
      { label: "Bedroom 3",       size_sqft: bed3 },
      { label: "Bathrooms",       size_sqft: bath },
      { label: "Balcony",         size_sqft: balconySqft },
    ];
    return {
      rooms,
      plan: {
        outline: rect(0, 0, 100, 100),
        rooms: [
          { label: "Living / Dining", polygon: rect(0, 0, 55, 45),    sqft: living },
          { label: "Kitchen",         polygon: rect(55, 0, 45, 22),   sqft: kitchen },
          { label: "Dining",          polygon: rect(55, 22, 45, 23),  sqft: Math.round(living * 0.2) },
          { label: "Master Bedroom",  polygon: rect(0, 45, 45, 30),   sqft: master },
          { label: "Master Ensuite",  polygon: rect(0, 75, 45, 13),   sqft: Math.round(bath * 0.4) },
          { label: "Bedroom 2",       polygon: rect(45, 45, 30, 22),  sqft: bed2 },
          { label: "Bath 2",          polygon: rect(45, 67, 30, 10),  sqft: Math.round(bath * 0.3) },
          { label: "Bedroom 3",       polygon: rect(75, 45, 25, 30),  sqft: bed3 },
          { label: "Bath 3",          polygon: rect(45, 77, 55, 11),  sqft: Math.round(bath * 0.3) },
          { label: "Balcony",         polygon: rect(0, 88, 100, 12),  sqft: balconySqft },
        ],
      },
    };
  }

  // 4+ bedrooms = penthouse / sky-villa
  const living = Math.round(innerSqft * 0.25);
  const kitchen = Math.round(innerSqft * 0.08);
  const master = Math.round(innerSqft * 0.18);
  const bed2 = Math.round(innerSqft * 0.12);
  const bed3 = Math.round(innerSqft * 0.11);
  const bed4 = Math.round(innerSqft * 0.10);
  const study = Math.round(innerSqft * 0.06);
  const bath = innerSqft - living - kitchen - master - bed2 - bed3 - bed4 - study;
  const rooms: RoomBreakdown[] = [
    { label: "Grand Living / Dining", size_sqft: living },
    { label: "Show Kitchen",          size_sqft: kitchen },
    { label: "Master Suite",          size_sqft: master },
    { label: "Bedroom 2",             size_sqft: bed2 },
    { label: "Bedroom 3",             size_sqft: bed3 },
    { label: "Bedroom 4",             size_sqft: bed4 },
    { label: "Study / Lounge",        size_sqft: study },
    { label: "Bathrooms / Powder",    size_sqft: bath },
    { label: "Wraparound Terrace",    size_sqft: balconySqft },
  ];
  return {
    rooms,
    plan: {
      outline: rect(0, 0, 100, 100),
      rooms: [
        { label: "Grand Living / Dining", polygon: rect(10, 10, 55, 35), sqft: living },
        { label: "Show Kitchen",          polygon: rect(65, 10, 25, 20), sqft: kitchen },
        { label: "Dining",                polygon: rect(65, 30, 25, 15), sqft: Math.round(living * 0.2) },
        { label: "Master Suite",          polygon: rect(10, 45, 40, 25), sqft: master },
        { label: "Master Ensuite",        polygon: rect(10, 70, 40, 12), sqft: Math.round(bath * 0.35) },
        { label: "Study / Lounge",        polygon: rect(50, 45, 20, 25), sqft: study },
        { label: "Bedroom 2",             polygon: rect(70, 45, 20, 18), sqft: bed2 },
        { label: "Bath 2",                polygon: rect(70, 63, 20, 8),  sqft: Math.round(bath * 0.2) },
        { label: "Bedroom 3",             polygon: rect(50, 70, 20, 12), sqft: bed3 },
        { label: "Bedroom 4",             polygon: rect(70, 70, 20, 12), sqft: bed4 },
        { label: "Powder / Service",      polygon: rect(50, 82, 40, 6),  sqft: Math.round(bath * 0.15) },
        { label: "Wraparound Terrace",    polygon: rect(0, 0, 100, 100), sqft: balconySqft }, // visual handled separately
      ].filter((r) => r.label !== "Wraparound Terrace"),
    },
  };
}

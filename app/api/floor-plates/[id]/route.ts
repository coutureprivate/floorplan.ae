import { NextResponse } from "next/server";
import {
  getFloorPlate,
  getInstancesByPlateAndFloor,
  getUnitType,
} from "@/lib/mockData";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(req.url);
  const floorParam = url.searchParams.get("floor");

  const plate = getFloorPlate(Number(id));
  if (!plate) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const floor =
    floorParam != null ? Number(floorParam) : plate.floor_range[0];

  const instances = getInstancesByPlateAndFloor(plate.id, floor);
  const unitTypes = plate.layout.positions.map((p) => ({
    position_number: p.position_number,
    unit_type: getUnitType(p.unit_type_id),
  }));

  return NextResponse.json({
    plate,
    floor,
    instances,
    unit_types: unitTypes,
  });
}

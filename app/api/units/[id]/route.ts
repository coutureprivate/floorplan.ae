import { NextResponse } from "next/server";
import {
  getUnitInstance,
  getUnitType,
  getFloorPlate,
  PROJECTS,
} from "@/lib/mockData";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const instance = getUnitInstance(decodeURIComponent(id));
  if (!instance) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const unit_type = getUnitType(instance.unit_type_id);
  const plate = getFloorPlate(instance.floor_plate_id);
  const project = PROJECTS.find((p) => p.id === instance.project_id);

  return NextResponse.json({ instance, unit_type, plate, project });
}

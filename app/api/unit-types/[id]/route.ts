import { NextResponse } from "next/server";
import { getUnitType, PROJECTS, UNIT_INSTANCES } from "@/lib/mockData";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const unit_type = getUnitType(Number(id));
  if (!unit_type) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const project = PROJECTS.find((p) => p.id === unit_type.project_id);
  const instances = UNIT_INSTANCES.filter((i) => i.unit_type_id === unit_type.id);
  const available = instances.filter((i) => i.current_status === "available");

  return NextResponse.json({
    unit_type,
    project,
    instance_count: instances.length,
    available_count: available.length,
    sample_available: available.slice(0, 8),
  });
}
